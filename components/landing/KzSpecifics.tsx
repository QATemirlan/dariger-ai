"use client";
import { motion } from "framer-motion";
import { Languages, FileCheck2, MapPinned, Blocks } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const items = [
  {
    icon: Languages,
    title: "Смешанная речь",
    text: "Қазақша, русский, медицинская латынь — переключение языков внутри одной фразы.",
  },
  {
    icon: FileCheck2,
    title: "Документация РК",
    text: "Структура первичных форм, МКБ-10 и справочники с локальной спецификой.",
  },
  {
    icon: MapPinned,
    title: "Локальный контур",
    text: "Размещение и обработка данных на территории Казахстана — архитектурное требование.",
  },
  {
    icon: Blocks,
    title: "Поверх существующей МИС",
    text: "Расширение браузера, API/SDK или отдельное внедрение в систему клиники.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function KzSpecifics() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Сделано для Казахстана</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-12 max-w-3xl">
          Локальная специфика — не настройка,{" "}
          <span className="text-muted">а основа продукта</span>
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {items.map((it) => (
            <motion.div
              key={it.title}
              variants={item}
              className="rounded-2xl bg-white border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-pale flex items-center justify-center mb-4">
                <it.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{it.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{it.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
