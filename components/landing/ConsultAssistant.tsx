"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Activity, ClipboardCheck, Send, AlertTriangle } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";

interface Feature {
  tag: string;
  title: string;
  text: string;
  icon: typeof Sparkles;
  mockup: React.ReactNode;
}

function GuidelinesMockup() {
  return (
    <div className="h-full flex flex-col justify-center gap-4 p-6 sm:p-8">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-accent text-white p-4 text-sm shadow-lg">
        <p>
          Проанализируй жалобы и предложи дифдиагноз по клиническим протоколам МЗ РК.
        </p>
        <div className="flex gap-2 mt-3">
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-[10px] font-mono">
            анамнез.pdf
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-[10px] font-mono">
            анализы_крови.pdf
          </span>
        </div>
      </div>

      <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-white p-4 text-sm shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-md bg-accent text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
            Мнение ИИ
          </span>
          <span className="rounded-md border border-accent/30 text-accent text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
            КР МЗ РК
          </span>
        </div>
        <p className="text-muted mb-3">
          На основании жалоб и анамнеза основные дифференциальные диагнозы:
        </p>
        {[
          { n: "01", dx: "Межреберная невралгия (M79.2)", p: "75%" },
          { n: "02", dx: "Остеохондроз грудного отдела (M54.5)", p: "60%" },
          { n: "03", dx: "Стенокардия напряжения (I20.8)", p: "15%" },
        ].map((d) => (
          <div key={d.n} className="mb-2 last:mb-0">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-ink">
                <span className="text-accent">{d.n}. </span>
                {d.dx}
              </span>
              <span className="text-accent font-bold tabular-nums">{d.p}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-paper overflow-hidden">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: d.p }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 shadow-sm">
        <span className="text-muted text-sm flex-1">Задайте вопрос ассистенту…</span>
        <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
          <Send className="w-3.5 h-3.5 text-white" />
        </span>
      </div>
    </div>
  );
}

function ImagingMockup() {
  return (
    <div className="h-full flex items-center justify-center p-6 sm:p-8">
      <div className="w-full rounded-2xl bg-dark p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-xs font-bold text-white">DICOM вьювер</span>
          </div>
          <span className="text-[10px] text-accent-light font-mono bg-accent/20 px-2 py-0.5 rounded">
            AI OVERLAY
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            "Лёгкие · фронт.",
            "Лёгкие · латер.",
            "Сердце · контур",
          ].map((label, i) => (
            <div
              key={label}
              className={`aspect-square rounded-lg border border-white/10 relative overflow-hidden ${
                i === 1 ? "ring-2 ring-accent" : ""
              }`}
              style={{
                background:
                  "radial-gradient(circle at 45% 40%, rgba(166,124,82,0.32), transparent 55%), radial-gradient(circle at 60% 65%, rgba(212,200,170,0.12), transparent 45%), #241e18",
              }}
            >
              <span className="absolute bottom-1 left-1.5 text-[8px] font-mono text-white/50">
                {label}
              </span>
              {i === 1 && (
                <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full border-2 border-dashed border-accent-light/80" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3 text-xs">
          <p className="text-white/50 text-[10px] mb-1">Заключение ИИ</p>
          <p className="text-white/90 leading-relaxed">
            Затемнение в нижней доле правого лёгкого. Рекомендовано сопоставить с
            результатами КТ и клинической картиной.
          </p>
        </div>
      </div>
    </div>
  );
}

function SecondOpinionMockup() {
  return (
    <div className="h-full flex flex-col justify-center gap-3 p-6 sm:p-8">
      <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
        <span className="text-sm font-bold text-ink flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" /> Мнение ИИ
        </span>
        <span className="text-xs text-accent font-semibold flex items-center gap-1">
          ⟳ Обновить
        </span>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Итог</p>
        <p className="text-sm text-ink leading-relaxed">
          На основании жалоб на острые боли в грудной клетке и анамнеза наиболее
          вероятен вертеброгенный характер боли. Необходим дифдиагноз с
          кардиальной патологией.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2.5">
          Гипотезы / дифдиагноз
        </p>
        {[
          { dx: "Межреберная невралгия", p: 75 },
          { dx: "Остеохондроз грудного отдела", p: 60 },
          { dx: "Стенокардия напряжения", p: 15 },
        ].map((d) => (
          <div key={d.dx} className="mb-2.5 last:mb-0">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ink font-medium">{d.dx}</span>
              <span className="text-muted tabular-nums">{d.p}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-paper overflow-hidden">
              <div className="h-full rounded-full bg-accent" style={{ width: `${d.p}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
          Критические риски
        </p>
        {[
          { dx: "Инфаркт миокарда", level: "ВЫСОКИЙ", cls: "bg-danger/10 text-danger" },
          { dx: "Тромбоэмболия", level: "СРЕДНИЙ", cls: "bg-warn/10 text-warn" },
          { dx: "Пневмоторакс", level: "НИЗКИЙ", cls: "bg-success/10 text-success" },
        ].map((r) => (
          <div
            key={r.dx}
            className="flex items-center justify-between rounded-lg px-3 py-2 mb-1.5 last:mb-0 bg-paper"
          >
            <span className="text-xs text-ink">{r.dx}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.cls}`}>
              {r.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const features: Feature[] = [
  {
    tag: "КР МЗ РК И ПРОТОКОЛЫ",
    title: "Подсказки по клиническим протоколам",
    text: "Быстрый доступ к клиническим рекомендациям МЗ РК прямо во время приёма — ассистент находит нужный раздел по контексту разговора.",
    icon: Sparkles,
    mockup: <GuidelinesMockup />,
  },
  {
    tag: "ДОКАЗАТЕЛЬНАЯ ДИАГНОСТИКА",
    title: "AI-анализ диагностических снимков",
    text: "ИИ помогает интерпретировать диагностические снимки и даёт врачу дополнительную опору при принятии клинического решения.",
    icon: Activity,
    mockup: <ImagingMockup />,
  },
  {
    tag: "ВТОРОЕ МНЕНИЕ",
    title: "Второе мнение для врача от ИИ",
    text: "ИИ быстро проверяет клиническую гипотезу и показывает вероятности диагнозов с критическими рисками, которые нельзя пропустить.",
    icon: ClipboardCheck,
    mockup: <SecondOpinionMockup />,
  },
];

export default function ConsultAssistant() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-12">
          <Eyebrow>Быстрые решения</Eyebrow>
          <h2 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4">
            Всё для{" "}
            <span className="text-accent">быстрых клинических решений</span>
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Dariger помогает врачу быстрее принимать решения: находит протоколы,
            анализирует данные и даёт дополнительную опору во время приёма.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 items-stretch">
          {/* Карточки-вкладки */}
          <div className="flex flex-col gap-4">
            {features.map((f, i) => {
              const isActive = i === active;
              return (
                <button
                  key={f.tag}
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`relative text-left rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-200 ${
                    isActive
                      ? "border-accent/50 shadow-lg shadow-accent/10"
                      : "border-border hover:border-accent/25 hover:shadow-sm"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-5 bottom-5 w-1 rounded-full bg-accent" />
                  )}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isActive ? "bg-accent text-white" : "bg-accent-pale text-accent"
                        }`}
                      >
                        <f.icon className="w-5 h-5" />
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        0{i + 1}
                      </span>
                    </div>
                    <div>
                      <span className="inline-block font-mono text-[10px] font-bold tracking-[0.15em] text-accent border border-accent/25 rounded-full px-2.5 py-1 mb-2">
                        {f.tag}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-ink leading-snug">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted mt-2 leading-relaxed">
                        {f.text}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Переключаемый мокап */}
          <div className="rounded-3xl border border-border bg-accent-pale/50 p-2 sm:p-3 shadow-sm min-h-[420px]">
            <div className="rounded-2xl bg-white/60 border border-accent/10 h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  {features[active].mockup}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          ИИ-подсказки носят вспомогательный характер и не заменяют клиническое
          решение врача.
        </p>
      </div>
    </section>
  );
}
