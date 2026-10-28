"use client";
import { motion } from "framer-motion";
import { Search, FlaskConical, Network, Handshake } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const steps = [
  { icon: Search, n: "A", title: "Прототип", text: "Проверка ценностного предложения, UX демо и сбор обратной связи от инвесторов и потенциальных партнёров." },
  { icon: FlaskConical, n: "B", title: "Клинический MVP", text: "Юридический контур, ЦОД в РК, пилотная клиника, датасет и бенчмарк качества на синтетических и согласованных данных." },
  { icon: Network, n: "C", title: "Интеграции и сети", text: "Расширение браузера, API/SDK для МИС, индивидуальные внедрения и масштабирование на сети клиник." },
];

export default function Roadmap() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Дорожная карта</Eyebrow>
        <h2 className="font-display text-4xl sm:text-5xl mb-14">От демонстрации — к пилоту</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative rounded-3xl border border-border bg-white p-8">
              <div className="flex items-center justify-between mb-8"><span className="font-display text-5xl text-accent/20">{s.n}</span><s.icon className="w-7 h-7 text-accent" /></div>
              <h3 className="font-display text-2xl mb-3">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-accent text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div><div className="flex items-center gap-2 text-marker mb-2"><Handshake className="w-5 h-5" /><span className="text-xs uppercase tracking-widest font-semibold">Что мы ищем</span></div><p className="font-display text-2xl">Инвестиции · пилотную клинику · партнёра-МИС</p></div>
          <p className="text-white/70 text-sm max-w-sm">Проект на стадии концепта и презентационного прототипа. Пилоты и партнёрства ещё предстоит согласовать.</p>
        </div>
      </div>
    </section>
  );
}
