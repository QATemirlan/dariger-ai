"use client";
import { motion } from "framer-motion";
import { Check, Mail, MessageSquareHeart, Send } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const points = [
  {
    title: "Оценка консультации по клинической модели общения",
    text: "Анализ диалога врача и пациента: открытые вопросы, эмпатия, объяснение диагноза и назначений понятным языком.",
  },
  {
    title: "Выявление сильных и слабых зон коммуникации",
    text: "Руководитель клиники видит агрегированную картину по врачам, врач — персональные рекомендации без ручного прослушивания записей.",
  },
  {
    title: "Автоматическое письмо пациенту после приёма",
    text: "Пациент получает понятное резюме приёма: диагноз, назначения и рекомендации — это снижает число повторных звонков и повышает лояльность.",
  },
];

export default function CommunicationQuality() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Текст */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Eyebrow>Качество приёма</Eyebrow>
          <h2 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4">
            Контроль и анализ{" "}
            <span className="text-accent">коммуникации</span>
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-8">
            Dariger помогает контролировать качество консультаций и снижать риск
            спорных ситуаций — без ручной рутины и прослушивания записей.
          </p>

          <div className="inline-flex items-baseline gap-3 mb-8">
            <span className="font-display text-6xl sm:text-7xl font-bold text-accent">
              100%
            </span>
            <span className="text-sm text-muted max-w-[220px] leading-snug">
              приёмов попадает в анализ — письмо пациенту уходит автоматически
            </span>
          </div>

          <div className="space-y-5">
            {points.map((p) => (
              <div key={p.title} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-pale border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-accent" />
                </span>
                <div>
                  <p className="font-semibold text-ink text-sm sm:text-base">
                    {p.title}
                  </p>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Мокап письма пациенту */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-accent-pale/60 rounded-[2rem] -z-10" />
          <div className="rounded-2xl border border-border bg-white shadow-xl overflow-hidden">
            {/* Шапка почты */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-paper">
              <span className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                <Mail className="w-4.5 h-4.5 text-white" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-ink truncate">
                  Резюме вашего приёма — Клиника «Дәрігер», 28 октября
                </p>
                <p className="text-[11px] text-muted truncate">
                  Отправлено автоматически через Dariger AI
                </p>
              </div>
              <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                Отправлено
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-sm">
              <p className="text-ink leading-relaxed">
                Здравствуйте, Айгерим! Сегодня на приёме врач-терапевт поставил
                предварительный диагноз: <strong>эссенциальная гипертензия
                (I10)</strong>.
              </p>

              <div className="rounded-xl border border-border bg-paper p-4">
                <p className="text-[11px] font-bold text-accent uppercase tracking-wider mb-2">
                  Назначения
                </p>
                <ul className="space-y-1.5 text-xs text-ink">
                  <li className="flex gap-2">
                    <span className="text-accent">•</span> Эналаприл 10 мг — 1 раз в сутки, утром
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span> Дневник давления — 2 раза в день
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span> Контрольный приём через 3 недели
                  </li>
                </ul>
              </div>

              <p className="text-muted leading-relaxed text-xs">
                Если появятся вопросы или ухудшится самочувствие — свяжитесь с
                клиникой: +7 (___) ___-__-__. Берегите себя!
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[11px] text-muted flex items-center gap-1.5">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-accent" />
                  Клиника «Дәрігер», Астана
                </span>
                <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 text-white" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
