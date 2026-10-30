import { NextRequest, NextResponse } from "next/server";

// Системный промпт и контекст демо-пациента (синтетический сценарий из lib/demo-data.ts)
const SYSTEM_PROMPT = `Ты — ИИ-помощник Dariger AI (платформа распознавания медицинской речи для Казахстана).

Тебя спрашивают два типа людей:
1. Посетители сайта (лендинг): отвечай как продукт-помощник — распознавание смешанной казахско-русской речи с мед. латынью, черновик по форме №052/у, интеграция с МИС (DamuMed, расширение или API), обезличивание данных и серверы в РК, демо-кабинет по кнопке «Демо». Тарифы — индивидуально, предлагай оставить заявку.
2. Врачи в демо-кабинете: отвечай как клинический ассистент — контекст пациента ниже.

В обоих случаях: по-русски, кратко (2–4 предложения), вежливо; для продуктовых вопросов не выдумывай цены и функции, которых нет; клинические подсказки сопровождай «решение за врачом». Если вопрос вне тематики — мягко верни разговор к Dariger AI.

Контекст пациента (демо-сценарий, синтетические данные):
- Пациентка: Ибрагимова Айгерим, 48 лет.
- Жалобы: головокружение по утрам ~3 недели, лёгкая тошнота, головная боль в затылке, ощущение перебоев в сердце.
- Домашнее АД: утром до 150/95, вечером ~138/85.
- Терапия: эналаприл 5 мг утром, нерегулярно (пропуски ~2 раза в неделю).
- Объективно: АД 148/92. Предварительный диагноз: I10 эссенциальная гипертензия.

Для клинических вопросов: ссылайся на протоколы МЗ РК и МКБ-10, где уместно; напоминай, что решение принимает врач.`;

// Простой in-memory rate-limit: 30 запросов с одного IP за 5 минут
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE_MAX;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Локальные заготовленные ответы — используются, если ключ ИИ не настроен.
// Держат демо живым на статическом GitHub Pages без сервера.
function fallbackReply(userText: string): string {
  const t = userText.toLowerCase();
  if (t.includes("нпвп") || t.includes("совместим")) {
    return "Внимание: при одновременном приёме иАПФ (эналаприл) и НПВП возможно снижение антигипертензивного эффекта и риск ухудшения функции почек (контроль СКФ).";
  }
  return "По клиническому протоколу МЗ РК при неэффективности монотерапии эналаприлом 5 мг рекомендуется комбинация с антагонистом кальция (амлодипин 5 мг) или диуретиком (индапамид 1.5 мг).";
}

// CORS: демо на GitHub Pages зовёт мост из браузера — без этих заголовков
// браузер блокирует чтение ответа (Failed to fetch на POST с Content-Type).
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.messages)) {
      messages = body.messages
        .filter((m: ChatMessage) => m && typeof m.content === "string" && m.content.length < 2000)
        .slice(-12); // только последние 12 сообщений — экономим токены
    }
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (messages.length === 0) {
    return NextResponse.json({ error: "empty_messages" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const baseUrl = process.env.AI_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  // Без ключа — демо-режим с заготовленными ответами
  if (!baseUrl || !apiKey) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    return NextResponse.json({
      reply: fallbackReply(lastUser?.content ?? ""),
      mode: "fallback",
    });
  }

  // Модель иногда отдаёт обрывки (одна буква, «**») — до 3 попыток с нарастающим ожиданием
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 500,
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!upstream.ok) {
        await sleep(attempt * 800);
        continue;
      }

      const data = await upstream.json();
      const reply = data?.choices?.[0]?.message?.content;
      // Обрывки модели («При», «Г», «**») — неудачная попытка; на повторе просим продолжить
      const clean = typeof reply === "string" ? reply.trim() : "";
      if (clean.replace(/[*\s]/g, "").length < 60) {
        await sleep(attempt * 700);
        continue;
      }
      return NextResponse.json({ reply: clean, mode: "ai" }, { headers: CORS_HEADERS });
    } catch {
      await sleep(attempt * 800);
    }
  }
  return NextResponse.json({ reply: fallbackReply(messages[messages.length - 1]?.content ?? ""), mode: "fallback" }, { headers: CORS_HEADERS });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
