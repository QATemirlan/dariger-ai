"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Mic, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";
import LangChip from "@/components/shared/LangChip";
import { useReducedMotion } from "@/components/shared/useReducedMotion";

const LINE_R = 18; // радиус скругления колен линии
const LINE_DROP = 44; // отступ от пилюли до горизонтали змейки

interface LineGeom {
  w: number;
  h: number;
  d: string;
  fractions: number[]; // доля длины пути до центра каждой пилюли
}

/** Змейка: вниз → колено → вбок → вниз к следующему пункту (как на nexus-med) */
function buildSnake(
  pillXs: number[],
  pillYs: number[],
  endY: number,
  boxW: number,
  boxH: number,
): LineGeom {
  const n = pillXs.length;
  const straight = pillXs.every((x) => Math.abs(x - pillXs[0]) < 4);
  const w = Math.max(1, boxW);
  const h = Math.max(1, boxH);

  if (straight || n < 2) {
    const x = pillXs[0];
    return {
      w,
      h,
      d: `M ${x} 0 L ${x} ${endY}`,
      fractions: pillYs.map((y) => Math.min(1, y / endY)),
    };
  }

  let d = `M ${pillXs[0]} 0`;
  const fractions: number[] = [];
  let acc = 0;
  let cx = pillXs[0];
  let cy = 0;

  for (let i = 0; i < n; i++) {
    // вертикаль до центра пилюли i
    acc += Math.abs(pillYs[i] - cy);
    fractions.push(Math.min(1, acc));
    cx = pillXs[i];
    cy = pillYs[i];

    if (i < n - 1) {
      const nx = pillXs[i + 1];
      const s = nx > cx ? 1 : -1;
      const hy = Math.min(cy + LINE_DROP, pillYs[i + 1] - LINE_R - 4);
      if (hy > cy + LINE_R && nx !== cx) {
        // колено: вниз → дуга → горизонталь → дуга → вниз
        acc += hy - LINE_R - cy;
        acc += (Math.PI / 2) * LINE_R;
        acc += Math.abs(nx - cx) - 2 * LINE_R;
        acc += (Math.PI / 2) * LINE_R;
        d += ` L ${cx} ${hy - LINE_R} Q ${cx} ${hy} ${cx + s * LINE_R} ${hy}`;
        d += ` L ${nx - s * LINE_R} ${hy} Q ${nx} ${hy} ${nx} ${hy + LINE_R}`;
        cy = hy + LINE_R;
      } else {
        // не хватает места — прямой диагональный переход
        acc += Math.hypot(nx - cx, pillYs[i + 1] - cy);
        d += ` L ${nx} ${pillYs[i + 1]}`;
        cy = pillYs[i + 1];
        cx = nx;
      }
    }
  }

  if (endY > cy + 2) {
    acc += endY - cy;
    d += ` L ${cx} ${endY}`;
  }

  return { w, h, d, fractions: fractions.map((f) => Math.min(1, f / acc)) };
}

interface StepData {
  badge: string;
  lineLabel: string;
  icon: typeof Mic;
  title: string;
  description: string;
  side: "left" | "right";
  card: React.ReactNode;
}

