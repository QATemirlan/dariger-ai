"use client";
import { motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  FileCheck2,
  Gavel,
  Clock,
  TrendingDown,
  Zap,
} from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

const preventionPoints = [
  "Диагнозы (МКБ-10) и услуги (КРУ/КГГУ) — соответствие тарифам ОСМС",
  "Медицинская необходимость — на основе клинических протоколов МЗ РК",
  "ИДС — в соответствии с правилами ОСМС (постановление №4)",
  "Комплектность пакета: счёт (акт), выписки из медкарты (форма №052/у)",
];

const appealStats = [
  { icon: Zap, value: "минуты", label: "подготовка пакета апелляции вместо часов" },
  { icon: Clock, value: "авто", label: "сбор обоснования из протокола приёма" },
  { icon: TrendingDown, value: "меньше", label: "ручной работы с отказами и непогашенными требованиями" },
];

export default function InsuranceOsms() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-12">
          <Eyebrow>Страховые и ОСМС</Eyebrow>
          <h2 className="font-display text-[26px] sm:text-5xl font-bold leading-tight mb-4">
            Страховая документация{" "}
            <span className="text-accent">без ошибок и потерь</span>
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Dariger проверяет пакет до отправки в ФСМС и готовит апелляции,
            если страховая отказала — за считанные минуты, а не дни.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Профилактика отказов */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-white p-7 sm:p-9 shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-accent-pale flex items-center justify-center mb-5">
              <FileCheck2 className="w-5.5 h-5.5 text-accent" />
            </div>
            <p className="text-[11px] font-bold text-muted tracking-[0.14em] uppercase mb-2">
              Профилактика отказов
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">
              Предотвращаем отказы ещё до отправки
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Dariger формирует страховой пакет без типовых ошибок и проверяет
              комплектность каждого документа.
            </p>

            <ul className="space-y-3.5">
              {preventionPoints.map((p) => (
                <li key={p} className="flex gap-3 text-sm">
                  <span className="w-5.5 h-5.5 rounded-full bg-accent-pale border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </span>
                  <span className="text-ink leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-2xl bg-dark text-white p-4 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-accent-light shrink-0" />
              <p className="text-xs text-white/80 leading-relaxed">
                Каждый документ снабжён ссылкой на реплику врача в аудиозаписи —
                обоснование всегда под рукой при проверке.
              </p>
            </div>
          </motion.div>

          {/* Апелляции */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-dark text-white p-7 sm:p-9 shadow-xl flex flex-col"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <Gavel className="w-5.5 h-5.5 text-accent-light" />
            </div>
            <p className="text-[11px] font-bold text-accent-light tracking-[0.14em] uppercase mb-2">
              Апелляции
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">
              Обжалуйте отказ страховой за минуты
            </h3>
            <p className="text-sm text-white/70 leading-relaxed mb-7">
              Если ФСМС отказала в оплате, Dariger автоматически собирает пакет
              апелляции: находит обоснование в протоколе, прикладывает выдержки
              из аудиозаписи и формы документов.
            </p>

            <div className="space-y-3 mb-7">
              {[
                { doc: "Выписка из медкарты (форма №052/у)", status: "Готово" },
                { doc: "Выписка из медкарты (форма №052/у)", status: "Готово" },
                { doc: "Обоснование мед. необходимости (КР МЗ РК)", status: "Готово" },
                { doc: "Ссылки на аудиозапись приёма", status: "Приложено" },
              ].map((row) => (
                <div
                  key={row.doc}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                >
                  <span className="text-xs text-white/85">{row.doc}</span>
                  <span className="text-[11px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> {row.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-auto">
              {appealStats.map((s) => (
                <div
                  key={s.value}
                  className="rounded-2xl bg-white/5 border border-white/10 p-4"
                >
                  <s.icon className="w-4 h-4 text-accent-light mb-2" />
                  <p className="font-display text-lg font-bold tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[11px] text-white/50 leading-snug mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
