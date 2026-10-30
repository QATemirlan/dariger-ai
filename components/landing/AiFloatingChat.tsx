"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "Здравствуйте! Я — ИИ-помощник Dariger AI. Задайте мне вопрос о продукте, распознавании казахской речи, интеграции с МИС или безопасности данных — я отвечу.";

/** Локальные заготовки — если мост недоступен, виджет продолжает работать */
function localReply(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("цена") || q.includes("стоимость") || q.includes("тариф"))
    return "Ценообразование обсуждается индивидуально под клинику — оставьте заявку через форму ниже на странице, и мы пришлём расчёт.";
  if (q.includes("мис") || q.includes("damumed") || q.includes("интеграц"))
    return "Dariger встраивается в ваш процесс: браузерное расширение поверх DamuMed или прямой API/WebSocket для разработчиков МИС. Подробнее — в разделе «Как работает».";
  if (q.includes("безопас") || q.includes("данн"))
    return "Данные обезличиваются до передачи в модель (ИИН и ФИО заменяются токенами), обработка — на серверах в РК, есть аудит доступа. Раздел «Безопасность» ниже на странице.";
  if (q.includes("казах") || q.includes("язык") || q.includes("kk"))
    return "Да, распознаём смешанную казахско-русскую речь и медицинскую латынь в реальном времени — это одна из ключевых компетенций платформы.";
  return "Я ИИ-помощник Dariger AI: расскажу про распознавание kk/ru речи, интеграцию с МИС и безопасность данных. Клинический сценарий можно посмотреть в демо-кабинете по кнопке «Демо» в шапке.";
}

export default function AiFloatingChat() {
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Приветственная плашка через 4 секунды после загрузки
  useEffect(() => {
    const t = window.setTimeout(() => setGreeted(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  // Автоскролл истории
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, typing]);

  const send = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = input.trim();
    if (!q || typing) return;
    setGreeted(true);
    setInput("");
    const history = [...messages, { role: "user", content: q }] as Message[];
    setMessages(history);
    setTyping(true);

    try {
      const base =
        process.env.NEXT_PUBLIC_AI_URL ?? "https://qatemirlantemir-001-site1.ftempurl.com";
      const res = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: AbortSignal.timeout(32_000),
      });
      const data = await res.json();
      const reply =
        typeof data?.reply === "string" && data.reply.replace(/[*\s]/g, "").length >= 20
          ? data.reply.trim()
          : localReply(q);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      setMessages((prev) => [...prev, { role: "assistant", content: localReply(q) }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Всплывающая плашка-приветствие */}
      <AnimatePresence>
        {greeted && !open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="fixed bottom-24 right-5 z-40 w-64 rounded-2xl bg-dark text-white p-4 shadow-2xl"
          >
            <button
              onClick={() => setGreeted(false)}
              aria-label="Скрыть подсказку"
              className="absolute top-2.5 right-2.5 text-white/50 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="flex items-center gap-2 text-[11px] font-bold text-accent-light uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> ИИ-помощник
            </p>
            <p className="text-[13px] leading-relaxed mt-1.5">
              Я ваш личный помощник — задайте мне вопрос о Dariger AI.
            </p>
            <button
              onClick={() => {
                setOpen(true);
                if (messages.length === 0) setMessages([{ role: "assistant", content: GREETING }]);
              }}
              className="mt-2.5 inline-block text-xs font-semibold text-accent-light hover:underline"
            >
              Задать вопрос →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Плавающая кнопка */}
      <button
        onClick={() => {
          setOpen((v) => {
            if (!v && messages.length === 0) setMessages([{ role: "assistant", content: GREETING }]);
            return !v;
          });
          setGreeted(true);
        }}
        aria-label={open ? "Закрыть ИИ-помощника" : "Открыть ИИ-помощника"}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-accent text-white shadow-xl shadow-accent/30 flex items-center justify-center active:scale-95 transition-transform hover:scale-105"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* Панель чата */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-5 z-40 w-[calc(100vw-40px)] sm:w-96 h-[480px] max-h-[70vh] rounded-3xl bg-white border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Шапка */}
            <div className="p-4 border-b border-border bg-paper flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">ИИ-помощник Dariger</p>
                  <p className="text-[11px] text-success flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" /> онлайн
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть чат"
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* История */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`text-[13px] rounded-2xl p-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-white ml-8 rounded-br-md"
                      : "bg-paper border border-border text-ink mr-4 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {typing && (
                <div className="text-[13px] rounded-2xl p-3 bg-paper border border-border mr-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-muted">печатает…</span>
                </div>
              )}
            </div>

            {/* Ввод */}
            <form onSubmit={send} className="p-3 border-t border-border bg-white flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Задайте мне вопрос…"
                className="flex-1 rounded-xl bg-paper border border-border px-3.5 py-2.5 text-[13px] focus:outline-accent"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Отправить"
                className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 hover:bg-accent-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
