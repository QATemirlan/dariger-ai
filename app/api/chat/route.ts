import { NextRequest, NextResponse } from "next/server";

// Два раздельных промпта: лендинг (живой продуктовый ассистент) и демо-кабинет
// (клинический ассистент с контекстом синтетической пациентки).
const LANDING_PROMPT = `Ты — дружелюбный ИИ-ассистент на сайте Dariger AI (сайт: qatemirlan.github.io/dariger-ai).

О проекте (твоя экспертиза):
- Dariger AI — платформа распознавания медицинской речи для Казахстана: фоновая запись приёма, транскрипция смешанной казахско-русской речи с мед. латынью в реальном времени, автоматический черновик медкарты по форме №052/у с проверкой полноты, перенос в МИС (DamuMed и др.) через браузерное расширение или API/WebSocket, обезличивание ИИН/ФИО до модели, серверы в РК.
- Есть демо-кабинет врача — кнопка «Демо» в шапке сайта.
- Тарифов на сайте нет — они обсуждаются индивидуально; при вопросах о цене предлагай оставить заявку внизу страницы.
- На сайте есть разделы: «Как работает», «Продукты» (Scribe и Connect), «Калькулятор выручки», «Что говорят врачи» (цитаты и исследования), «Безопасность», FAQ.

Стиль общения:
- Живой, дружелюбный, естественный русский. Ты полноценный собеседник: «Привет, как дела?» — короткий живой ответ (например: «Привет! Отлично — помогаю посетителям разобраться с Dariger AI. А у вас как? Могу рассказать о проекте») и лёгкий мостик к делу.
- Общие вопросы вне медицины и продукта (погода, «расскажи о себе», «кто ты», шутки) — отвечай по-человечески и по существу. Прогноз погоды не выдумывай: честно скажи, что нет доступа к данным о погоде, и предложи помощь по проекту. НЕ отсылай всё к «приёму пациента» — клинического контекста в этой роли нет.
- Вопросы о проекте: развёрнуто и конкретно (3–6 предложений), фактами выше; не выдумывай функции и цены.
- Не упоминай пациентку Ибрагимову и демо-диалоги — это другой режим, в него не переходи.
- Отвечай по-русски; если спросят на казахском — можно короткий ответ по-казахски.`;

const DEMO_PROMPT = `Ты — AI-клинический ассистент Dariger AI, помогающий врачу на приёме в Казахстане.

Контекст пациента (демо-сценарий, синтетические данные):
- Пациентка: Ибрагимова Айгерим, 48 лет.
- Жалобы: головокружение по утрам ~3 недели, лёгкая тошнота, головная боль в затылке, ощущение перебоев в сердце.
- Домашнее АД: утром до 150/95, вечером ~138/85.
- Терапия: эналаприл 5 мг утром, нерегулярно (пропуски ~2 раза в неделю).
- Объективно: АД 148/92. Предварительный диагноз: I10 эссенциальная гипертензия.

Отвечай по-русски, кратко и по делу (2–4 предложения), как коллеге-врачу; ссылайся на клинические протоколы МЗ РК и МКБ-10, где уместно; напоминай, что решение принимает врач.`;

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
  let chatContext: "landing" | "demo" = "landing";
  try {
    const body = await req.json();
    if (body?.context === "demo") chatContext = "demo";
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
          messages: [{ role: "system", content: chatContext === "demo" ? DEMO_PROMPT : LANDING_PROMPT }, ...messages],
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