export default function ScrollStory() {
  const steps: StepData[] = [
    {
      badge: "Запись и транскрипция",
      lineLabel: "РАСПОЗНАВАНИЕ СМЕШАННОЙ РЕЧИ (KK / RU / LAT)",
      icon: Mic,
      title: "Слушает диалог врача и пациента",
      description:
        "Врач начинает приём одной кнопкой. Система распознаёт казахский язык, русский язык и медицинскую латынь в реальном времени, автоматически разделяя реплики по ролям.",
      side: "left",
      card: (
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
              <span className="text-xs font-bold text-ink">Аудиопоток · 44.1 кГц</span>
            </div>
            <span className="text-[11px] bg-accent-pale text-accent px-2 py-0.5 rounded-full font-semibold">
              Live ASR
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-accent-pale/40 border border-accent/15 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-muted">#1 Пациент</span>
                <LangChip lang="mix" />
              </div>
              <p className="text-ink">«Басым айналып жүр уже недели три, особенно по утрам.»</p>
            </div>

            <div className="p-2.5 rounded-xl bg-paper border border-border text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-muted">#2 Врач</span>
                <LangChip lang="ru" />
              </div>
              <p className="text-ink">«Давление дома меряете? Какие обычные цифры?»</p>
            </div>

            <div className="p-2.5 rounded-xl bg-accent-pale/40 border border-accent/15 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-muted">#3 Пациент</span>
                <LangChip lang="mix" />
              </div>
              <p className="text-ink">«Утром до 150 на 95, эналаприл ішемін, бірақ кейде ұмытып қаламын.»</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: "Обезличивание данных",
      lineLabel: "АВТОМАТИЧЕСКАЯ ЗАЩИТА ПЕРСОНАЛЬНЫХ ДАННЫХ (ПДН)",
      icon: ShieldCheck,
      title: "Удаляет персональные данные до отправки в модель",
      description:
        "ИИН, фамилии, адреса и телефоны автоматически заменяются криптографическими псевдотокенами. Медицинские данные обрабатываются строго на серверах в РК.",
      side: "right",
      card: (
        <div className="rounded-2xl border border-white/10 bg-dark text-white p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent-dark" /> Модуль деидентификации
            </span>
            <span className="text-[11px] text-success font-mono bg-success/20 px-2 py-0.5 rounded">
              Деидентификация до модели
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white/50 text-[11px]">ФИО пациента</p>
                <p className="font-mono text-white/90">Ибрагимова А. → [PATIENT_ID_7492]</p>
              </div>
              <span className="text-success text-xs font-bold">✓ Скрыто</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white/50 text-[11px]">Индивидуальный номер (ИИН)</p>
                <p className="font-mono text-white/90">760412301984 → [IIN_TOKEN_9182]</p>
              </div>
              <span className="text-success text-xs font-bold">✓ Скрыто</span>
            </div>

            <p className="text-[11px] text-white/40 pt-1">
              Локальный контур ЦОД г. Астана · Соответствие ст. 28 Закона РК о персональных данных
            </p>
          </div>
        </div>
      ),
    },
    {
      badge: "Структурирование протокола",
      lineLabel: "ФОРМИРОВАНИЕ ПРОТОКОЛА ПО СТАНДАРТУ №025/У МЗ РК",
      icon: FileText,
      title: "Создаёт черновик карты по разделам",
      description:
        "ИИ извлекает анамнез, показатели давления, жалобы и сопоставляет диагноз с классификатором МКБ-10. Все утверждения снабжены ссылкой на аудиореплику.",
      side: "left",
      card: (
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Первичный осмотр (форма №052/у)
            </span>
            <span className="text-[11px] text-muted">SOAP Model</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-paper border border-border">
              <span className="text-[11px] text-accent font-bold uppercase block mb-0.5">Жалобы</span>
              <p className="text-ink">Головокружение по утрам (~3 нед.), головная боль в затылке, лёгкая тошнота.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-paper border border-border">
              <span className="text-[11px] text-accent font-bold uppercase block mb-0.5">Объективный статус</span>
              <p className="text-ink">АД 150/95 мм рт. ст., ЧСС 76 уд/мин, ритм правильный.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-accent-pale/50 border border-accent/20">
              <span className="text-[11px] text-accent font-bold uppercase block mb-0.5">Диагноз (МКБ-10)</span>
              <p className="text-ink font-semibold">I10 — Эссенциальная (первичная) гипертензия</p>
            </div>

            <div className="p-2.5 rounded-lg bg-paper border border-border">
              <span className="text-[11px] text-accent font-bold uppercase block mb-0.5">Назначения</span>
              <p className="text-ink">Эналаприл 10 мг 1 р/сут, дневник АД 2 р/день, ЭКГ, контроль через 3 нед.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: "Бесшовный перенос в МИС",
      lineLabel: "АВТОЗАПОЛНЕНИЕ ПОЛЕЙ В DAMUMED ИЛИ ЛЮБОЙ ДРУГОЙ МИС",
      icon: CheckCircle2,
      title: "Переносит данные в МИС в один клик",
      description:
        "Через расширение для браузера или прямой API готовые разделы вставляются в поля электронной медкарты клиники. Врач проверяет текст и завершает приём.",
      side: "right",
      card: (
        <div className="rounded-2xl border border-accent/30 bg-white p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-bold text-ink flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> DamuMed: автозаполнение завершено
            </span>
            <span className="text-[11px] text-success font-semibold bg-success/15 px-2 py-0.5 rounded">
              Готово к подписи
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { field: "Жалобы", status: "✓ Заполнено из черновика" },
              { field: "Анамнез заболевания", status: "✓ Заполнено из черновика" },
              { field: "Объективный статус", status: "✓ Заполнено из черновика" },
              { field: "Код диагноза (I10)", status: "✓ Сопоставлено по МКБ-10" },
              { field: "Назначения и рецепты", status: "✓ Добавлено в лист назначений" },
            ].map((f) => (
              <div key={f.field} className="flex items-center justify-between p-2 rounded-lg bg-paper text-[11px]">
                <span className="text-muted font-medium">{f.field}</span>
                <span className="text-success font-semibold">{f.status}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted">Экономия на приёме:</span>
            <span className="text-xs font-bold text-accent">~8 минут времени врача</span>
          </div>
        </div>
      ),
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const drawnPathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Array<HTMLDivElement | null>>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const geomRef = useRef<LineGeom | null>(null);
  const [geom, setGeom] = useState<LineGeom | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      if (!c) return;
      const cr = c.getBoundingClientRect();
      const pillXs: number[] = [];
      const pillYs: number[] = [];
      pillRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        pillXs.push(r.left - cr.left + r.width / 2);
        pillYs.push(r.top - cr.top + r.height / 2);
      });
      if (pillXs.length === 0) return;
      const dot = endRef.current;
      let endY = cr.height;
      if (dot) {
        const dr = dot.getBoundingClientRect();
        endY = dr.top - cr.top + dr.height / 2;
      }
      const g = buildSnake(pillXs, pillYs, endY, cr.width, cr.height);
      geomRef.current = g;
      setGeom(g);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Линия рисуется, пока секция проходит через вьюпорт (как на auxia.io)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });
  const spring = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const instant = useMotionValue(1);
  const draw = reduced ? instant : spring;

  const tipOpacity = useTransform(draw, [0, 0.015, 0.985, 1], [0, 1, 1, 0]);

  // Кончик линии едет по пути через getPointAtLength
  const positionTip = (v: number) => {
    const path = drawnPathRef.current;
    const tip = tipRef.current;
    if (!path || !tip) return;
    const len = path.getTotalLength();
    const p = path.getPointAtLength(Math.max(0, Math.min(1, v)) * len);
    tip.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
  };
  useMotionValueEvent(draw, "change", positionTip);
  useEffect(() => {
    positionTip(draw.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geom]);

  const fracOf = (idx: number) => geomRef.current?.fractions[idx] ?? 0;

  return (
    <section id="how" className="py-20 px-6 relative overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Eyebrow>Как работает Dariger AI</Eyebrow>
          <h2 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4">
            От живого разговора до готовой записи в МИС
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Полноценный автоматический контур, который освобождает врача от рутинного набора текста
            и гарантирует стандарты документации Минздрава РК.
          </p>
        </div>

        {/* НЕПРЕРЫВНАЯ СИНЯЯ ЛЕНТА / SNAKE FLOW (ПО РЕФЕРЕНСУ NEXUS-MED) */}
        <div ref={containerRef} className="relative">
          {/* SVG-змейка: бледная трасса + яркая линия, рисующаяся по скроллу */}
          {geom && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${geom.w} ${geom.h}`}
              fill="none"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="darigerFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a67c52" />
                  <stop offset="100%" stopColor="#8a6540" />
                </linearGradient>
              </defs>
              <path
                d={geom.d}
                stroke="#d4c8aa"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                ref={drawnPathRef}
                d={geom.d}
                stroke="url(#darigerFlow)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: draw }}
              />
            </svg>
          )}
          {/* Бегущий кончик линии — под плашками (без z-index), поверх только фона секции */}
          {geom && !reduced && (
            <motion.div
              ref={tipRef}
              className="absolute left-0 top-0 pointer-events-none"
              style={{ opacity: tipOpacity }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white border-[3px] border-accent shadow-[0_0_16px_rgba(166,124,82,0.45)]" />
            </motion.div>
          )}

          <div className="space-y-16 relative">
            {steps.map((step, idx) => (
              <div key={step.badge} className="relative">
                {/* Пилюля этапа: на десктопе в своей колонке (зигзаг), на мобильном по центру */}
                <div
                  className={`mb-6 flex justify-center md:w-1/2 ${
                    step.side === "right" ? "md:ml-auto" : ""
                  }`}
                >
                  <StepNode
                    progress={draw}
                    fracGetter={() => fracOf(idx)}
                    icon={step.icon}
                    label={step.badge}
                    pillRef={(el) => {
                      pillRefs.current[idx] = el;
                    }}
                  />
                </div>

                {/* Подпись к этапу на ленте */}
                <div
                  className={`mb-6 flex justify-center md:w-1/2 ${
                    step.side === "right" ? "md:ml-auto" : ""
                  }`}
                >
                  <span className="text-[11px] font-bold text-muted tracking-[0.14em] uppercase bg-paper px-3 py-1 rounded-full border border-border">
                    {step.lineLabel}
                  </span>
                </div>

                {/* Сетка: описание + карточка */}
                <div
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    step.side === "right" ? "md:grid-flow-dense" : ""
                  }`}
                >
                  {/* Текстовое описание */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className={`${step.side === "right" ? "md:col-start-2" : "md:col-start-1"}`}
                  >
                    <span className="text-accent text-xs font-bold uppercase tracking-wider">
                      Шаг 0{idx + 1}
                    </span>
                    <h3 className="font-display text-[22px] sm:text-3xl font-bold mt-1 mb-3 text-ink">
                      {step.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-base">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Интерактивная карточка интерфейса */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`${step.side === "right" ? "md:col-start-1" : "md:col-start-2"}`}
                  >
                    {step.card}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Финальная точка — линия дорисовывается до неё, в колонке последнего шага */}
          <div
            className={`mt-12 flex justify-center md:w-1/2 ${
              steps[steps.length - 1].side === "right" ? "md:ml-auto" : ""
            }`}
          >
            <div
              ref={endRef}
              className="w-4 h-4 rounded-full bg-accent ring-4 ring-accent-light shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepNode({
  progress,
  fracGetter,
  icon: Icon,
  label,
  pillRef,
}: {
  progress: MotionValue<number>;
  fracGetter: () => number;
  icon: typeof Mic;
  label: string;
  pillRef: (el: HTMLDivElement | null) => void;
}) {
  // 0 → пилюля ещё «не пройдена» линией, 1 → линия доросла до неё
  const active = useTransform(progress, (v) => {
    const f = fracGetter();
    if (f <= 0) return 0;
    return Math.max(0, Math.min(1, (v - (f - 0.035)) / 0.035));
  });

  return (
    <div ref={pillRef} className="relative z-10">
      {/* Базовое состояние: ещё не пройдено */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2 text-xs font-bold text-muted tracking-wide">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      {/* Активное состояние: линия дошла */}
      <motion.div
        style={{ opacity: active }}
        className="absolute inset-0 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow-lg shadow-accent/25 tracking-wide"
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </motion.div>
    </div>
  );
}
