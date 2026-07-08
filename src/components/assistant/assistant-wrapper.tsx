import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";
import GearAssistant from "./gear-assistant";
import { headers } from "next/headers";

export default async function AssistantWrapper() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isPro = isLoggedIn && ((session.user as any)?.subscription === "pro" || (session.user as any)?.role === "admin");

  // Build context based on current page
  let context = "";
  let hints: string[] = [];

  try {
    const heads = await headers();
    const pathname = heads.get("x-pathname") || "";

    if (pathname.includes("/corporate-website") || pathname.includes("/saas-project") || pathname.includes("/game-dev")) {
      context = "Пользователь на странице Blueprint'а — проходит путь создания проекта.";
      hints = [
        "Здесь ты проходишь путь от идеи до запуска. Каждый этап — это решение с готовым промптом для AI.",
        "В карточках три вкладки: ПОНЯТЬ (проблема), ВЫБРАТЬ (решение), ПРОВЕРИТЬ (промпт).",
        "Нажми на кружок слева чтобы отметить этап как пройденный.",
        "Первые 3 этапа бесплатны. Остальные — с Pro подпиской.",
      ];
    } else if (pathname.includes("/glossary")) {
      context = "Пользователь в глоссарии — изучает термины AI-инженера.";
      hints = [
        "В глоссарии 94 термина на 13 уровнях — от «Prompt» до «прокачать контекст».",
        "Каждый термин объясняется тремя способами: определение, простыми словами, на жаргоне.",
        "Попробуй найти «MCP» или «RAG» — это база.",
      ];
    } else if (pathname.includes("/blog")) {
      context = "Пользователь в блоге — читает статьи об AI-разработке.";
      hints = [
        "Блог автоматически пополняется новостями из мира AI каждый день в 9 утра.",
        "Хочешь написать свою статью? Это могут делать все зарегистрированные пользователи.",
        "Лучшие статьи попадают в топ и повышают рейтинг автора.",
      ];
    } else if (pathname.includes("/specialists")) {
      context = "Пользователь на странице специалистов — смотрит портфолио AI-инженеров.";
      hints = [
        "Здесь собраны вайбкодеры и AI-инженеры с их статьями и рейтингом.",
        "Хочешь попасть в этот список? Заполни публичный профиль в дашборде.",
        "Рейтинг = XP + статьи × 50. Чем больше пишешь — тем выше.",
      ];
    } else if (pathname.includes("/prompts")) {
      context = "Пользователь в библиотеке промптов — ищет готовые шаблоны для AI.";
      hints = [
        "Здесь 15+ готовых промптов для разных задач: код, деплой, дизайн, SEO.",
        "Нажми на промпт чтобы раскрыть и скопировать. Подставь свои данные вместо {{переменных}}.",
        "Не знаешь что такое {{project}}? Наведи на переменную — появится подсказка.",
      ];
    } else if (pathname.includes("/dashboard")) {
      context = "Пользователь в дашборде — управляет профилем и проектами.";
    } else {
      context = "Пользователь на главной странице ProektMap.";
      hints = [
        "ProektMap — это школа AI-инженеров. Здесь ты учишься создавать проекты с помощью AI.",
        "Начни с Blueprint'а «Корпоративный сайт» — 51 решение, 845 XP.",
        "В глоссарии 94 термина — от новичка до профи. Загляни!",
        "Библиотека промптов бесплатна — 15+ готовых шаблонов для AI.",
      ];
    }
  } catch {}

  return <GearAssistant isLoggedIn={isLoggedIn} isPro={isPro} context={context} hints={hints} />;
}
