"use client";
import { useEffect, useRef, useState } from "react";
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
  Zap,
  FileText,
  PenLine,
  X,
  CheckCircle2,
  PanelRightClose,
  PanelRightOpen,
  UserRound,
  Home,
} from "lucide-react";
import {
  misFields,
  noteDraft,
  replicas,
  warnings,
  pipeline,
  REPLICA_MEDIA_SECONDS,
  SPEEDUP,
} from "@/lib/demo-data";
import type { Replica } from "@/lib/demo-data";
import LangChip from "@/components/shared/LangChip";
import TourSpotlight, { type TourStep } from "@/components/shared/TourSpotlight";

type MainNav = "visits" | "templates" | "integration" | "settings";
type ScenarioPhase = "idle" | "recording" | "processing" | "ready";

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
    name: "Первичный приём терапевта (форма №052/у)",
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
  const [visits, setVisits] = useState<PatientVisit[]>(mockVisits);

  // Visit simulation state
  const [scenarioPhase, setScenarioPhase] = useState<ScenarioPhase>("idle");
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [visibleReplicas, setVisibleReplicas] = useState<Replica[]>([]);
  const [processingStage, setProcessingStage] = useState(-1);
  const simulationStartedAt = useRef<number | null>(null);
  const [activeTab, setActiveTab] = useState<"note" | "transcript" | "context">("note");
  const [copied, setCopied] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  // AI Chat state
  const [aiTyping, setAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: "Здравствуйте, доктор. Я готов помочь по пациенту Айгерим Ибрагимовой. Во время приёма зафиксированы жалобы на головокружение и АД 150/95 на фоне нерегулярного приёма эналаприла.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Tour state: многошаговый обучающий тур + праздник после подписи
  const [tourStep, setTourStep] = useState(0); // -1 = тур выключен
  const [tourActive, setTourActive] = useState(true);
  const [showSignedCelebration, setShowSignedCelebration] = useState(false);

  // Анкета нового приёма: «Как вас зовут?»
  const [newVisitOpen, setNewVisitOpen] = useState(false);
  const [patientName, setPatientName] = useState("");

  // Вкладки: скролл-шейд на мобильных
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [tabsScrolled, setTabsScrolled] = useState(true);

  // Панель ассистента: скрытие/показ + подсказки
  const [chatOpen, setChatOpen] = useState(true);
  // Мобильная шторка ассистента (bottom sheet)
  const [chatSheetOpen, setChatSheetOpen] = useState(false);
  const [chatHintSeen, setChatHintSeen] = useState(false);
  const [chatInputHintSeen, setChatInputHintSeen] = useState(false);
  const [showDraftTooltip, setShowDraftTooltip] = useState(false);
  const [signed, setSigned] = useState(false);

  // Templates state
  const [templateTab, setTemplateTab] = useState<"learned" | "structured">("learned");

  // Integration state
  const [selectedEhr, setSelectedEhr] = useState("DamuMed (ДамуМед)");
  const [pushedFields, setPushedFields] = useState<Record<string, boolean>>({});

  // Ускоренная запись: 92 секунды приёма проигрываются в 5 раз быстрее.
  useEffect(() => {
    if (scenarioPhase !== "recording") return;

    simulationStartedAt.current = Date.now();
    const interval = window.setInterval(() => {
      const startedAt = simulationStartedAt.current ?? Date.now();
      const virtualSeconds = Math.min(
        REPLICA_MEDIA_SECONDS,
        ((Date.now() - startedAt) / 1000) * SPEEDUP,
      );
      setRecordSeconds(Math.floor(virtualSeconds));
      setVisibleReplicas(replicas.filter((replica) => replica.at <= virtualSeconds));

      if (virtualSeconds >= REPLICA_MEDIA_SECONDS) {
        window.clearInterval(interval);
        setScenarioPhase("processing");
        setProcessingStage(0);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [scenarioPhase]);

  // Пайплайн намеренно ускорен: он показывает последовательность, но не заставляет
  // посетителя ждать реальные расчётные секунды из демо-данных.
  useEffect(() => {
    if (scenarioPhase !== "processing") return;

    let cancelled = false;
    let stage = 1;
    const advance = () => {
      if (cancelled) return;
      if (stage >= pipeline.length) {
        setScenarioPhase("ready");
        setProcessingStage(pipeline.length);
        return;
      }
      setProcessingStage(stage);
      stage += 1;
      window.setTimeout(advance, 850);
    };

    const timeout = window.setTimeout(advance, 850);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [scenarioPhase]);

  // После обработки логично перевести пользователя туда, где данные отображаются:
  // автопереход на вкладку протокола + короткий тултип + продолжение тура.
  useEffect(() => {
    if (scenarioPhase !== "ready") return;
    setActiveTab("note");
    setShowDraftTooltip(true);
    const t = window.setTimeout(() => setShowDraftTooltip(false), 6000);
    return () => window.clearTimeout(t);
  }, [scenarioPhase]);

  // После подписи: подсказка «вот у вас здесь есть ИИ-ассистент».
  const [postSignHint, setPostSignHint] = useState(false);
  useEffect(() => {
    if (!postSignHint) return;
    const t = window.setTimeout(() => setPostSignHint(false), 15_000);
    return () => window.clearTimeout(t);
  }, [postSignHint]);

  // Тур: во время записи прячем затемнение, чтобы не мешать смотреть транскрипт.
  const tourVisible =
    tourActive && tourStep >= 0 && scenarioPhase !== "recording" && !newVisitOpen && !showSignedCelebration && !postSignHint;

  // Шаги тура. Доступные селекторы зависят от фазы сценария, поэтому шаги собраны
  // как функция: она возвращает список, актуальный для текущего состояния.
  const buildTourSteps = (): TourStep[] => {
    const steps: TourStep[] = [
      {
        target: '[data-tour="new-visit"]',
        title: "Нажмите «Новый приём»",
        text: "Начните с создания нового приёма: нажмите эту кнопку и введите имя пациента — запись начнётся автоматически.",
        onEnter: () => setActiveNav("visits"),
      },
      {
        target: '[data-tour="record"]',
        title: "Кнопка записи",
        text: "Если приём уже создан — начните демо-запись этой кнопкой. Диалог врача с пациентом проиграется в ускоренном темпе.",
      },
      {
        target: '[data-tour="timer"]',
        title: "Таймер приёма",
        text: "Здесь видно время приёма: 92 секунды реального разговора проигрываются примерно за 18 секунд (ускорение ×5).",
      },
      {
        target: '[data-tour="transcript-tab"]',
        title: "Живой транскрипт",
        text: "Речь распознаётся в реальном времени: казахский и русский смешиваются, реплики автоматически делятся по ролям.",
        onEnter: () => setActiveTab("transcript"),
      },
    ];
    if (scenarioPhase === "ready" || scenarioPhase === "processing") {
      steps.push(
        {
          target: '[data-tour="pipeline"]',
          title: "Обработка записи",
          text: "После записи: распознавание → обезличивание → структурирование → проверка полноты. Занимает пару секунд.",
          onEnter: () => setActiveTab("note"),
        },
        {
          target: '[data-tour="note-tab"]',
          title: "Готовый протокол",
          text: "SOAP-черновик по форме №052/у. Каждый факт снабжён ссылкой на реплику — проверьте и поправьте при необходимости.",
          onEnter: () => setActiveTab("note"),
        },
        {
          target: '[data-tour="copy"]',
          title: "Копирование",
          text: "Черновик можно скопировать одним кликом и вставить в любую систему.",
        },
        {
          target: '[data-tour="sign"]',
          title: "Подписать документы",
          text: "Финальный шаг: проверьте черновик и подпишите документы — они отправятся в МИС.",
          onEnter: () => {
            document.querySelector('[data-tour="sign"]')?.scrollIntoView({ block: "center" });
          },
        },
      );
    }
    return steps;
  };

  const tourSteps = buildTourSteps();

  const handleToggleRecord = () => {
    if (scenarioPhase === "processing") return;
    setTourActive(false);
    if (scenarioPhase === "recording") {
      setRecordSeconds(REPLICA_MEDIA_SECONDS);
      setVisibleReplicas(replicas);
      setScenarioPhase("processing");
      setProcessingStage(0);
      return;
    }

    simulationStartedAt.current = Date.now();
    setRecordSeconds(0);
    setVisibleReplicas([]);
    setProcessingStage(-1);
    setSigned(false);
    setScenarioPhase("recording");
    setActiveTab("transcript");
  };

  const handleCopyNote = async () => {
    const text = noteDraft
      .map((section) => `${section.title}\n${section.lines.map((line) => `• ${line.text}`).join("\n")}`)
      .join("\n\n");
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // В некоторых preview-средах Clipboard API недоступен — оставляем визуальный fallback.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const localReply = (userText: string) => {
    let reply = "По клиническому протоколу МЗ РК при неэффективности монотерапии эналаприлом 5 мг рекомендуется комбинация с антагонистом кальция (амлодипин 5 мг) или диуретиком (индапамид 1.5 мг).";
    if (userText.toLowerCase().includes("нпвп") || userText.toLowerCase().includes("совместим")) {
      reply = "Внимание: при одновременном приёме иАПФ (эналаприл) и НПВП возможно снижение антигипертензивного эффекта и риск ухудшения функции почек (контроль СКФ).";
    }
    return reply;
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    setChatInputHintSeen(true);

    const userText = chatInput;
    const history = [...chatMessages, { sender: "user", text: userText }] as typeof chatMessages;
    setChatMessages(history);
    setChatInput("");
    setAiTyping(true);

    // Ассистент отвечает через сервер-«мост» (или заготовки, если моста нет)
    try {
      // Адрес ИИ-моста: env на сервере или дефолт (SmarterASP), с фолбэком на локальный /api
      const base =
        process.env.NEXT_PUBLIC_AI_URL ?? "https://qatemirlantemir-001-site1.ftempurl.com";
      const res = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
        signal: AbortSignal.timeout(32_000),
      });
      const data = await res.json();
      const reply = (typeof data?.reply === "string" ? data.reply : "")
        .replace(/^\*\*+\s*$/, "") // пустые markdown-обрезки
        .trim();
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply || localReply(userText) }]);
    } catch {
      // Статический GitHub Pages или мост недоступен — локальный демо-ответ
      await new Promise((r) => setTimeout(r, 700));
      setChatMessages((prev) => [...prev, { sender: "ai", text: localReply(userText) }]);
    } finally {
      setAiTyping(false);
    }
  };

  // Новый приём: анкета «Как вас зовут?» → создание визита → автостарт записи
  const handleStartNewVisit = () => {
    const name = patientName.trim();
    if (!name) return;
    const newVisit: PatientVisit = {
      id: `v-${Date.now()}`,
      name,
      time: "сейчас",
      type: "Первичный приём · Терапевт",
      status: "active",
      gender: "Женский",
      age: 48,
      iinMasked: "••••••******",
    };
    setVisits((prev) => [newVisit, ...prev]);
    setSelectedVisit(newVisit);
    setNewVisitOpen(false);
    setPatientName("");
    handleToggleRecord();
  };

  const handlePushToEhr = () => {
    if (scenarioPhase !== "ready") return;
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
                Dariger<span className="text-accent-dark"> AI</span>
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
              <p className="text-[11px] text-white/50 truncate">Врач-терапевт</p>
            </div>
          </div>
          <div className="mt-2 text-center md:text-left">
            <Link
              href="/"
              className="text-[11px] text-accent-dark hover:underline hidden md:inline-block px-2"
            >
              ← На главную сайта
            </Link>
            <Link
              href="/"
              aria-label="На главную сайта"
              title="На главную сайта"
              className="md:hidden flex items-center justify-center w-10 h-10 mx-auto rounded-xl text-white/70 hover:text-white hover:bg-white/10"
            >
              <Home className="w-5 h-5" />
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
                <span className="text-xs text-muted">{visits.length} приёма</span>
              </div>
              <button
                onClick={() => setNewVisitOpen(true)}
                data-tour="new-visit"
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
              {visits.map((v) => (
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
                    <span className="text-[11px] text-muted">
                      {v.status === "active" ? "Идёт приём" : v.status === "completed" ? "Завершён" : "Ожидает"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Рабочая зона активного визита */}
          <div className="min-w-0 flex-1 flex flex-col overflow-hidden bg-paper">
            {/* Мобильный хедер списка приёмов (на десктопе скрыт — там полноценный сайдбар) */}
            <div className="lg:hidden bg-white border-b border-border px-3 py-2.5 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink">Сегодня · 28 октября</p>
                <p className="text-[11px] text-muted">{visits.length} приёма · выбран текущий</p>
              </div>
              <button
                onClick={() => setNewVisitOpen(true)}
                data-tour="new-visit"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-accent text-white px-3.5 py-2 text-xs font-semibold hover:bg-accent-deep transition-colors"
              >
                <Plus className="w-4 h-4" /> Новый приём
              </button>
            </div>

            {/* Панель визита: шапка с кнопкой Capture */}
            <div className="min-h-18 h-auto bg-white border-b border-border px-3 sm:px-6 py-2.5 sm:py-0 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 sm:justify-between shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <h1 className="font-bold text-base sm:text-lg text-ink break-words">{selectedVisit.name}</h1>
                  <span className="hidden sm:inline text-xs rounded-full bg-accent-pale text-accent px-2.5 py-0.5 font-medium border border-accent/20 shrink-0">
                    Повторный пациент
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-muted mt-0.5 break-words">
                  {selectedVisit.gender}, {selectedVisit.age} лет · ИИН {selectedVisit.iinMasked} · Приём в {selectedVisit.time}
                </p>
              </div>

              {/* Кнопка Capture аудио */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                <div data-tour="timer" className="flex items-center gap-1 sm:gap-2 bg-paper border border-border px-2 sm:px-3 py-1.5 rounded-xl font-mono text-[11px] sm:text-xs whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  <span>{formatTimer(recordSeconds)}</span>
                  <span className="hidden sm:inline text-[11px] text-muted">
                    из {formatTimer(REPLICA_MEDIA_SECONDS)} · ускорение ×{SPEEDUP}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={handleToggleRecord}
                    disabled={scenarioPhase === "processing"}
                    data-tour="record"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm disabled:cursor-wait disabled:opacity-60 ${
                      scenarioPhase === "recording"
                        ? "bg-danger text-white animate-pulse"
                        : "bg-accent text-white hover:bg-accent-deep shadow-accent/20"
                    }`}
                  >
                    {scenarioPhase === "recording" ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" /> Остановить запись
                      </>
                    ) : scenarioPhase === "processing" ? (
                      <>Обрабатываем запись…</>
                    ) : scenarioPhase === "ready" ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> Повторить демо
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> Запись приёма
                      </>
                    )}
                  </button>

                </div>

                <button
                  onClick={handlePushToEhr}
                  disabled={scenarioPhase !== "ready"}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-dark text-white px-4 py-2.5 text-xs font-semibold hover:bg-dark/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plug className="w-3.5 h-3.5" /> Вставить в МИС
                </button>
              </div>
            </div>

            {/* Вкладки: Протокол (SOAP) / Транскрипт kk-ru / Контекст.
                На мобильном подписи короткие — все три влезают; шейд справа подсказывает скролл. */}
            <div className="relative border-b border-border bg-white">
              <div
                ref={tabsScrollRef}
                role="tablist"
                aria-label="Данные приёма"
                className="px-3 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  setTabsScrolled(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
                }}
              >
                <div className="flex gap-3 sm:gap-6 min-w-max">
                  <button
                    onClick={(e) => {
                      setActiveTab("note");
                      e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
                    }}
                    role="tab"
                    aria-selected={activeTab === "note"}
                    data-tour="note-tab"
                    className={`py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "note"
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    <span className="sm:hidden">Протокол</span>
                    <span className="hidden sm:inline">Протокол приёма (SOAP)</span>
                  </button>
                  <button
                    onClick={(e) => {
                      setActiveTab("transcript");
                      e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
                    }}
                    role="tab"
                    aria-selected={activeTab === "transcript"}
                    data-tour="transcript-tab"
                    className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "transcript"
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    <span className="sm:hidden">Транскрипт</span>
                    <span className="hidden sm:inline">Живой транскрипт (kk/ru)</span>
                    <span className="text-[11px] bg-accent-pale text-accent px-1.5 py-0.5 rounded-md">
                      {visibleReplicas.length}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      setActiveTab("context");
                      e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
                    }}
                    role="tab"
                    aria-selected={activeTab === "context"}
                    className={`py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "context"
                        ? "border-accent text-accent"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    <span className="sm:hidden">Анамнез</span>
                    <span className="hidden sm:inline">Анамнез и данные пациента</span>
                  </button>

                  {/* Копирование — рядом со вкладками */}
                  <button
                    onClick={handleCopyNote}
                    data-tour="copy"
                    className="ml-1 sm:ml-4 text-xs text-muted hover:text-ink flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-paper whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">{copied ? "Скопировано!" : "Копировать"}</span>
                  </button>
                </div>
              </div>
              {/* Шейд-индикатор: есть ещё вкладки справа */}
              {tabsScrolled && (
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent" />
              )}
            </div>

            {/* Подсказка внизу: черновик готов — подпишите документ */}
            {scenarioPhase === "ready" && !signed && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 sm:px-6 pt-4"
              >
                <div className="rounded-2xl bg-accent text-white px-4 py-3 flex items-center justify-between gap-3 shadow-md">
                  <p className="text-xs sm:text-sm font-semibold leading-snug">
                    Запись обработана — теперь нужно подписать документ.
                  </p>
                  <button
                    onClick={() => document.querySelector('[data-tour="sign"]')?.scrollIntoView({ block: "center", behavior: "smooth" })}
                    className="shrink-0 rounded-full bg-white text-accent px-4 py-1.5 text-xs font-bold hover:bg-accent-pale transition-colors"
                  >
                    К подписи
                  </button>
                </div>
              </motion.div>
            )}

            {/* Подсказка после подписи: вот ИИ-ассистент */}
            {postSignHint && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 sm:px-6 pt-4"
              >
                <div className="rounded-2xl bg-dark text-white px-4 py-3 flex items-center justify-between gap-3 shadow-md">
                  <p className="text-xs sm:text-sm leading-snug">
                    <Sparkles className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-accent-light" />
                    <span className="font-semibold">Вот у вас здесь есть ИИ-ассистент</span>
                    — вы можете им воспользоваться: спросить о совместимости лекарств или клиническом протоколе.
                  </p>
                  <button
                    onClick={() => setPostSignHint(false)}
                    aria-label="Закрыть подсказку"
                    className="shrink-0 text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

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
                scenarioPhase !== "ready" ? (
                  <div className="max-w-3xl space-y-4">
                    <div className="rounded-2xl border border-accent/20 bg-white p-8 text-center shadow-sm">
                      <div className="mx-auto w-12 h-12 rounded-2xl bg-accent-pale text-accent flex items-center justify-center mb-4">
                        {scenarioPhase === "processing" ? <Sparkles className="w-6 h-6 animate-pulse" /> : <Play className="w-6 h-6" />}
                      </div>
                      <h2 className="font-bold text-lg">
                        {scenarioPhase === "idle" ? "Готовы начать демонстрационный приём?" : scenarioPhase === "recording" ? "Черновик формируется из живой речи" : "Dariger обрабатывает запись"}
                      </h2>
                      <p className="text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
                        {scenarioPhase === "idle"
                          ? "Нажмите «Запись приёма», чтобы увидеть, как смешанная речь врача и пациента превращается в структурированный протокол."
                          : scenarioPhase === "recording"
                          ? "После записи система распознает речь, обезличит данные и подготовит SOAP-протокол по форме №052/у."
                          : "Последовательно проходят распознавание, деидентификация, структурирование и проверка полноты."}
                      </p>
                      {scenarioPhase === "idle" && (
                        <button onClick={handleToggleRecord} className="mt-5 rounded-full bg-accent text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-accent/20 hover:bg-accent-deep">
                          <Play className="w-3.5 h-3.5 inline mr-1.5 fill-current" /> Начать демо-запись
                        </button>
                      )}
                    </div>
                    {scenarioPhase === "processing" && (
                      <div data-tour="pipeline" className="rounded-2xl border border-border bg-white p-5 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Пайплайн обработки</p>
                        {pipeline.map((stage, index) => {
                          const complete = processingStage > index;
                          const current = processingStage === index;
                          return (
                            <div key={stage.label} className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${current ? "border-accent bg-accent-pale" : complete ? "border-success/20 bg-success/5" : "border-border bg-paper/50"}`}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${complete ? "bg-success text-white" : current ? "bg-accent text-white" : "bg-white text-muted border border-border"}`}>
                                {complete ? "✓" : index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-xs font-semibold">{stage.label}</p>
                                <p className="text-[11px] text-muted mt-0.5">{stage.detail}</p>
                              </div>
                              {current && <span className="text-[11px] text-accent font-semibold animate-pulse">Обработка…</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-[11px] text-muted text-center">Синтетический пример. Нет микрофона, сервера или реального обмена с МИС. ИИ-подсказки не заменяют решение врача.</p>
                  </div>
                ) : (
                  <div className="max-w-3xl space-y-4">
                    {/* Тултип автоперехода: запись обработана — смотрите черновик */}
                    {showDraftTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-accent text-white px-4 py-3 text-xs font-semibold flex items-center justify-between shadow-md"
                      >
                        <span>Запись обработана — черновик готов, проверьте его перед подписью.</span>
                        <button onClick={() => setShowDraftTooltip(false)} aria-label="Закрыть" className="text-white/70 hover:text-white shrink-0 ml-2">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                    <div className={`rounded-xl px-4 py-3 text-xs font-semibold flex items-center justify-between ${signed ? "bg-success/10 border border-success/30 text-success" : "bg-success/10 border border-success/25 text-success"}`}>
                      <span>{signed ? "✓ Документы подписаны и отправлены в МИС" : "Черновик готов — врач проверяет и подписывает"}</span>
                      <span className="text-[11px] font-normal">AI Structured</span>
                    </div>
                  {noteDraft.map((sec) => (
                    <div
                      key={sec.id}
                      className="rounded-2xl border border-border bg-white p-5 shadow-2xs hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
                          {sec.title}
                        </h3>
                        <span className="text-[11px] text-muted bg-paper px-2 py-0.5 rounded">
                          AI Structured
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {sec.lines.map((l, i) => (
                          <div key={i} className="flex items-start justify-between gap-3 text-sm">
                            <p className="text-ink leading-relaxed">{l.text}</p>
                            {l.src && (
                              <span className="text-[11px] text-accent/80 font-mono shrink-0 mt-0.5 bg-accent-pale px-1.5 py-0.5 rounded">
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

                  {/* Финал сценария: подписать документы */}
                  <div className="rounded-2xl border border-border bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {signed ? "Приём завершён" : "Готово к подписи"}
                      </p>
                      <p className="text-xs text-muted mt-1 leading-relaxed max-w-sm">
                        {signed
                          ? "Документы подписаны и переданы в МИС. Демо-сценарий завершён — можно повторить его кнопкой «Повторить демо»."
                          : "Проверьте черновик выше и подпишите документы — они будут переданы в МИС."}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSigned(true);
                        setPostSignHint(true);
                        setTimeout(() => setShowSignedCelebration(true), 6500);
                      }}
                      disabled={signed}
                      data-tour="sign"
                      className={`shrink-0 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                        signed
                          ? "bg-success/10 text-success border border-success/30 cursor-default"
                          : "bg-accent text-white hover:bg-accent-deep shadow-md shadow-accent/20"
                      }`}
                    >
                      {signed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Подписано ✓
                        </>
                      ) : (
                        <>
                          <PenLine className="w-4 h-4" /> Подписать документы
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

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
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
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

          {/* Правая панель AI ЧАТ: сворачивается вправо, возвращается «язычком» */}
          {chatOpen ? (
          <motion.div
            data-tour="chat-panel"
            initial={false}
            animate={{ width: 320, opacity: 1 }}
            className="bg-white border-l border-border flex-col shrink-0 hidden xl:flex relative"
          >
            {/* Подсказка над чатом при первом появлении */}
            {!chatHintSeen && (
              <div className="absolute top-16 right-4 left-4 z-10 rounded-xl bg-dark text-white p-3 shadow-lg">
                <p className="text-xs leading-relaxed">
                  <span className="font-bold text-accent-light">Также у вас есть ассистент</span>
                  — вы можете им воспользоваться в любой момент приёма.
                </p>
                <button onClick={() => setChatHintSeen(true)} className="mt-2 text-[11px] font-semibold text-accent-light hover:underline">
                  Понятно
                </button>
              </div>
            )}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-bold text-sm">AI Клинический ассистент</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted bg-paper px-2 py-0.5 rounded">МЗ РК</span>
                <button
                  onClick={() => setChatOpen(false)}
                  aria-label="Свернуть ассистента"
                  title="Свернуть ИИ-ассистента"
                  className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent-pale/50 transition-colors"
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="p-3 border-b border-border bg-paper/50 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase text-muted tracking-wider">
                Быстрые вопросы
              </p>
              <button
                onClick={() => {
                  setChatInput("Проверить совместимость эналаприла и НПВП");
                }}
                className="w-full flex items-center gap-2 text-left text-[11px] p-2 rounded-lg bg-white border border-border hover:border-accent/40 text-muted hover:text-ink transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-warn shrink-0" />
                <span className="line-clamp-1">Совместимость эналаприла и НПВП</span>
              </button>
              <button
                onClick={() => {
                  setChatInput("Клинический протокол МЗ РК по АГ");
                }}
                className="w-full flex items-center gap-2 text-left text-[11px] p-2 rounded-lg bg-white border border-border hover:border-accent/40 text-muted hover:text-ink transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="line-clamp-1">Протокол МЗ РК при гипертензии</span>
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
              {aiTyping && (
                <div className="text-xs rounded-xl p-3 leading-relaxed bg-paper border border-border text-ink mr-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  Ассистент печатает…
                </div>
              )}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-border bg-white flex gap-2">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Здесь вы можете спросить ассистента о чём угодно..."
                  className="w-full rounded-xl bg-paper border border-border px-3 py-2 text-xs focus:outline-accent"
                />
                {!chatInputHintSeen && (
                  <p className="text-[10px] text-muted mt-1 px-1">Задайте вопрос — получите ответ прямо в этом поле.</p>
                )}
              </div>
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 hover:bg-accent-deep transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
          ) : (
            <button
              onClick={() => setChatOpen(true)}
              data-tour="chat-collapsed"
              className="group hidden xl:flex flex-col items-center gap-2.5 py-4 px-2.5 bg-white border-l border-border text-muted hover:text-accent hover:bg-accent-pale/40 transition-colors shrink-0"
              aria-label="Показать ассистента"
              title="Развернуть ИИ-ассистента"
            >
              <PanelRightOpen className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              <span className="text-[10px] font-semibold [writing-mode:vertical-rl] tracking-wide">ИИ-ассистент</span>
              <Sparkles className="w-3.5 h-3.5 opacity-60" />
            </button>
          )}
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
                  Стандартизированные формы РК (№052/у)
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
              {pushSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-success/10 border border-success/30 p-3.5 text-xs text-success font-semibold"
                >
                  ✓ Данные протокола успешно переданы в МИС (DamuMed)! Все поля заполнены.
                </motion.div>
              )}
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
                  <span className="text-xs text-accent-dark font-semibold bg-accent/20 px-3 py-1 rounded-full">
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
                      <span className="text-[11px] bg-success/15 text-success font-semibold px-2 py-0.5 rounded">
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
                        { label: "Жалобы пациента", field: "Жалобы" },
                        { label: "Анамнез заболевания", field: "Анамнез" },
                        { label: "Объективный статус", field: "Объективно" },
                        { label: "Код МКБ-10 (I10)", field: "Диагноз" },
                        { label: "Назначения и рецепты", field: "Назначения" },
                      ].map((item) => (
                        <div key={item.field} className="flex items-center justify-between text-muted">
                          <span>{item.label}</span>
                          <span className="text-success text-[11px] font-semibold">
                            {pushedFields[item.field] ? "✓ Заполнено" : "Готово к переносу"}
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

      {/* Анкета нового приёма: «Как вас зовут?» */}
      {newVisitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 p-4" onClick={() => setNewVisitOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-accent-pale text-accent flex items-center justify-center">
                <UserRound className="w-5.5 h-5.5" />
              </div>
              <button onClick={() => setNewVisitOpen(false)} aria-label="Закрыть" className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h2 className="font-bold text-lg text-ink">Новый приём</h2>
            <p className="text-sm text-muted mt-1.5 leading-relaxed">
              Как вас зовут? Введите имя и фамилию пациента — приём начнётся автоматически.
            </p>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStartNewVisit()}
              placeholder="Например: Айгерим Ибрагимова"
              autoFocus
              className="mt-4 w-full rounded-xl bg-paper border border-border px-4 py-3 text-sm focus:outline-accent"
            />
            {patientName.trim() === "" && (
              <p className="text-[11px] text-muted mt-2 px-1">Введите имя пациента, чтобы начать приём.</p>
            )}
            <button
              onClick={handleStartNewVisit}
              disabled={patientName.trim() === ""}
              className="mt-4 w-full rounded-xl bg-accent text-white py-3 text-sm font-bold hover:bg-accent-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Начать приём
            </button>
          </motion.div>
        </div>
      )}

      {/* Праздник после подписи: документы подписаны + рекомендации */}
      {showSignedCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/70 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-success/15 text-success flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-xl text-ink">Документы подписаны и отправлены в МИС</h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Демо-приём полностью пройден: запись → обработка → протокол → подпись. Вот что можно попробовать дальше:
            </p>
            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => { setShowSignedCelebration(false); setActiveNav("templates"); }}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-paper px-4 py-3 text-left hover:border-accent/40 transition-colors"
              >
                <Layers className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink">Посмотреть шаблоны</p>
                  <p className="text-xs text-muted mt-0.5">Адаптивные шаблоны и формы МЗ РК</p>
                </div>
              </button>
              <button
                onClick={() => { setShowSignedCelebration(false); setActiveNav("integration"); }}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-paper px-4 py-3 text-left hover:border-accent/40 transition-colors"
              >
                <Plug className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink">Интеграция с МИС</p>
                  <p className="text-xs text-muted mt-0.5">Как черновик попадает в DamuMed</p>
                </div>
              </button>
              <button
                onClick={() => { setShowSignedCelebration(false); setChatOpen(true); setChatInputHintSeen(true); }}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-paper px-4 py-3 text-left hover:border-accent/40 transition-colors"
              >
                <Sparkles className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-ink">Спросить ассистента</p>
                  <p className="text-xs text-muted mt-0.5">Вопросы о терапии и протоколах — прямо в чате</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowSignedCelebration(false)}
              className="mt-5 w-full rounded-xl bg-accent text-white py-3 text-sm font-bold hover:bg-accent-deep transition-colors"
            >
              Завершить тур
            </button>
          </motion.div>
        </div>
      )}

      {/* Мобильный ассистент: floating-кнопка + шторка (xl:hidden) */}
      <button
        onClick={() => setChatSheetOpen(true)}
        aria-label="Открыть ИИ-ассистента"
        className="xl:hidden fixed bottom-5 right-4 z-30 w-14 h-14 rounded-full bg-accent text-white shadow-xl shadow-accent/30 flex items-center justify-center active:scale-95 transition-transform"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {chatSheetOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setChatSheetOpen(false)}>
          <div className="absolute inset-0 bg-dark/60" />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-t-3xl h-[75vh] flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-bold text-sm">AI Клинический ассистент</span>
              </div>
              <button onClick={() => setChatSheetOpen(false)} aria-label="Закрыть" className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-paper">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 border-b border-border bg-paper/50 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase text-muted tracking-wider">Быстрые вопросы</p>
              <button
                onClick={() => setChatInput("Проверить совместимость эналаприла и НПВП")}
                className="w-full flex items-center gap-2 text-left text-[11px] p-2 rounded-lg bg-white border border-border hover:border-accent/40 text-muted hover:text-ink transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-warn shrink-0" />
                <span className="line-clamp-1">Совместимость эналаприла и НПВП</span>
              </button>
              <button
                onClick={() => setChatInput("Клинический протокол МЗ РК по АГ")}
                className="w-full flex items-center gap-2 text-left text-[11px] p-2 rounded-lg bg-white border border-border hover:border-accent/40 text-muted hover:text-ink transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="line-clamp-1">Протокол МЗ РК при гипертензии</span>
              </button>
            </div>
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
              {aiTyping && (
                <div className="text-xs rounded-xl p-3 leading-relaxed bg-paper border border-border text-ink mr-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  Ассистент печатает…
                </div>
              )}
            </div>
            <form onSubmit={(e) => { handleSendChat(e); }} className="p-3 border-t border-border bg-white flex gap-2">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Здесь вы можете спросить ассистента о чём угодно..."
                  className="w-full rounded-xl bg-paper border border-border px-3 py-2 text-xs focus:outline-accent"
                />
              </div>
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shrink-0 hover:bg-accent-deep transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Обучающий spotlight-тур */}
      <TourSpotlight
        steps={tourSteps}
        active={tourVisible}
        stepIndex={Math.min(tourStep, tourSteps.length - 1)}
        onStepChange={setTourStep}
        onFinish={() => setTourActive(false)}
        onSkip={() => setTourActive(false)}
      />
    </div>
  );
}
