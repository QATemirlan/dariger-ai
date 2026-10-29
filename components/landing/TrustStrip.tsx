"use client";
import { motion } from "framer-motion";

const badges = [
  "Форма №052/у",
  "МКБ‑10",
  "Казахский + Русский",
  "Мед. латынь",
  "Обезличивание ПДн",
  "Локальный контур РК",
];

export default function TrustStrip() {
  return (
    <section className="py-10 px-6 border-y border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium text-muted"
            >
              {b}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
