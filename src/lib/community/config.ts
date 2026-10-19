/** Публичное имя форума на страницах ProektMap. */
export const COMMUNITY_NAME = "ИИ Форум";
/** «Обсудить на …» */
export const COMMUNITY_NAME_ON = "ИИ Форуме";

/** Тег форума для обсуждения материалов сайта (создан в Flarum). */
export const COMMUNITY_MATERIALS_TAG_URL = "/community/t/materialy-proektmap";

/** Flarum отдаёт nginx по этому пути, это не страница Next.js. */
export const COMMUNITY_PATH = "/community";

/**
 * Пока форум закрыт паролем (staging), ссылки на него на сайте не показываем.
 * Включить при запуске: COMMUNITY_PUBLIC=1 в .env и перезапуск.
 */
export function isCommunityPublic(): boolean {
  return process.env.COMMUNITY_PUBLIC === "1";
}
