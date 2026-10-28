"use client";
import { motion } from "framer-motion";
import { Server, ShieldCheck, Lock, FileCheck } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const items = [
  {
    icon: Server,
    title: "Локальный контур в РК",
    text: "Хранение и обработка данных производятся на серверах внутри Республики Казахстан в строгом соответствии с Законом РК «О персональных данных».",
  },
  {
    icon: Lock,
    title: "Обезличивание данных",
    text: "ФИО, ИИН и контактные данные пациентов удаляются из аудио и транскрипта до момента передачи в языковые модели.",
  },
  {
    icon: ShieldCheck,
    title: "Приватность и конфиденциальность",
    text: "Медицинские данные клиник изолированы и не передаются третьим лицам. Никакие клиентские данные не используются для публичного обучения.",
  },
  {
    icon: FileCheck,
    title: "Врачебная тайна и аудит",
    text: "Полное логирование доступа к записям приёмов. Окончательное решение и подписание карты всегда остаются за сертифицированным врачом.",
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

export default function Security() {
  return (
    <section id="security" className="py-20 px-6 bg-dark text-white">
      <div className="mx-auto max-w-6xl">
        <Eyebrow light>Безопасность и соответствие закону</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
          Защита медицинских данных уровня Enterprise
        </h2>
        <p className="text-white/60 max-w-2xl mb-12 leading-relaxed">
          Безопасность персональных медицинских данных — базовый приоритет Dariger AI.
          Архитектура разработана с учётом требований Министерства здравоохранения РК.
        </p>

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
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/8 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <it.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{it.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{it.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
