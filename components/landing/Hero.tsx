"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroAnimation from "./HeroAnimation";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16">
      {/* bg: синий радиальный + dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,var(--accent-light)_0%,var(--paper)_70%)]" />
      <div className="absolute inset-0 dot-grid opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-pale px-4 py-1.5 text-sm text-accent font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            ИИ-ассистент для врачей Казахстана
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-[40px] sm:text-6xl lg:text-[76px] leading-[1.06] tracking-[-0.03em] font-bold"
          >
            Врач говорит.
            <br />
            <span className="text-accent">Карта пишется сама.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto"
          >
            Фоновый ИИ-ассистент слушает приём на казахском и русском,
            распознаёт медицинскую терминологию и готовит черновик записи
            по формам МЗ РК. Врач проверяет и подписывает.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/demo"
              className="rounded-full bg-accent text-white px-8 py-3.5 text-sm font-semibold shadow-lg shadow-accent/25 hover:bg-accent-deep transition-colors"
            >
              Попробовать демо
            </Link>
            <Link
              href="#how"
              className="rounded-full border border-border-strong bg-white px-8 py-3.5 text-sm font-semibold hover:bg-accent-pale transition-colors"
            >
              Как это работает
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mt-16"
        >
          <HeroAnimation />
        </motion.div>
      </div>
    </section>
  );
}
