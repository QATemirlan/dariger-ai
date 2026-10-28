"use client";
import { motion } from "framer-motion";
import { Mic, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import Eyebrow from "@/components/shared/Eyebrow";
import LangChip from "@/components/shared/LangChip";

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
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-ink">Аудиопоток · 44.1 кГц</span>
            </div>
            <span className="text-[10px] bg-accent-pale text-accent px-2 py-0.5 rounded-full font-semibold">
              Live ASR
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-accent-pale/40 border border-accent/15 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-muted">#1 Пациент</span>
                <LangChip lang="mix" />
              </div>
              <p className="text-ink">«Басым айналып жүр уже недели три, особенно по утрам.»</p>
            </div>

            <div className="p-2.5 rounded-xl bg-paper border border-border text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-muted">#2 Врач</span>
                <LangChip lang="ru" />
              </div>
              <p className="text-ink">«Давление дома меряете? Какие обычные цифры?»</p>
            </div>

            <div className="p-2.5 rounded-xl bg-accent-pale/40 border border-accent/15 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-muted">#3 Пациент</span>
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
              <ShieldCheck className="w-4 h-4 text-accent" /> Модуль деидентификации
            </span>
            <span className="text-[10px] text-success font-mono bg-success/20 px-2 py-0.5 rounded">
              100% зашифровано
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white/50 text-[10px]">ФИО пациента</p>
                <p className="font-mono text-white/90">Ибрагимова А. → [PATIENT_ID_7492]</p>
              </div>
              <span className="text-success text-xs font-bold">✓ Скрыто</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white/50 text-[10px]">Индивидуальный номер (ИИН)</p>
                <p className="font-mono text-white/90">760412301984 → [IIN_TOKEN_9182]</p>
              </div>
              <span className="text-success text-xs font-bold">✓ Скрыто</span>
            </div>

            <p className="text-[10px] text-white/40 pt-1">
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
              Первичный осмотр (форма №025/у)
            </span>
            <span className="text-[10px] text-muted">SOAP Model</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-paper border border-border">
              <span className="text-[10px] text-accent font-bold uppercase block mb-0.5">Жалобы</span>
              <p className="text-ink">Головокружение по утрам (~3 нед.), головная боль в затылке, лёгкая тошнота.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-paper border border-border">
              <span className="text-[10px] text-accent font-bold uppercase block mb-0.5">Объективный статус</span>
              <p className="text-ink">АД 150/95 мм рт. ст., ЧСС 76 уд/мин, ритм правильный.</p>
            </div>

            <div className="p-2.5 rounded-lg bg-accent-pale/50 border border-accent/20">
              <span className="text-[10px] text-accent font-bold uppercase block mb-0.5">Диагноз (МКБ-10)</span>
              <p className="text-ink font-semibold">I10 — Эссенциальная (первичная) гипертензия</p>
            </div>

            <div className="p-2.5 rounded-lg bg-paper border border-border">
              <span className="text-[10px] text-accent font-bold uppercase block mb-0.5">Назначения</span>
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
            <span className="text-[10px] text-success font-semibold bg-success/15 px-2 py-0.5 rounded">
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

        {/* НЕПРЕРЫВНАЯ СИНЯЯ ЛЕНТА / CIRCUIT FLOW (ПО РЕФЕРЕНСУ AUXIA) */}
        <div className="relative">
          {/* Фоновая направляющая линия по центру */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-8 w-[3px] -translate-x-1/2 bg-gradient-to-b from-accent via-accent-deep to-accent shadow-sm" />

          <div className="space-y-16">
            {steps.map((step, idx) => (
              <div key={step.badge} className="relative">
                {/* Метка на синей линии (в стиле Auxia) */}
                <div className="flex justify-center mb-6">
                  <div className="relative z-10 inline-flex items-center gap-2 rounded-full bg-accent text-white px-5 py-2 text-xs font-bold shadow-lg shadow-accent/25 tracking-wide">
                    <step.icon className="w-3.5 h-3.5" />
                    <span>{step.badge}</span>
                  </div>
                </div>

                {/* Подпись к этапу на ленте */}
                <div className="text-center mb-6">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-muted tracking-[0.2em] uppercase bg-paper px-3 py-1 rounded-full border border-border">
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
                    <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1 mb-3 text-ink">
                      {step.title}
                    </h3>
                    <p className="text-muted leading-relaxed text-sm sm:text-base">
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

          {/* Финальная точка синей линии */}
          <div className="flex justify-center mt-12">
            <div className="w-4 h-4 rounded-full bg-accent ring-4 ring-accent-light shadow-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
