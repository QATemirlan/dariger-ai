"use client";
import { motion } from "framer-motion";
import Eyebrow from "@/components/shared/Eyebrow";

const layers = [
  {
    name: "Dariger Scribe",
    desc: "Фоновая запись, транскрипт kk/ru, черновик по формам РК, автозаполнение МИС.",
    color: "bg-accent",
  },
  {
    name: "Dariger Connect",
    desc: "API и SDK для разработчиков МИС — WebSocket-стриминг, webhooks, виджет.",
    color: "bg-accent-deep",
  },
  {
    name: "Инфраструктура и данные",
    desc: "Локальный контур в РК, обезличивание персональных данных, аудит доступа.",
    color: "bg-dark",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PlatformLayers() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Левая часть — слои */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-4"
          >
            {layers.map((l, i) => (
              <motion.div
                key={l.name}
                variants={item}
                className={`rounded-2xl p-6 text-white ${l.color}`}
                style={{ marginLeft: `${i * 16}px` }}
              >
                <h3 className="font-display text-xl font-bold mb-1">{l.name}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{l.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Правая часть — описание */}
          <div>
            <Eyebrow>Платформа</Eyebrow>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Одна платформа, три слоя
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              Dariger Scribe и Dariger Connect работают на единой
              инфраструктуре обработки медицинской речи. Данные
              обезличиваются до передачи в модели и хранятся
              в локальном контуре.
            </p>
            <ul className="space-y-3">
              {[
                "Распознавание смешанной kk/ru речи с мед. латынью",
                "Обезличивание ФИО и ИИН перед LLM-обработкой",
                "Структурирование по МКБ-10 и формам МЗ РК",
                "Перенос в МИС через расширение или API",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
