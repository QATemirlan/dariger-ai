"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Receipt, Stethoscope, TrendingDown, Timer } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";
import EstimateBadge from "@/components/shared/EstimateBadge";

// Модель по исследовательскому обоснованию (РК + мировые данные AI-скрайберов):
// доп. приёмы = приёмов/день × мин_экономии ÷ 15 × конверсия × дни.
// 8 минут документации на приёме — подтверждённый РАЗМЕР ПРОБЛЕМЫ (опрос врачей РК),
// но реальная экономия AI-скрайбера по мировым RCT — 0,9–2,1 мин; берём 2 мин базово.
const SLOT_MIN = 15; // норматив приёма ПМСП, приказ МЗ РК № 49
const WORK_DAYS_DEFAULT = 22;
// Стоимость минуты врача: средняя зарплата терапевта РК 460 200 ₸/мес (БНС, 2024)
const DOCTOR_MINUTE_RATE = 44;

function formatTenge(n: number) {
  return Math.round(n)
    .toLocaleString("ru-RU")
    .replace(/\u00A0/g, " ");
}

/** Плавное «докручивание» числа до нового значения */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const from = display;
    const start = performance.now();
    const dur = 450;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return (
    <span>
      {formatTenge(display)}
      {suffix}
    </span>
  );
}

