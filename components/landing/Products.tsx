"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const products = [
  {
    name: "Dariger Scribe",
    audience: "Для врача и клиники",
    price: "по подписке",
    capabilities: [
      "Фоновая запись приёма с live-транскриптом",
      "Распознавание kk/ru + медицинской латыни",
      "Черновик по формам РК с проверкой полноты",
      "Документы: направление, рекомендации",
      "Автозаполнение МИС через расширение",
    ],
    included: [
      "Шаблоны по специальностям",
      "Кабинет администратора клиники",
      "Политики хранения и аудит",
      "Поддержка и обучение",
    ],
    dark: false,
  },
  {
    name: "Dariger Connect",
    audience: "Для разработчиков МИС и сетей",
    price: "по интеграции",
    capabilities: [
      "Публичный API + SDK",
      "WebSocket-стриминг аудио",
      "Webhooks о готовности записи",
      "Embeddable-виджет",
      "Отдельное внедрение в контур сети",
    ],
    included: [
      "Соответствие пп. 23–24 приказа №79",
      "On-Premise в контуре заказчика",
      "Маппинг полей под каждую МИС",
      "SLA и сопровождение",
    ],
    dark: true,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Products() {
  return (
    <section id="products" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Продукты</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-12 max-w-3xl">
          Два продукта — одна платформа
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {products.map((p) => (
            <motion.div
              key={p.name}
              variants={item}
              className={`rounded-2xl p-8 border ${
                p.dark
                  ? "bg-dark text-white border-white/10"
                  : "bg-white border-border"
              }`}
            >
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <p className={`text-sm mt-1 ${p.dark ? "text-white/60" : "text-muted"}`}>
                  {p.audience}
                </p>
                <span className={`inline-block mt-3 text-xs font-semibold uppercase tracking-wider ${p.dark ? "text-accent-dark" : "text-accent"}`}>
                  {p.price}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className={`text-xs uppercase tracking-wider font-semibold mb-3 ${p.dark ? "text-white/40" : "text-muted"}`}>
                    Возможности
                  </p>
                  <ul className="space-y-2">
                    {p.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm">
                        <span className="w-4 h-4 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span className={p.dark ? "text-white/80" : ""}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wider font-semibold mb-3 ${p.dark ? "text-white/40" : "text-muted"}`}>
                    Включено
                  </p>
                  <ul className="space-y-2">
                    {p.included.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm">
                        <span className="w-4 h-4 rounded-full bg-success/15 text-success flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span className={p.dark ? "text-white/80" : ""}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
