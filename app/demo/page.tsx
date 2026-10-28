"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Layers,
  Plug,
  Settings,
  Plus,
  Play,
  Square,
  Search,
  Star,
  MoreVertical,
  Send,
  Sparkles,
  Clock,
  Copy,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  misFields,
  noteDraft,
  replicas,
  warnings,
} from "@/lib/demo-data";
import type { Replica } from "@/lib/demo-data";
import LangChip from "@/components/shared/LangChip";

type MainNav = "visits" | "templates" | "integration" | "settings";

interface PatientVisit {
  id: string;
  name: string;
  time: string;
  type: string;
  status: "active" | "completed" | "waiting";
  gender: string;
  age: number;
  iinMasked: string;
}

const mockVisits: PatientVisit[] = [
  {
    id: "v-1",
    name: "Ибрагимова Айгерим",
    time: "14:30",
    type: "Повторный приём · Терапевт",
    status: "active",
    gender: "Женский",
    age: 48,
    iinMasked: "760412******",
  },
  {
    id: "v-2",
    name: "Ахметов Руслан",
    time: "15:15",
    type: "Первичный приём · Кардиолог",
    status: "waiting",
    gender: "Мужской",
    age: 54,
    iinMasked: "700823******",
  },
  {
    id: "v-3",
    name: "Садыков Бахытжан",
    time: "16:00",
    type: "Диспансерный осмотр",
    status: "waiting",
    gender: "Мужской",
    age: 62,
    iinMasked: "620105******",
  },
  {
    id: "v-4",
    name: "Касымова Гульнара",
    time: "16:45",
    type: "Консультация",
    status: "completed",
    gender: "Женский",
    age: 39,
    iinMasked: "851120******",
  },
];

const mockTemplates = [
  {
    id: "t-1",
    name: "Первичный приём терапевта (форма №025/у)",
    owner: "Я (Д-р Искакова)",
    activity: "2 часа назад",
    starred: true,
    sections: ["Жалобы", "Анамнез заболевания", "Анамнез жизни", "Объективный статус", "Диагноз МКБ-10", "Назначения"],
  },
  {
    id: "t-2",
    name: "Повторный приём кардиолога (АГ / ИБС)",
    owner: "Я (Д-р Искакова)",
    activity: "6 часов назад",
    starred: true,
    sections: ["Динамика АД", "Стенокардия/переносимость нагрузки", "Физикальный статус", "ЭКГ", "Коррекция терапии"],
  },
  {
    id: "t-3",
    name: "Осмотр педиатра (дошкольный)",
    owner: "Клиника (Общий)",
    activity: "Вчера",
    starred: false,
    sections: ["Анамнез развития", "Вакцинация", "Физическое развитие", "Системный осмотр", "Заключение"],
  },
  {
    id: "t-4",
    name: "Неврологический статус",
    owner: "Dariger Library",
    activity: "3 дня назад",
    starred: false,
    sections: ["ЧМН", "Двигательная сфера", "Чувствительность", "Координация", "Менингеальные знаки"],
  },
  {
    id: "t-5",
    name: "Эндокринологический чек-ап (Сахарный диабет 2 типа)",
    owner: "Dariger Library",
    activity: "1 неделю назад",
    starred: true,
    sections: ["Гликемический профиль", "HbA1c", "Осмотр стоп", "Диета", "Схема сахароснижающей терапии"],
  },
];

