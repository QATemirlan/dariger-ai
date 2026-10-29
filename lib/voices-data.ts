// Голоса врачей и исследования о времени на документацию.
// Публикации СМИ и peer-reviewed исследования со ссылками на оригиналы.

export interface VoiceQuote {
  id: string;
  quote: string;
  author: string;
  source: string;
  year: number;
  url: string;
  /** ключевая цифра для карточки */
  stat: string;
  statLabel: string;
  featured?: boolean;
}

export interface StudyLink {
  id: string;
  authors: string;
  year: number;
  journal: string;
  finding: string;
  url: string;
}

export const voices: VoiceQuote[] = [
  {
    id: "informburo",
    quote:
      "Пять минут — на приём, десять — на отчётность. На осмотр пациента остаётся всё меньше времени, а взгляд врача — на экране монитора.",
    author: "Врач государственной поликлиники Алматы",
    source: "Informburo.kz",
    year: 2023,
    url: "https://informburo.kz/stati/pyat-minut-na-priyom-desyat-na-otcyotnost-pocemu-vrachi-cashhe-smotryat-na-ekran-monitora-cem-na-pacienta",
    stat: "10 из 15",
    statLabel: "минут приёма — на отчётность",
    featured: true,
  },
  {
    id: "forbes",
    quote:
      "Врач или оператор ЭВМ? В среднем ещё 8 минут уходит на контакт с компьютером сверх времени осмотра.",
    author: "Опрос медработников Казахстана",
    source: "Forbes Kazakhstan",
    year: 2020,
    url: "https://forbes.kz/articles/vrach_ili_operator_evm_kak_otorvat_medikov_ot_kompyutera",
    stat: "70%+",
    statLabel: "врачей используют 5+ IT-платформ на пациента",
  },
  {
    id: "inbusiness",
    quote:
      "Бумажные формы просто перенесли на экран: «вбивать, вносить в таблицы, графики заполнять». Повторный ввод в разные системы приводит к потере времени.",
    author: "Врач-гематолог, круглый стол inbusiness.kz",
    source: "Inbusiness.kz",
    year: 2021,
    url: "https://inbusiness.kz/ru/news/kazahstanskie-vrachi-zavaleny-otchetami-eksperty",
    stat: "14+",
    statLabel: "систем, куда врачи ПМСП заносят одни и те же данные",
  },
  {
    id: "liter",
    quote:
      "Время, отведённое на осмотр, уходит на заполнение систем и дублирующий ввод данных.",
    author: "Обращение депутата Мажилиса о Damumed",
    source: "Liter.kz",
    year: 2021,
    url: "https://liter.kz/mazhilismeny-raskritikovali-prilozhenie-damumed/",
    stat: "2 раза",
    statLabel: "одни и те же сведения вводятся в разные системы",
  },
];

export const studies: StudyLink[] = [
  {
    id: "young",
    authors: "Young et al.",
    year: 2018,
    journal: "Annals of Family Medicine",
    finding:
      "Прямое наблюдение 982 приёмов: врачи первичного звена тратили на работу с электронной картой больше времени, чем на личный разговор с пациентом.",
    url: "https://doi.org/10.22454/fammed.2018.184803",
  },
  {
    id: "joukes",
    authors: "Joukes et al.",
    year: 2018,
    journal: "JAMIA / PMC",
    finding:
      "439 консультаций до и после внедрения структурированной карты: в одном центре время на уход за пациентом снизилось на 8,5%.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5801881/",
  },
  {
    id: "gaffney",
    authors: "Gaffney et al.",
    year: 2022,
    journal: "JAMA Internal Medicine",
    finding:
      "Национальный опрос врачей США: 1,77 часа документации вне рабочего времени в день; 58,1% не согласны, что время на документацию уместно.",
    url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2790396",
  },
  {
    id: "zhang",
    authors: "Zhang et al.",
    year: 2015,
    journal: "JAMIA",
    finding:
      "Интервью с врачами первичного звена: требования EHR отвлекают от общения; часть врачей сообщала, что более половины приёма уходит на систему.",
    url: "https://doi.org/10.1093/jamia/ocv142",
  },
];
