"use client";
import { motion } from "framer-motion";
import { Clock, PenLine, AlertTriangle, TrendingDown } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const problems = [
  {
    icon: Clock,
    stat: "8 мин",
    label: "из 15‑минутного приёма",
    text: "уходят на ручной ввод данных в МИС. Врач смотрит в монитор, а не на пациента.",
  },
  {
    icon: PenLine,
    stat: "40%",
    label: "документации",
    text: "содержит неполные или пропущенные поля — штрафы при проверках ФСМС и прокуратуры.",
  },
  {
    icon: AlertTriangle,
    stat: "8 мин",
    label: "на каждом приёме",
    text: "уходит на компьютер по опросам врачей РК — на осмотр остаётся меньше половины норматива.",
  },
  {
    icon: TrendingDown,
    stat: "~1,5 ч",
    label: "документации в день",
    text: "набирается у врача на 10–12 приёмах — это оплаченное клиникой время, не видимое пациенту.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Problem() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Проблема</Eyebrow>
        <h2 className="font-display text-[26px] sm:text-5xl leading-tight mb-4 max-w-3xl font-bold">
          Врач должен лечить,{" "}
          <span className="text-muted">а не заполнять бумаги</span>
        </h2>
        <p className="text-muted text-lg max-w-2xl mb-12 leading-relaxed">
          На каждом 15-минутном приёме ПМСП около 8 минут уходит на компьютер:
          ввод в МИС, отчёты, протоколы. По опросам врачей Казахстана — это
          главная рутина после самого осмотра.
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {problems.map((p) => (
            <motion.div
              key={p.stat}
              variants={item}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/30"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-pale flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-display text-3xl font-bold">{p.stat}</p>
              <p className="text-sm text-accent font-medium mt-1">{p.label}</p>
              <p className="text-[15px] text-muted mt-2 leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