export default function DemoPage() {
  const [activeNav, setActiveNav] = useState<MainNav>("visits");
  const [selectedVisit, setSelectedVisit] = useState<PatientVisit>(mockVisits[0]);

  // Visit simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [visibleReplicas, setVisibleReplicas] = useState<Replica[]>(replicas.slice(0, 4));
  const [activeTab, setActiveTab] = useState<"note" | "transcript" | "context">("note");
  const [copied, setCopied] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: "Здравствуйте, доктор. Я готов помочь по пациенту Айгерим Ибрагимовой. Во время приёма зафиксированы жалобы на головокружение и АД 150/95 на фоне нерегулярного приёма эналаприла.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Templates state
  const [templateTab, setTemplateTab] = useState<"learned" | "structured">("learned");

  // Integration state
  const [selectedEhr, setSelectedEhr] = useState("DamuMed (ДамуМед)");
  const [pushedFields, setPushedFields] = useState<Record<string, boolean>>({});

  // Timer effect for recording
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Reveal all replicas gradually
      setVisibleReplicas(replicas);
    } else {
      setIsRecording(false);
    }
  };

  const handleCopyNote = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "По клиническому протоколу МЗ РК при неэффективности монотерапии эналаприлом 5 мг рекомендуется комбинация с антагонистом кальция (амлодипин 5 мг) или диуретиком (индапамид 1.5 мг).";
      if (userText.toLowerCase().includes("нпвп") || userText.toLowerCase().includes("совместим")) {
        reply = "Внимание: при одновременном приёме иАПФ (эналаприл) и НПВП возможно снижение антигипертензивного эффекта и риск ухудшения функции почек (контроль СКФ).";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 700);
  };

  const handlePushToEhr = () => {
    setPushSuccess(true);
    const updated: Record<string, boolean> = {};
    misFields.forEach((f) => (updated[f.field] = true));
    setPushedFields(updated);
    setTimeout(() => setPushSuccess(false), 3000);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex h-screen bg-paper text-ink overflow-hidden font-sans">
      {/* 1. ЛЕВЫЙ ОСНОВНОЙ САЙДБАР (ПО РЕФЕРЕНСУ FREED AI) */}
      <aside className="w-16 md:w-60 bg-dark text-white flex flex-col justify-between border-r border-white/10 shrink-0">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-4 md:px-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm shadow-md shadow-accent/40">
                Д
              </span>
              <span className="hidden md:block font-bold text-base tracking-tight text-white">
                Dariger<span className="text-accent"> AI</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            <button
              onClick={() => setActiveNav("visits")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeNav === "visits"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Calendar className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Приёмы (Visits)</span>
            </button>

            <button
              onClick={() => setActiveNav("templates")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeNav === "templates"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Layers className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Шаблоны (Templates)</span>
            </button>

            <button
              onClick={() => setActiveNav("integration")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeNav === "integration"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Plug className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">МИС (EHR Push)</span>
            </button>

            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeNav === "settings"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Настройки</span>
            </button>
          </nav>
        </div>

        {/* Doctor profile bottom */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0">
              АИ
            </div>
            <div className="hidden md:block overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Д-р Искакова А.</p>
              <p className="text-[10px] text-white/50 truncate">Врач-терапевт</p>
            </div>
          </div>
          <div className="mt-2 text-center md:text-left">
            <Link
              href="/"
              className="text-[11px] text-accent hover:underline hidden md:inline-block px-2"
            >
              ← На главную сайта
            </Link>
          </div>
        </div>
      </aside>

      {/* 2. ОСНОВНАЯ ЗОНА В ЗАВИСИМОСТИ ОТ ВКЛАДКИ */}

      {/* ----------------- РЕЖИМ 1: ПРИЁМЫ (VISITS) ----------------- */}
      {activeNav === "visits" && (
        <div className="flex-1 flex overflow-hidden">
          {/* Сайдбар списка визитов */}
          <div className="w-72 bg-white border-r border-border flex flex-col shrink-0 hidden lg:flex">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm">Сегодня · 28 октября</span>
                <span className="text-xs text-muted">4 приёма</span>
              </div>
              <button
                onClick={() => alert("В демо-режиме открыт приём Айгерим Ибрагимовой")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent text-white py-2.5 text-xs font-semibold hover:bg-accent-deep transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Новый приём
              </button>
            </div>

            <div className="p-3">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Поиск пациента..."
                  className="w-full rounded-xl bg-paper border border-border pl-8 pr-3 py-2 text-xs focus:outline-accent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
              {mockVisits.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVisit(v)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedVisit.id === v.id
                      ? "bg-accent-pale border-accent/30 shadow-2xs"
                      : "bg-white border-border/60 hover:bg-paper"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink truncate">{v.name}</span>
                    <span className="text-[11px] text-muted font-mono">{v.time}</span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 truncate">{v.type}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        v.status === "active"
                          ? "bg-success"
                          : v.status === "completed"
                          ? "bg-muted"
                          : "bg-warn"
                      }`}
                    />
                    <span className="text-[10px] text-muted">
                      {v.status === "active" ? "Идёт приём" : v.status === "completed" ? "Завершён" : "Ожидает"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Рабочая зона активного визита */}
          <div className="flex-1 flex flex-col overflow-hidden bg-paper">
            {/* Панель визита: шапка с кнопкой Capture */}
            <div className="h-18 bg-white border-b border-border px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-lg text-ink">{selectedVisit.name}</h1>
                    <span className="text-xs rounded-full bg-accent-pale text-accent px-2.5 py-0.5 font-medium border border-accent/20">
                      Повторный пациент
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {selectedVisit.gender}, {selectedVisit.age} лет · ИИН {selectedVisit.iinMasked} · Приём в 14:30
                  </p>
                </div>
              </div>

              {/* Кнопка Capture аудио */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-paper border border-border px-3 py-1.5 rounded-xl font-mono text-xs">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  <span>{formatTimer(recordSeconds || 92)}</span>
                </div>

                <button
                  onClick={handleToggleRecord}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                    isRecording
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-accent text-white hover:bg-accent-deep shadow-accent/20"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" /> Остановить запись
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Запись приёма
                    </>
                  )}
                </button>

                <button
                  onClick={handlePushToEhr}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-dark text-white px-4 py-2.5 text-xs font-semibold hover:bg-dark/80 transition-colors"
                >
                  <Plug className="w-3.5 h-3.5" /> Вставить в МИС
                </button>
              </div>
            </div>

            {/* Вкладки: Протокол (SOAP) / Транскрипт kk-ru / Контекст */}
            <div className="border-b border-border bg-white px-6 flex items-center justify-between">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab("note")}
                  className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === "note"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  Протокол приёма (SOAP · форма №025/у)
                </button>
                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === "transcript"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  Живой транскрипт (kk/ru)
                  <span className="text-[10px] bg-accent-pale text-accent px-1.5 py-0.5 rounded-md">
                    {visibleReplicas.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("context")}
                  className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === "context"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  Анамнез и данные пациента
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNote}
                  className="text-xs text-muted hover:text-ink flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-paper"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Скопировано!" : "Копировать"}
                </button>
              </div>
            </div>

            {/* Контент активной вкладки */}
            <div className="flex-1 overflow-y-auto p-6">
              {pushSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl bg-success/10 border border-success/30 p-3.5 text-xs text-success font-semibold flex items-center justify-between"
                >
                  <span>✓ Данные протокола успешно переданы в МИС (DamuMed)! Все поля заполнены.</span>
                  <span className="text-[11px] underline cursor-pointer">Открыть карту в МИС</span>
                </motion.div>
              )}

              {activeTab === "note" && (
                <div className="max-w-3xl space-y-4">
                  {noteDraft.map((sec) => (
                    <div
                      key={sec.id}
                      className="rounded-2xl border border-border bg-white p-5 shadow-2xs hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                          {sec.title}
                        </h3>
                        <span className="text-[10px] text-muted bg-paper px-2 py-0.5 rounded">
                          AI Structured
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {sec.lines.map((l, i) => (
                          <div key={i} className="flex items-start justify-between gap-3 text-sm">
                            <p className="text-ink leading-relaxed">{l.text}</p>
                            {l.src && (
                              <span className="text-[10px] text-accent/80 font-mono shrink-0 mt-0.5 bg-accent-pale px-1.5 py-0.5 rounded">
                                [реплика #{l.src.join(", ")}]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Блок предупреждений / валидации */}
                  <div className="rounded-2xl border border-warn/30 bg-warn/5 p-4 text-xs">
                    <p className="font-bold text-warn mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Клиническая проверка полноты
                    </p>
                    {warnings.map((w) => (
                      <p key={w.id} className="text-muted mt-1">
                        • {w.text} ({w.hint})
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "transcript" && (
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span>Смешанная казахско-русская речь с распознаванием диаризации</span>
                    <span className="text-accent font-medium">Модель: Dariger ASR v2.4 (kk+ru)</span>
                  </div>
                  {visibleReplicas.map((r) => (
                    <div
                      key={r.id}
                      className={`flex gap-3 rounded-xl p-3 border ${
                        r.speaker === "doctor"
                          ? "bg-accent-pale/40 border-accent/20"
                          : "bg-white border-border"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          r.speaker === "doctor"
                            ? "bg-accent text-white"
                            : "bg-paper text-muted border border-border"
                        }`}
                      >
                        {r.speaker === "doctor" ? "ВР" : "ПЦ"}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-semibold text-muted">
                            #{r.id} · {r.speaker === "doctor" ? "Врач" : "Пациент"}
                          </span>
                          <LangChip lang={r.lang} />
                        </div>
                        <p className="text-sm leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "context" && (
                <div className="max-w-2xl bg-white rounded-2xl border border-border p-6 space-y-4">
                  <h3 className="font-bold text-base mb-2">Анамнез жизни и хронические состояния</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-paper rounded-xl">
                      <span className="text-muted block mb-1">Хронические диагнозы</span>
                      <span className="font-semibold text-sm">I10 Гипертоническая болезнь II ст.</span>
                    </div>
                    <div className="p-3 bg-paper rounded-xl">
                      <span className="text-muted block mb-1">Аллергологический анамнез</span>
                      <span className="font-semibold text-sm text-success">Не отягощён</span>
                    </div>
                    <div className="p-3 bg-paper rounded-xl">
                      <span className="text-muted block mb-1">Постоянная терапия</span>
                      <span className="font-semibold text-sm">Эналаприл 5 мг утром</span>
                    </div>
                    <div className="p-3 bg-paper rounded-xl">
                      <span className="text-muted block mb-1">Последний визит</span>
                      <span className="font-semibold text-sm">14.07.2026 (3 мес. назад)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Правая панель AI ЧАТ (ПО РЕФЕРЕНСУ FREED AI DEMO) */}
          <div className="w-80 bg-white border-l border-border flex flex-col shrink-0 hidden xl:flex">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-bold text-sm">AI Клинический ассистент</span>
              </div>
              <span className="text-[10px] text-muted bg-paper px-2 py-0.5 rounded">МЗ РК</span>
            </div>

            {/* Quick action chips */}
            <div className="p-3 border-b border-border bg-paper/50 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase text-muted tracking-wider">
                Быстрые вопросы
              </p>
              <button
                onClick={() => {
                  setChatInput("Проверить совместимость эналаприла и НПВП");
                }}
                className="w-full text-left text-[11px] p-2 rounded-lg bg-white border border-border hover:border-accent/40 text-muted hover:text-ink transition-colors line-clamp-1"
              >
                ⚡ Совместимость эналаприла и НПВП
              </button>
              <button
                onClick={() => {
                  setChatInput("Клинический протокол МЗ РК по АГ");
                }}
                className="w-full text-left text-[11px] p-2 rounded-lg bg-white border border-border hover:border-accent/40 text-muted hover:text-ink transition-colors line-clamp-1"
              >
                📋 Протокол МЗ РК при гипертензии
              </button>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-xs rounded-xl p-3 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-accent text-white ml-6"
                      : "bg-paper border border-border text-ink mr-2"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-border bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Спросить ассистента..."
                className="flex-1 rounded-xl bg-paper border border-border px-3 py-2 text-xs focus:outline-accent"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 hover:bg-accent-deep transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- РЕЖИМ 2: ШАБЛОНЫ (TEMPLATES ПО ДЕМО 1) ----------------- */}
      {activeNav === "templates" && (
        <div className="flex-1 flex flex-col bg-paper overflow-hidden">
          <div className="bg-white border-b border-border px-8 py-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-bold text-2xl text-ink">
                    Настройка заметок с помощью <span className="text-accent">шаблонов</span>
                  </h1>
                  <p className="text-sm text-muted mt-1">
                    Адаптивные шаблоны настраивают структуру протокола под ваш профиль и специальность.
                  </p>
                </div>
                <button
                  onClick={() => alert("Создание нового шаблона по форме РК")}
                  className="rounded-full bg-accent text-white px-5 py-2.5 text-xs font-semibold hover:bg-accent-deep transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Новый шаблон
                </button>
              </div>

              {/* Sub-tabs: Learned vs Structured */}
              <div className="flex gap-4 border-b border-border pt-4">
                <button
                  onClick={() => setTemplateTab("learned")}
                  className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                    templateTab === "learned"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  Адаптивные шаблоны (Learned templates)
                </button>
                <button
                  onClick={() => setTemplateTab("structured")}
                  className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                    templateTab === "structured"
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  Стандартизированные формы РК (№025/у)
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-5xl mx-auto">
              {/* Таблица шаблонов (по референсу demo1.png) */}
              <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-paper border-b border-border text-muted uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-5">Название шаблона</th>
                      <th className="py-3 px-5">Владелец</th>
                      <th className="py-3 px-5">Последняя активность</th>
                      <th className="py-3 px-5 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockTemplates.map((t) => (
                      <tr key={t.id} className="hover:bg-accent-pale/20 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-accent-pale text-accent flex items-center justify-center shrink-0">
                              <Layers className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="font-semibold text-sm text-ink">{t.name}</p>
                              <p className="text-[11px] text-muted mt-0.5">
                                Разделы: {t.sections.slice(0, 3).join(", ")}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-muted font-medium">{t.owner}</td>
                        <td className="py-4 px-5 text-muted">{t.activity}</td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              aria-label="Избранное"
                              className={`p-1.5 rounded-lg hover:bg-paper ${
                                t.starred ? "text-warn" : "text-muted"
                              }`}
                            >
                              <Star className={`w-4 h-4 ${t.starred ? "fill-current" : ""}`} />
                            </button>
                            <button aria-label="Опции" className="p-1.5 rounded-lg hover:bg-paper text-muted">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted mt-4 text-center">
                Показано 5 шаблонов из библиотеки клиники и клинических протоколов МЗ РК
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- РЕЖИМ 3: ИНТЕГРАЦИЯ С МИС (EHR PUSH ПО ДЕМО 2) ----------------- */}
      {activeNav === "integration" && (
        <div className="flex-1 flex flex-col bg-paper overflow-hidden">
          <div className="bg-white border-b border-border px-8 py-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="font-bold text-2xl text-ink">
                  Расширение <span className="text-accent">Dariger Extension</span> для МИС
                </h1>
                <p className="text-sm text-muted mt-1">
                  Записывайте приём и передавайте готовую карту в вашу МИС без ручного копирования.
                </p>
              </div>
              <button
                onClick={() => alert("Расширение Chrome готово к подключению к DamuMed")}
                className="rounded-full bg-accent text-white px-5 py-2.5 text-xs font-semibold hover:bg-accent-deep transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Установить расширение Chrome
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Симуляция плавающего окна расширения поверх DamuMed (по demo2.png) */}
              <div className="rounded-3xl border border-border bg-dark text-white p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-xs text-white/50 ml-2 font-mono">
                      https://damumed.kz/doctor/encounter/104928
                    </span>
                  </div>
                  <span className="text-xs text-accent font-semibold bg-accent/20 px-3 py-1 rounded-full">
                    DamuMed + Dariger Extension
                  </span>
                </div>

                <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
                  {/* Левая сторона: поля МИС DamuMed */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
                    <p className="text-white/60 font-semibold uppercase tracking-wider mb-2">
                      Поля первичного осмотра в DamuMed
                    </p>

                    {misFields.map((f) => (
                      <div key={f.field} className="space-y-1">
                        <label className="text-[11px] text-white/60">{f.field}</label>
                        <input
                          type="text"
                          readOnly
                          value={pushedFields[f.field] ? f.value : ""}
                          placeholder={pushedFields[f.field] ? "" : "Ожидает автозаполнения..."}
                          className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white/90 font-mono text-[11px]"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Правая сторона: плавающее окно Dariger Extension */}
                  <div className="rounded-2xl bg-white text-ink p-5 shadow-2xl border border-accent/30 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs">
                          Д
                        </span>
                        <span className="font-bold text-sm">Dariger Widget</span>
                      </div>
                      <span className="text-[10px] bg-success/15 text-success font-semibold px-2 py-0.5 rounded">
                        Подключено к МИС
                      </span>
                    </div>

                    <p className="text-xs text-muted">
                      Готовый черновик карты Айгерим Ибрагимовой подготовлен к экспорту в форму ДамуМед.
                    </p>

                    <button
                      onClick={handlePushToEhr}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent text-white py-3 text-xs font-bold hover:bg-accent-deep transition-all shadow-md shadow-accent/20"
                    >
                      <Plug className="w-4 h-4" /> Перенести все поля в DamuMed (Push to EHR)
                    </button>

                    <div className="space-y-2 pt-2 border-t border-border text-xs">
                      {[
                        "Жалобы пациента",
                        "Анамнез заболевания",
                        "Объективный статус",
                        "Код МКБ-10 (I10)",
                        "Назначения и рецепты",
                      ].map((item) => (
                        <div key={item} className="flex items-center justify-between text-muted">
                          <span>{item}</span>
                          <span className="text-success text-[10px] font-semibold">
                            {pushedFields[item] ? "✓ Заполнено" : "Готово к переносу"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Выбор МИС */}
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-bold text-base mb-3">Поддерживаемые медицинские системы Казахстана</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    "DamuMed (ДамуМед)",
                    "ЭЦЗ (Электронный паспорт)",
                    "MedElement",
                    "КМИС (Астана / регионы)",
                    "1С:Медицина для Казахстана",
                    "Custom REST / WebSocket API",
                  ].map((ehr) => (
                    <button
                      key={ehr}
                      onClick={() => setSelectedEhr(ehr)}
                      className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        selectedEhr === ehr
                          ? "border-accent bg-accent-pale text-accent shadow-2xs"
                          : "border-border bg-paper text-ink hover:bg-white"
                      }`}
                    >
                      {ehr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- РЕЖИМ 4: НАСТРОЙКИ (SETTINGS) ----------------- */}
      {activeNav === "settings" && (
        <div className="flex-1 flex flex-col bg-paper overflow-hidden p-8">
          <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl border border-border p-8 space-y-6">
            <h1 className="font-bold text-2xl text-ink">Настройки клиники и профиля врача</h1>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-4 bg-paper rounded-xl border border-border">
                <div>
                  <p className="font-semibold">Языковые модели и распознавание</p>
                  <p className="text-xs text-muted">Смешанный казахско-русский корпус + латынь (ASR v2.4)</p>
                </div>
                <span className="text-xs font-semibold text-accent">Включено</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-paper rounded-xl border border-border">
                <div>
                  <p className="font-semibold">Локализация данных (ЦОД РК)</p>
                  <p className="text-xs text-muted">Серверы в г. Астана / Алматы, строго 152-ФЗ / Закон РК</p>
                </div>
                <span className="text-xs font-semibold text-success">Активно</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-paper rounded-xl border border-border">
                <div>
                  <p className="font-semibold">Автоматическое обезличивание (ИИН и ФИО)</p>
                  <p className="text-xs text-muted">Деидентификация перед передачей текста в модель</p>
                </div>
                <span className="text-xs font-semibold text-success">Строгий режим</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
