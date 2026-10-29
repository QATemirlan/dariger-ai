"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import Eyebrow from "@/components/shared/Eyebrow";

const faqs = [
  [
    "Dariger AI ставит диагнозы или назначает лечение?",
    "Нет. Dariger AI — это цифровой ассистент врача, автоматизирующий ведение медицинской документации. Он транскрибирует разговор, структурирует его по форме №052/у и формирует черновик протокола. Клинические решения и подписание карты всегда остаются исключительно за врачом.",
  ],
  [
    "Как система справляется со смешанной казахско-русской речью?",
    "Мы используем специализированные модели распознавания речи (ASR) с поддержкой code-switching (переключения языков в одном предложении), обученные на медицинской терминологии, казахском языке, русском языке и медицинской латыни.",
  ],
  [
    "Как происходит интеграция с нашей МИС (DamuMed и др.)?",
    "Есть два пути: 1) Браузерное расширение Dariger Extension — работает сразу поверх веб-версии любой МИС без необходимости доработки со стороны поставщика МИС; 2) Прямой REST/WebSocket API для разработчиков медицинских информационных систем.",
  ],
  [
    "Где хранятся и обрабатываются медицинские данные?",
    "Обработка и хранение данных осуществляются на серверах, расположенных на территории Республики Казахстан. Перед отправкой аудио в языковую модель все персональные данные (ИИН, ФИО, телефон) автоматически деидентифицируются.",
  ],
  [
    "Сколько времени экономит врач с Dariger AI?",
    "По нашим расчетам, рутинное время на заполнение карты сокращается с 8–10 минут до 1–2 минут на одного пациента. За день врач освобождает от 1.5 до 2.5 часов рабочего времени.",
  ],
];

export default function FaqCta() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-6">
      <div className="mx-auto max-w-4xl">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-10">
          Часто задаваемые вопросы
        </h2>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map(([q, a], i) => (
            <div key={q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between py-5 text-left gap-4 font-semibold text-base sm:text-lg hover:text-accent transition-colors"
              >
                <span>{q}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    open === i ? "rotate-180 text-accent" : "text-muted"
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-muted leading-relaxed text-sm sm:text-base">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Финальный CTA Баннер */}
      <div className="mx-auto max-w-6xl mt-20 rounded-3xl bg-accent text-white p-10 md:p-16 text-center relative overflow-hidden shadow-xl shadow-accent/20">
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/80 font-bold mb-3">
            Начните сегодня
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4">
            Освободите время врача для настоящего лечения
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
            Попробуйте интерактивное демо и посмотрите, как живой разговор
            превращается в готовую медицинскую карту за секунды.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full bg-white text-accent px-8 py-3.5 font-bold hover:bg-accent-pale transition-colors shadow-lg"
            >
              Открыть демо-кабинет <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how"
              className="rounded-full border border-white/30 text-white px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