function Slider({
  icon: Icon,
  label,
  hint,
  min,
  max,
  step = 1,
  value,
  format,
  onChange,
}: {
  icon: typeof Stethoscope;
  label: string;
  hint: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const progress = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-ink flex items-center gap-2">
          <Icon className="w-4 h-4 text-accent" />
          {label}
        </label>
        <span className="text-xs font-bold bg-dark text-white rounded-full px-3 py-1 tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        className="dariger-range"
        style={{ ["--range-progress" as string]: `${progress}%` }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <p className="text-xs text-muted mt-1.5">{hint}</p>
    </div>
  );
}

export default function RevenueCalculator() {
  const [appointments, setAppointments] = useState(60);
  const [workDays, setWorkDays] = useState(WORK_DAYS_DEFAULT);
  const [price, setPrice] = useState(8000);
  const [savedMin, setSavedMin] = useState(2);
  const [conversion, setConversion] = useState(20);

  const extraVisitsPerDay = (appointments * savedMin) / SLOT_MIN * (conversion / 100);
  const extraVisitsMonth = extraVisitsPerDay * workDays;
  const extraRevenueMonth = extraVisitsMonth * price;
  const extraRevenueYear = extraRevenueMonth * 12;
  const doctorHoursBack = (appointments * savedMin * workDays) / 60;
  const payrollValue = doctorHoursBack * 60 * DOCTOR_MINUTE_RATE;

  const fmt = (v: number) => formatTenge(v);
  const fmtInt = (v: number) => (Math.round(v * 10) / 10).toLocaleString("ru-RU").replace(/\u00A0/g, " ");

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-12">
          <Eyebrow>Потенциал выручки</Eyebrow>
          <h2 className="font-display text-[26px] sm:text-5xl font-bold leading-tight mb-4">
            Сколько <span className="text-accent">выручки</span> клиника
            <br className="hidden sm:block" /> теряет на документации
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Dariger возвращает врачу время, которое уже оплачено клиникой, и
            превращает его в дополнительные приёмы и выручку — без расширения штата.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Панель сценария */}
          <div className="rounded-3xl border border-border bg-white p-7 sm:p-9 shadow-sm flex flex-col gap-8">
            <div>
              <p className="text-[11px] font-bold text-muted tracking-[0.14em] uppercase mb-2">
                Сценарий расчёта
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Задайте ключевые параметры клиники и посмотрите, сколько выручки
                теряется на документации уже сейчас.
              </p>
            </div>

            <Slider
              icon={Stethoscope}
              label="Приёмов в день по клинике"
              hint="Общее количество приёмов в рамках текущего расписания врачей"
              min={10}
              max={200}
              step={5}
              value={appointments}
              format={(v) => String(v)}
              onChange={setAppointments}
            />
            <Slider
              icon={CalendarDays}
              label="Рабочих дней в месяц"
              hint="Количество рабочих дней в месяце, которое участвует в расчёте"
              min={15}
              max={26}
              value={workDays}
              format={(v) => String(v)}
              onChange={setWorkDays}
            />
            <Slider
              icon={Receipt}
              label="Средний чек приёма"
              hint="Скорректируйте расчёт под ваш фактический средний чек, ₸"
              min={2000}
              max={25000}
              step={500}
              value={price}
              format={fmt}
              onChange={setPrice}
            />
            <Slider
              icon={Timer}
              label="Минут экономии на приёме"
              hint="Экономия AI-скрайбера по мировым исследованиям — 0,9–2,1 минуты; 2 мин — базовый ориентир"
              min={1}
              max={4}
              step={1}
              value={savedMin}
              format={(v) => `${v} мин`}
              onChange={setSavedMin}
            />
            <Slider
              icon={TrendingDown}
              label="Доля времени, заполненная новыми приёмами"
              hint="Какой % освободившегося времени клиника реально заполнит пациентами (по данным — 12–19%)"
              min={0}
              max={50}
              step={5}
              value={conversion}
              format={(v) => `${v}%`}
              onChange={setConversion}
            />

            <div className="mt-auto flex items-start gap-2 text-xs text-muted pt-4 border-t border-border leading-relaxed">
              <EstimateBadge />
              <span>
                Оценка. Норматив приёма 15 минут (Стандарт ПМСП, приказ МЗ РК № 49). Около
                8 минут документации на приём — опрос врачей РК, Forbes.kz, 2020. Экономия
                и доля заполнения зависят от клиники и уточняются в пилоте.
              </span>
            </div>
          </div>

          {/* Панель результата */}
          <div className="rounded-3xl bg-dark text-white p-7 sm:p-9 shadow-xl flex flex-col gap-6">
            <div>
              <p className="text-[11px] font-bold text-accent-light tracking-[0.14em] uppercase mb-2">
                Потенциал возврата
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                Столько клиника недополучает без увеличения фонда оплаты труда —
                только за счёт времени врачей, уходящего на документацию.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
              <p className="text-xs text-white/60">
                Дополнительная выручка в месяц при ваших параметрах
              </p>
              <p className="font-display text-5xl sm:text-6xl font-bold mt-2 tabular-nums tracking-tight">
                <AnimatedNumber value={extraRevenueMonth} />
                <span className="text-3xl sm:text-4xl"> ₸</span>
              </p>
              <p className="text-[11px] font-bold text-accent-light tracking-[0.14em] uppercase mt-2">
                ≈ {fmtInt(extraVisitsMonth)} доп. приёмов в месяц
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-[11px] text-white/50 leading-snug">Потери в год</p>
                <p className="font-display text-xl font-bold mt-2 tabular-nums">
                  <AnimatedNumber value={extraRevenueYear} /> ₸
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-[11px] text-white/50 leading-snug">
                  Потерянных приёмов в день
                </p>
                <p className="font-display text-xl font-bold mt-2 tabular-nums">
                  ≈ {fmtInt(extraVisitsMonth)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-[11px] text-white/50 leading-snug">
                  Время врачей в месяц
                </p>
                <p className="font-display text-xl font-bold mt-2 tabular-nums">
                  {fmtInt(doctorHoursBack)} ч
                </p>
              </div>
            </div>

            {/* Сценарии из обоснования: калибровка ожиданий */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">
                Сценарии для клиники на 60 приёмов/день
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/5 p-2.5">
                  <p className="text-[10px] text-white/50">Консервативный</p>
                  <p className="text-xs font-bold mt-1 tabular-nums">~53 000 ₸</p>
                </div>
                <div className="rounded-xl bg-accent/20 p-2.5 ring-1 ring-accent/30">
                  <p className="text-[10px] text-accent-light">Базовый</p>
                  <p className="text-xs font-bold mt-1 tabular-nums text-accent-light">~282 000 ₸</p>
                </div>
                <div className="rounded-xl bg-white/5 p-2.5">
                  <p className="text-[10px] text-white/50">Оптимистичный</p>
                  <p className="text-xs font-bold mt-1 tabular-nums">~1,4 млн ₸</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-auto">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-start gap-3">
                <TrendingDown className="w-4 h-4 text-accent-light mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-white/50 leading-snug">Доп. приёмов в день</p>
                  <p className="font-display text-lg font-bold mt-1 tabular-nums">
                    ≈ {fmtInt(extraVisitsPerDay)}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-start gap-3">
                <Timer className="w-4 h-4 text-accent-light mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-white/50 leading-snug">
                    Время врачей — честная метрика
                  </p>
                  <p className="font-display text-lg font-bold mt-1 tabular-nums">
                    {Math.round((doctorHoursBack / workDays) * 10) / 10} ч/день
                  </p>
                  <p className="text-[10px] text-white/40 mt-1 leading-snug">
                    ≈ {fmt(payrollValue)} ₸ ФОТ/мес · ~44 ₸ за минуту врача — не зависит от новых пациентов
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
