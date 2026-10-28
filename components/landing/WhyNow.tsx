"use client";
import { motion } from "framer-motion";
import Eyebrow from "@/components/shared/Eyebrow";

const events = [
  ["17.07.2026", "Приказ №79 подписан", "Изменения в требования к медицинским цифровым системам"],
  ["01.01.2027", "Вступают в силу пп. 23–24", "Распознавание речи kk/ru и обработка данных — по запросу медорганизации"],
  ["Пилот", "Проверка гипотез", "Клиническая валидация качества и процессов с партнёрами"],
  ["Масштабирование", "API и новые МИС", "Партнёрства с разработчиками и отдельные внедрения"],
];

export default function WhyNow() {
  return (
    <section id="why-now" className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Почему сейчас</Eyebrow>
        <h2 className="font-display text-4xl sm:text-5xl mb-14">Регуляторный горизонт открыт</h2>
        <div className="grid md:grid-cols-4 gap-4 relative">
          <div className="hidden md:block absolute left-0 right-0 top-5 h-px bg-accent/20" />
          {events.map(([date, title, desc], i) => (
            <motion.div key={date} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative pt-12 md:pt-14">
              <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.2, type: "spring" }} className="absolute top-0 left-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold ring-4 ring-paper">{i + 1}</motion.span>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">{date}</p>
              <h3 className="font-display text-xl mt-2 mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted rounded-xl bg-accent-light/50 p-4">Приказ задаёт функциональные требования к медицинским цифровым системам. Это не означает автоматическую обязанность каждой клиники покупать отдельный ИИ-сервис; применимость требует юридической проверки.</p>
      </div>
    </section>
  );
}
