"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export interface TourStep {
  /** CSS-селектор подсвечиваемого элемента */
  target: string;
  title: string;
  text: string;
  /** необязательное действие при переходе к шагу (напр. переключить вкладку) */
  onEnter?: () => void;
}

/**
 * Обучающий spotlight-тур: экран затемнён, целевой элемент подсвечен «дыркой»
 * в затемнении, рядом — плашка с подсказкой. Индекс шага управляется снаружи,
 * поэтому тур можно ставить на паузу (например, на время записи) и продолжать.
 * На мобильных (< 640px) плашка занимает всю ширину экрана и располагается
 * ПОД подсвеченной целью — никогда поверх неё.
 */
export default function TourSpotlight({
  steps,
  active,
  onFinish,
  onSkip,
  stepIndex,
  onStepChange,
}: {
  steps: TourStep[];
  active: boolean;
  onFinish: () => void;
  onSkip: () => void;
  stepIndex: number;
  onStepChange: (i: number) => void;
}) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; width?: number; right?: number } | null>(null);
  const rafRef = useRef(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const onEnterRef = useRef<TourStep["onEnter"] | undefined>(undefined);

  const step = steps[stepIndex];

  useEffect(() => {
    if (!active || !step) return;
    onEnterRef.current = step.onEnter;
    onEnterRef.current?.();

    const measure = () => {
      const el = document.querySelector(step.target);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 640;

      if (!el || el.getClientRects().length === 0) {
        setRect(null);
        // Цель скрыта (напр. панель чата на мобильном): центрируем плашку
        setTooltipPos(
          mobile
            ? { top: Math.max(16, vh / 2 - 120), left: 16, right: 16 }
            : { top: Math.max(16, vh / 2 - 100), left: vw / 2 - 144 },
        );
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });

      const tooltipH = tooltipRef.current?.getBoundingClientRect().height || 180;

      if (mobile) {
        // На всю ширину экрана, ПОД целью; если не влезает — над целью
        let top = r.bottom + 12;
        if (top + tooltipH > vh - 12) top = Math.max(12, r.top - tooltipH - 12);
        setTooltipPos({ top, left: 16, right: 16 });
        return;
      }

      // Десктоп: справа от цели, иначе слева
      const pad = 16;
      const tooltipW = 288;
      let left = r.right + pad;
      let top = r.top - 8;
      if (left + tooltipW > vw - 12) {
        left = Math.max(12, r.left - tooltipW - pad);
        if (left < 12) left = Math.max(12, Math.min(r.left, vw - tooltipW - 12));
      }
      if (top + tooltipH > vh - 12) top = Math.max(12, vh - tooltipH - 12);
      if (top < 12) top = 12;
      setTooltipPos({ top, left });
    };

    measure();
    const onFrame = () => {
      measure();
      rafRef.current = requestAnimationFrame(onFrame);
    };
    rafRef.current = requestAnimationFrame(onFrame);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", measure);
    };
  }, [active, stepIndex, step]);

  if (!active || !step || !tooltipPos) return null;

  const next = () => {
    if (stepIndex + 1 >= steps.length) onFinish();
    else onStepChange(stepIndex + 1);
  };

  const isLast = stepIndex + 1 >= steps.length;

  return (
    <>
      {/* Затемнение с «дыркой» вокруг цели */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: rect
            ? `radial-gradient(circle at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent ${Math.max(rect.width, rect.height) / 2 + 14}px, rgba(45, 38, 33, 0.72) ${Math.max(rect.width, rect.height) / 2 + 22}px)`
            : "rgba(45, 38, 33, 0.72)",
        }}
        onClick={onSkip}
      />
      {/* Подсветка цели */}
      {rect && (
        <div
          className="fixed z-40 rounded-xl ring-4 ring-accent pointer-events-none"
          style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
        />
      )}
      {/* Плашка подсказки */}
      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed z-50 rounded-2xl bg-dark text-white p-4 shadow-xl w-72 max-w-[calc(100vw-32px)]"
        style={{ top: tooltipPos.top, left: tooltipPos.left, ...(tooltipPos.right !== undefined ? { right: tooltipPos.right, width: "auto" } : {}) }}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-bold text-accent-light uppercase tracking-wider">
            Шаг {stepIndex + 1} из {steps.length}
          </p>
          <button onClick={onSkip} aria-label="Закрыть подсказку" className="text-white/50 hover:text-white shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-sm font-semibold mt-1.5 leading-snug">{step.title}</p>
        <p className="text-xs text-white/70 mt-1.5 leading-relaxed">{step.text}</p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={next}
            className="flex-1 rounded-xl bg-accent text-white py-2.5 text-xs font-bold hover:bg-accent-deep"
          >
            {isLast ? "Готово" : "Далее"}
          </button>
          <button
            onClick={onSkip}
            className="rounded-xl border border-white/15 text-white/70 py-2.5 px-3 text-xs font-semibold hover:text-white hover:border-white/30"
          >
            Пропустить
          </button>
        </div>
      </motion.div>
    </>
  );
}
