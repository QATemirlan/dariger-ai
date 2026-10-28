"use client";
import { motion } from "framer-motion";
import { Globe, Server, Zap } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const options = [
  {
    icon: Globe,
    title: "Браузерное расширение",
    desc: "Работает поверх DamuMed, Damumed.kz и других МИС. Автозаполнение полей без изменений в вашей системе.",
  },
  {
    icon: Zap,
    title: "API / SDK",
    desc: "WebSocket-стриминг аудио, REST API для черновиков, webhooks о готовности записи. Для разработчиков МИС.",
  },
  {
    icon: Server,
    title: "Отдельное внедрение",
    desc: "Полная установка в контуре клиники или медицинской сети. Данные не покидают периметр заказчика.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Deployment() {
  return (
    <section className="py-20 px-6 bg-dark text-white">
      <div className="mx-auto max-w-6xl">
        <Eyebrow className="text-accent-dark">Варианты подключения</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
          Встраивается в ваш рабочий процесс
        </h2>
        <p className="text-white/60 max-w-2xl mb-12 leading-relaxed">
          Dariger подключается к существующей инфраструктуре клиники.
          Не нужно менять МИС — достаточно расширения для браузера или
          интеграции по API.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-5"
        >
          {options.map((o) => (
            <motion.div
              key={o.title}
              variants={item}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/8 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                <o.icon className="w-5 h-5 text-accent-dark" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{o.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{o.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
