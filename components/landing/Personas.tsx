"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Stethoscope, Hospital, Code2 } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const personas = [
  {
    icon: Stethoscope,
    role: "Врач клиники",
    pain: "После каждого приёма — ещё 8–10 минут на оформление карты в МИС, пока следующий пациент уже ждёт под дверью.",
    value: "Dariger формирует структурированный черновик прямо во время разговора. Врач проверяет, вносит правки и нажимает «Подписать».",
    metrics: "Экономия до 1.5 часов каждый день",
  },
  {
    icon: Hospital,
    role: "Руководитель клиники",
    pain: "Разное качество записей у разных врачей, риск штрафов от страховых компаний и ФСМС за неполноту медицинских карт.",
    value: "Единые стандарты заполнения, автоматическая сверка с клиническими протоколами РК и отсутствие пропусков обязательных полей.",
    metrics: "100% стандартизация протоколов",
  },
  {
    icon: Code2,
    role: "Разработчик МИС",
    pain: "Необходимо внедрить ИИ-помощника для соответствия требованиям приказа МЗ РК №79, не создавая ASR/NLP команду с нуля.",
    value: "Dariger Connect предоставляет готовый WebSocket API, SDK для браузера и серверные компоненты в локальном ЦОД Казахстана.",
    metrics: "Интеграция за считанные дни",
  },
];

export default function Personas() {
  const [active, setActive] = useState(0);
  const p = personas[active];

  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Для кого</Eyebrow>
        <div className="flex items-end justify-between gap-6 mb-10">
          <h2 className="font-display text-3xl sm:text-5xl font-bold">
            Кому помогает Dariger AI
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActive((active + 2) % 3)}
              aria-label="Предыдущий сценарий"
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-accent-pale transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActive((active + 1) % 3)}
              aria-label="Следующий сценарий"
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-accent-pale transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-white border border-border p-8 md:p-12 grid md:grid-cols-[0.8fr_1.2fr] gap-8 shadow-sm"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center shadow-md shadow-accent/20">
                <p.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold mt-5">{p.role}</h3>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-pale px-3.5 py-1 text-xs font-semibold text-accent">
                {p.metrics}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
                  Боль и проблема
                </p>
                <p className="text-base text-ink leading-relaxed">{p.pain}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
                  Решение с Dariger AI
                </p>
                <p className="text-base text-ink leading-relaxed font-medium">{p.value}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
