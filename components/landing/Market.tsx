"use client";
import { motion } from "framer-motion";
import { Users, Building2, Coins } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";
import EstimateBadge from "@/components/shared/EstimateBadge";

const items = [
  [Users, "≈80 000", "врачей в РК", "оценка команды"],
  [Building2, "Частные", "медорганизации — первый сегмент", "сегментация проекта"],
  [Coins, "125 000 ₸", "за лицензию в год", "предварительная гипотеза тарифа"],
] as const;

export default function Market() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Рынок и бизнес-модель</Eyebrow>
        <h2 className="font-display text-4xl sm:text-5xl mb-12 max-w-3xl">Коммерческая модель, которую предстоит проверить</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map(([Icon, value, label, badge], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="rounded-3xl border border-border bg-white p-8">
              <Icon className="w-6 h-6 text-accent mb-6" />
              <p className="font-display text-4xl">{value}</p>
              <p className="text-muted mt-2">{label}</p>
              <p className="mt-4"><EstimateBadge label={badge} /></p>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted mt-6 max-w-3xl">Возможная монетизация: лицензия на врача/клинику для Dariger Scribe; лицензия или оплата интеграции для Dariger Connect. Значения требуют рыночной валидации.</p>
      </div>
    </section>
  );
}
