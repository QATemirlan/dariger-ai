// Синтетические демо-данные. Только тестовый сценарий — никаких реальных
// пациентов, ИИН или медицинских данных.

export type Lang = "kk" | "ru" | "mix" | "lat";

export interface Replica {
  id: number;
  speaker: "doctor" | "patient";
  // медиа-время с начала приёма, секунды (сумма ≈ 92 c = 01:32)
  at: number;
  lang: Lang;
  text: string;
  // id фактов, которые попадут в черновик
  factKeys?: string[];
}

export const replicas: Replica[] = [
  { id: 1, speaker: "doctor", at: 0, lang: "mix", text: "Сәлеметсіз бе! Проходите. На что жалуетесь, қалай сезінесіз?" },
  { id: 2, speaker: "patient", at: 8, lang: "mix", text: "Басым айналып жүр уже недели три, особенно по утрам. Иногда подташнивает.", factKeys: ["dizzy", "nausea"] },
  { id: 3, speaker: "doctor", at: 18, lang: "ru", text: "Три недели. Давление дома меряете? Какие цифры?" },
  { id: 4, speaker: "patient", at: 26, lang: "mix", text: "Иә, өлшеймін. Утром до 150 на 95, вечером 138 на 85 шамасында.", factKeys: ["bp_am", "bp_pm"] },
  { id: 5, speaker: "doctor", at: 38, lang: "ru", text: "Эналаприл пять миллиграмм принимаете регулярно?" },
  { id: 6, speaker: "patient", at: 46, lang: "mix", text: "Каждое утро ішемін, но иногда ұмытып қаламын — раза два в неделю пропускаю.", factKeys: ["enalapril", "missed"] },
  { id: 7, speaker: "doctor", at: 58, lang: "ru", text: "Отёков нет? Головные боли бывают?", },
  { id: 8, speaker: "patient", at: 66, lang: "mix", text: "Отёков жоқ. Затылок кейде ауырады и сердце иногда перебои даёт.", factKeys: ["headache", "palp"] },
  { id: 9, speaker: "doctor", at: 78, lang: "ru", text: "Давление сейчас 148 на 92. Скорректируем терапию, назначу ЭКГ и анализы, контроль через три недели.", factKeys: ["bp_now", "plan"] },
];

export const REPLICA_MEDIA_SECONDS = 92; // 01:32
export const SPEEDUP = 5;

// ---------- Пайплайн обработки (расчётные ориентиры, не SLA) ----------
export interface PipelineStage {
  label: string;
  detail: string;
  seconds: number; // расчётный ориентир
}
export const pipeline: PipelineStage[] = [
  { label: "Распознавание речи", detail: "ASR: смешанная kk/ru + латынь, диаризация", seconds: 4.1 },
  { label: "Деидентификация", detail: "Замена ФИО, ИИН, контактов на токены", seconds: 0.3 },
  { label: "Структурирование", detail: "Извлечение фактов и заполнение разделов", seconds: 11.8 },
  { label: "Проверка полноты", detail: "Сверка обязательных полей шаблона", seconds: 0.6 },
];
export const PIPELINE_TOTAL = pipeline.reduce((s, p) => s + p.seconds, 0); // 16.8

// ---------- Черновик (6 разделов) ----------
export interface NoteLine { text: string; src?: number[] }
export interface NoteSection { id: string; title: string; lines: NoteLine[] }

export const noteDraft: NoteSection[] = [
  {
    id: "complaints", title: "Жалобы",
    lines: [
      { text: "Головокружение, преимущественно утром, ~3 недели", src: [2] },
      { text: "Лёгкая тошнота", src: [2] },
      { text: "Головная боль в затылочной области", src: [8] },
      { text: "Ощущение перебоев в сердце", src: [8] },
    ],
  },
  {
    id: "history_disease", title: "Анамнез заболевания",
    lines: [
      { text: "Домашнее АД: утром до 150/95, вечером ~138/85 мм рт. ст.", src: [4] },
      { text: "Принимает эналаприл 5 мг ежедневно утром", src: [6] },
      { text: "Отмечает пропуски приёма ~2 раза в неделю", src: [6] },
    ],
  },
  {
    id: "history_life", title: "Анамнез жизни",
    lines: [
      { text: "Отёков нет", src: [8] },
      { text: "Артериальная гипертензия, наблюдается повторно", src: [3] },
    ],
  },
  {
    id: "objective", title: "Объективный статус",
    lines: [
      { text: "АД в кабинете: 148/92 мм рт. ст.", src: [9] },
      { text: "Осмотр без острых изменений", src: [9] },
    ],
  },
  {
    id: "diagnosis", title: "Диагноз (МКБ-10)",
    lines: [{ text: "I10 — Эссенциальная (первичная) гипертензия; АД выше целевого", src: [9] }],
  },
  {
    id: "plan", title: "Назначения",
    lines: [
      { text: "ЭКГ; ОАК; калий, креатинин, глюкоза", src: [9] },
      { text: "Эналаприл 5 мг + амлодипин 5 мг утром", src: [9] },
      { text: "Дневник АД 2 раза в день; контроль через 3 недели", src: [9] },
    ],
  },
];

// ---------- Демо-предупреждения полноты (не официальный ФЛК) ----------
export const warnings = [
  { id: "w1", text: "Для I10 рекомендуется задокументировать ЧСС и ритм", hint: "уточнить у пациента / измерить" },
  { id: "w2", text: "Нет данных о контроле функции почек (СКФ/креатинин) в динамике", hint: "добавлено в план" },
];

// ---------- Маппинг разделов → поля тестовой МИС ----------
export const misFields = [
  { field: "Пациент", value: "Ибрагимова А.С., 47 л.", from: "Шапка" },
  { field: "Жалобы", value: "Головокружение утром ~3 нед; тошнота; перебои в сердце", from: "Жалобы" },
  { field: "Анамнез", value: "АД дома до 150/95; эналаприл 5 мг, пропуски ~2 р/нед", from: "Анамнез заболевания" },
  { field: "Объективно", value: "АД 148/92 мм рт. ст.", from: "Объективный статус" },
  { field: "Диагноз", value: "I10 — Эссенциальная гипертензия", from: "Диагноз (МКБ-10)" },
  { field: "Назначения", value: "ЭКГ, ОАК, калий/креатинин/глюкоза; амлодипин 5 мг; контроль 3 нед", from: "Назначения" },
];
