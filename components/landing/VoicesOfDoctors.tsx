"use client";
import { motion } from "framer-motion";
import { Quote, ExternalLink, FileSearch } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";
import { voices, studies } from "@/lib/voices-data";

export default function VoicesOfDoctors() {
  const featured = voices.find((v) => v.featured) ?? voices[0];
  const rest = voices.filter((v) => v.id !== featured.id);

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl mb-12">
          <Eyebrow>Что говорят врачи</Eyebrow>
          <h2 className="font-display text-[26px] sm:text-5xl font-bold leading-tight mb-4">
            Это подтверждают{" "}
            <span className="text-accent">сами врачи</span>
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Мы собрали публикации казахстанских СМИ и международные исследования
            о том, сколько времени у врачей уходит на документацию — и сколько
            остаётся пациенту. Все ссылки ведут на оригинальные статьи.
          </p>
        </div>

        {/* Главная цитата — тёмная карточка */}
        <motion.a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="block rounded-3xl bg-dark text-white p-7 sm:p-10 shadow-xl mb-6 hover:shadow-2xl transition-shadow group"
        >
          <Quote className="w-10 h-10 text-accent-dark mb-5" />
          <blockquote className="font-display text-xl sm:text-3xl font-semibold leading-snug max-w-3xl">
            «{featured.quote}»
          </blockquote>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/90">
                {featured.author}
              </p>
              <p className="text-xs text-white/60 mt-0.5">
                {featured.source}, {featured.year}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-accent-light tabular-nums">
                  {featured.stat}
                </p>
                <p className="text-[11px] text-white/50">{featured.statLabel}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-light group-hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> Читать источник
              </span>
            </div>
          </div>
        </motion.a>

        {/* Остальные казахстанские цитаты */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {rest.map((v, i) => (
            <motion.a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40 group"
            >
              <Quote className="w-6 h-6 text-accent mb-4" />
              <blockquote className="text-[15px] text-ink leading-relaxed flex-1">
                «{v.quote}»
              </blockquote>
              <div className="mt-5 pt-4 border-t border-border">
                <p className="font-display text-2xl font-bold text-accent tabular-nums">
                  {v.stat}
                </p>
                <p className="text-[11px] text-muted mt-0.5 leading-snug">
                  {v.statLabel}
                </p>
                <p className="text-xs text-muted mt-3">
                  {v.author} · {v.source}, {v.year}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Читать источник
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Международные исследования */}
        <div className="max-w-2xl mb-8">
          <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug">
            Международные исследования приходят{" "}
            <span className="text-accent">к тому же выводу</span>
          </h3>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            Peer-reviewed исследования о влиянии документации на время пациента
            в первичном звене.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {studies.map((s, i) => (
            <motion.a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-4 rounded-2xl border border-border bg-paper/60 p-5 transition-colors hover:border-accent/40 group"
            >
              <FileSearch className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-ink">
                  {s.authors} ({s.year}) ·{" "}
                  <span className="text-accent group-hover:underline">
                    {s.journal}
                  </span>
                </p>
                <p className="text-[13px] text-muted mt-1.5 leading-relaxed">
                  {s.finding}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        <p className="text-[11px] text-muted mt-8 leading-relaxed max-w-3xl">
          Цитаты — из публикаций казахстанских СМИ и заявлений участников
          круглых столов; это не репрезентативные замеры по стране. Цифры
          исследований США и ЕС показывают масштаб проблемы, но не переносятся
          напрямую на Казахстан.
        </p>
      </div>
    </section>
  );
}
