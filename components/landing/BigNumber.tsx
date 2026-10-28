"use client";
import { motion } from "framer-motion";
import Eyebrow from "@/components/shared/Eyebrow";

const stats = [
  { value: "8 мин", label: "экономия на каждом приёме", note: "целевой ориентир" },
  { value: "100%", label: "полнота заполнения полей", note: "целевой ориентир" },
  { value: "<4 с", label: "генерация черновика", note: "целевой ориентир" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BigNumber() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Результат</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-12 max-w-2xl">
          Что получает клиника
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-5"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              className="rounded-2xl border border-border bg-card p-8 text-center"
            >
              <p className="font-display text-5xl font-bold text-accent">{s.value}</p>
              <p className="text-sm font-medium mt-3">{s.label}</p>
              <p className="text-xs text-muted mt-2 rounded-full bg-accent-pale inline-block px-3 py-1">
                {s.note}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
