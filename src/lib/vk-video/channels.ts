export type VkVideoChannel = {
  slug: string;
  /** Положительный id сообщества или 0, если резолвим по screenName */
  communityId?: number;
  screenName?: string;
  title: string;
  shortTitle: string;
  description: string;
  externalUrl: string;
  accent: string;
};

/** Каналы Алексея на VK Video — источник для /video и виджета на главной. */
export const VK_VIDEO_CHANNELS: VkVideoChannel[] = [
  {
    slug: "craftum_design",
    communityId: 219351616,
    screenName: "craftum_design",
    title: "Craftum Design",
    shortTitle: "Craftum",
    description: "Уроки по конструктору, дизайну и вайбкодингу",
    externalUrl: "https://vkvideo.ru/@craftum_design",
    accent: "#4c6ef5",
  },
  {
    slug: "club240887610",
    communityId: 240887610,
    screenName: "club240887610",
    title: "Уроки и практика",
    shortTitle: "Практика",
    description: "Второй канал с уроками и разборами",
    externalUrl: "https://vkvideo.ru/@club240887610",
    accent: "#0fb880",
  },
];

export const VK_VIDEO_TEACHING = {
  bad: "Посмотрел урок про вайбкодинг и закрыл вкладку. Завтра «как-нибудь» повторю.",
  good:
    "Посмотрел урок → открыл /resheniya/premium-landing → прошёл шаги 1–3 с DESIGN.md в Cursor.",
  why: "Видео даёт картинку; маршрут на ProektMap даёт результат, который можно проверить.",
  before: "20 уроков в избранном VK, ни одного опубликованного сайта.",
  after: "Один премиум-шаблон по маршруту + ссылка на урок в README проекта.",
};

export function getChannel(slug: string): VkVideoChannel | undefined {
  return VK_VIDEO_CHANNELS.find((c) => c.slug === slug);
}
