"use client";
import { motion, useReducedMotion as fmReduced } from "framer-motion";
import { useEffect, useState } from "react";
import LangChip from "@/components/shared/LangChip";
import Stamp from "@/components/shared/Stamp";
import { useReducedMotion } from "@/components/shared/useReducedMotion";

const consultLines = [
  { lang: "mix" as const, text: "Басым айналып жүр недели три", hl: "айналып" },
  { lang: "ru" as const, text: "Давление утром до 150 на 95", hl: "150 на 95" },
  { lang: "mix" as const, text: "Эналаприл ішемін, иногда забываю", hl: "Эналаприл" },
];

const stages = [
  "Распознавание речи (kk/ru)",
  "Обезличивание ИИН и ФИО",
  "Структурирование в форму №025/у",
  "Проверка по стандартам МЗ РК",
];

const clinicalDraft = [
  { label: "Жалобы", value: "Головокружение в течение 3 недель, периодические головные боли" },
  { label: "Анамнез", value: "АГ в течение 5 лет, нерегулярный приём эналаприла" },
  { label: "Объективно", value: "АД 150/95 мм рт. ст., ЧСС 76 уд/мин, тоны сердца ясные" },
  { label: "Диагноз", value: "I10 Эссенциальная (первичная) гипертензия" },
  { label: "Назначения", value: "Эналаприл 10 мг 1 р/сут, дневник АД, повторный приём" },
];

export default function HeroAnimation() {
  const reduced = useReducedMotion() || fmReduced();
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const id = setInterval(() => setCycle((c) => c + 1), 14000);
    return () => clearInterval(id);
  }, [reduced, paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch"
      aria-hidden="true"
    >
      {/* 1. Консультация */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Фоновая запись
            </span>
            <span className="flex items-center gap-1.5 text-xs text-danger font-medium">
              <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
              rec
            </span>
          </div>

          <div className="flex items-end gap-1 h-8 mb-4">
            {Array.from({ length: 28 }).map((_, i) => {
              const h = 20 + ((i * 31 + cycle * 7) % 70);
              return (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-accent/60"
                  animate={{ height: [`${h}%`, `${(h + 25) % 80 + 15}%`, `${h}%`] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.03 }}
                />
              );
            })}
          </div>

          <div className="space-y-2.5">
            {consultLines.map((l, i) => (
              <motion.div
                key={`${cycle}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 1.0, duration: 0.4 }}
                className="flex items-start gap-2 text-[13px] bg-accent-pale/50 p-2.5 rounded-xl border border-accent/10"
              >
                <LangChip lang={l.lang} />
                <p className="leading-snug">
                  {l.text.split(l.hl)[0]}
                  <span className="mark font-medium">{l.hl}</span>
                  {l.text.split(l.hl)[1]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted mt-4 pt-3 border-t border-border">
          Живая речь врача и пациента · переключение языков
        </p>
      </div>

      {/* 2. Dariger AI Обработка */}
      <div className="rounded-2xl border border-accent/25 bg-gradient-to-b from-accent-pale to-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              ИИ-пайплайн
            </span>
            <span className="text-xs text-accent font-medium">~3.8 с</span>
          </div>

          <div className="space-y-2.5">
            {stages.map((s, i) => (
              <motion.div
                key={`${cycle}-st-${i}`}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + i * 0.8 }}
                className="flex items-center gap-2.5 text-[13px] bg-white p-2.5 rounded-xl border border-accent/10 shadow-2xs"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.8 + i * 0.8, type: "spring", stiffness: 400, damping: 15 }}
                  className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[11px] shrink-0"
                >
                  ✓
                </motion.span>
                <span className="font-medium text-ink">{s}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5 }}
          className="mt-4 rounded-xl bg-white border border-border p-3 text-[12px] text-muted"
        >
          <div className="flex items-center gap-2 text-success font-medium">
            <span className="w-2 h-2 rounded-full bg-success" />
            ПДн деидентифицированы: ИИН и ФИО защищены
          </div>
        </motion.div>
      </div>

      {/* 3. Готовый черновик карты */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Протокол осмотра
            </span>
            <span className="text-[11px] text-muted font-mono bg-accent-pale px-2 py-0.5 rounded-full">
              форма №025/у
            </span>
          </div>

          <div className="space-y-2">
            {clinicalDraft.map((r, i) => (
              <motion.div
                key={`${cycle}-dr-${i}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 4.8 + i * 0.6 }}
                className="text-[12px] p-2 rounded-lg bg-paper border border-border/80"
              >
                <span className="text-accent text-[11px] uppercase tracking-wider font-semibold block">
                  {r.label}
                </span>
                <p className="text-ink leading-tight mt-0.5 font-medium line-clamp-1">{r.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <Stamp small text="Черновик · врач подписывает" />
          <span className="text-[11px] text-success font-medium">Готово к МИС</span>
        </div>
      </div>
    </div>
  );
}
