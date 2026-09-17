import { getDb } from "@/lib/db";
import { KIND_LABELS, type TemplateDossier, type TemplateInput } from "./types";

function slugify(name: string): string {
  const ru: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "i",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  const latin = name
    .toLowerCase()
    .split("")
    .map((ch) => ru[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return latin || "site";
}

async function deepseekKey(): Promise<{ key: string; model: string }> {
  try {
    const db = await getDb();
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    const row = settings as { deepseekApiKey?: string; deepseekModel?: string } | null;
    const key = row?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
    const model = row?.deepseekModel || "deepseek-chat";
    return { key, model };
  } catch {
    return { key: process.env.DEEPSEEK_API_KEY || "", model: "deepseek-chat" };
  }
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asText(value: unknown, fallback: string): string {
  const text = String(value || "").trim();
  return text || fallback;
}

function tokensCss(input: TemplateInput): string {
  const s = input.style;
  const bg = s?.bg || "#FAFAFA";
  const text = s?.text || "#202020";
  const muted = s?.muted || "#666666";
  const accent = s?.accent || "#303030";
  const border = s?.border || "#DEDEDE";
  const display = s?.fontDisplay || "Manrope";
  const body = s?.fontBody || display;
  const radius = s?.radius ?? 12;
  const maxWidth = s?.maxWidth ?? 1120;
  const buttonHeight = s?.buttonHeight ?? 48;
  return `/* Значения проекта. Не возвращайтесь к нейтральному шаблону. */
:root {
  --color-bg: ${bg};
  --color-surface: #ffffff;
  --color-text: ${text};
  --color-muted: ${muted};
  --color-accent: ${accent};
  --color-accent-text: #ffffff;
  --color-line: ${border};

  --font-heading: "${display}", system-ui, sans-serif;
  --font-body: "${body}", system-ui, sans-serif;

  --text-base: 18px;
  --text-small: 16px;
  --text-h1: clamp(34px, 6vw, 64px);
  --text-h2: clamp(26px, 3.5vw, 40px);

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 40px;
  --space-5: 64px;
  --space-6: 104px;
  --container: ${maxWidth}px;
  --radius: ${Math.min(24, Math.max(0, radius))}px;
  --control-height: ${buttonHeight}px;
  --control-height-small: 44px;
}
`;
}

function fallbackDossier(input: TemplateInput): TemplateDossier {
  const productName = input.productName.trim() || "Сайт";
  const slug = slugify(productName);
  const styleNote = input.style
    ? `Снято с ${input.style.sourceUrl || "референса"}: фон ${input.style.bg}, текст ${input.style.text}, акцент ${input.style.accent}, шрифт ${input.style.fontDisplay}. Не клонировать бренд.`
    : "Направление задайте по референсам владельца. Neutral tokens.css заменить.";

  const briefMd = `# Бриф сайта

Статус: заполнен сервисом ProektMap. Агент не переспрашивает закрытые поля.

## Задача
- Чем занимается проект: ${input.offer || input.idea || "—"}
- Для кого: ${input.audience || "—"}
- Что посетитель должен сделать: ${input.action || "—"}
- Куда приходит заявка: ${input.leadTo || "форма на сайте, отправка настраивается отдельно"}

## Содержание
- Предложение: ${input.offer || "—"}
- Подтверждённые факты и доказательства: только из материалов владельца. Не выдумывать отзывы, цены, лицензии.
- Вопросы клиентов: зафиксировать после разговора. ${input.idea}

## Материалы
- Что уже есть, где лежит: положить в materials/
- Чего не хватает: фото продукта, логотип, реальные доказательства
- Какие иллюстрации нужны: один главный кадр hero, затем серия

## Ориентиры и направление
- Ссылки и комментарии владельца: ${input.refs || "не указаны"}
- Что берём из вида: ${styleNote}
- Что берём из движения: только если это помогает понять продукт
- Выбранные шрифт, палитра, композиция: см. DESIGN.md и shared/tokens.css

## Ограничения
- Срок, язык, домен: ${input.constraints || "русский язык, РФ"}
- Что нельзя показывать или утверждать: чужой бренд, выдуманные факты, медицинские/юридические гарантии без документов

## Следующий шаг
Собрать index.html по BRIEF.md и DESIGN.md. Пример examples/densio не копировать по содержанию.
`;

  const designMd = `# Визуальное направление

Статус: задано сервисом. Пример Денсио — не палитра и не обязательная анимация этого проекта.

## Первый экран и история
Посетитель сразу понимает, что это ${productName} для ${input.audience || "целевой аудитории"}. Главный визуал — предмет или рабочий кадр, не сетка одинаковых карточек. Текст и действие в одном контейнере. CTA: ${input.action || "заявка"}.

## Типографика и цвет
Гарнитуры: ${input.style?.fontDisplay || "один гротеск с кириллицей"} / ${input.style?.fontBody || "тот же для текста"}. Запрещены Inter, Roboto, Arial как единственный голос. Палитра в shared/tokens.css. ${styleNote}

## Сетка и масштаб
Контейнер ${input.style?.maxWidth || 1120}px. Поля ритма из tokens.css. На телефоне заголовок не ломает действие.

## Изображения
План — materials/ASSETS.md. Декоративная иллюстрация не выдаётся за реальный объект.

## Движение
По умолчанию без sticky-спектакля. Движение только если объясняет продукт. reduced-motion учитывается.

## Компоненты и страницы
Тип: ${KIND_LABELS[input.kind]}. Повторяются шапка, подвал, кнопка, поле. Секции главной не клонировать одним шаблоном карточек.

## Критерии приёмки
- index.html открывается двойным кликом
- CTA ведёт на форму; отправка — заглушка, честно подписанная
- Токены из tokens.css, не нейтральный шаблон
- Нет текстов и фото из examples/densio
`;

  const pages =
    input.kind === "multipage"
      ? `| Главная | index.html | Собрать |
| Услуги | uslugi.html | После главной |
| Контакты | contacts.html | После главной |`
      : `| Главная | index.html | Собрать |`;

  return {
    productName,
    slug,
    kind: input.kind,
    briefMd,
    designMd,
    sitemapMd: `# Карта сайта\n\n| Страница | Файл | Статус |\n|---|---|---|\n${pages}\n`,
    referencesMd: `# Референсы\n\nСтатус: ${input.refs ? "ссылки владельца зафиксированы" : "ещё не выбраны"}.\n\n| Ссылка | Что нравится владельцу | Что реально просмотрено | Конкретный приём | Как адаптируем | Что не переносим |\n|---|---|---|---|---|---|\n${
      input.refs
        ? input.refs
            .split(/\s+/)
            .filter((u) => /^https?:\/\//.test(u))
            .map((u) => `| ${u} | уточнить у владельца | сервис не открывал живой браузер | композиция / тип / поля | перенести приём, не бренд | логотип, тексты, фото |`)
            .join("\n") || "| — | | | | | |"
        : "| — | | | | | |"
    }\n\n## Принятое направление\n${styleNote}\n`,
    handoffMd: `# Продолжение работы

Состояние: бриф и направление заполнены сервисом ProektMap. index.html ещё не создан.

Следующее действие в Cursor: прочитать AGENTS.md, BRIEF.md и DESIGN.md. Сказать: «Собери главную по брифу и DESIGN.md. Пример densio не копировать».

Источник правды: BRIEF.md, DESIGN.md, shared/tokens.css, materials/.
`,
    tokensCss: tokensCss(input),
    cursorPrompt: `Открой эту папку как проект в Cursor. Прочитай AGENTS.md, BRIEF.md и DESIGN.md. Направление уже выбрано, токены в shared/tokens.css.

Собери главную: index.html по брифу и DESIGN.md. Используй shared/header.js, footer.js, site.js, base.css. Страница должна открываться двойным кликом.

Не копируй тексты, палитру и механику examples/densio. Не выдумывай факты, цены и отзывы. Если материала нет — перечисли пробел, не заполняй декорацией.

После сборки открой index.html, проверь компьютер и телефон, обнови REVIEW.md и HANDOFF.md.`,
    warnings: ["DeepSeek не ответил — бриф собран из ваших полей. В Cursor можно уточнить направление."],
  };
}

export async function generateTemplateDossier(input: TemplateInput): Promise<TemplateDossier> {
  const fallback = fallbackDossier(input);
  const { key, model } = await deepseekKey();
  if (!key) return fallback;

  const sys = `Ты собираешь рабочий пакет сайта (HTML-среда), не урок.
Ответ — только JSON без markdown-ограждения:
{
  "productName":"...",
  "slug":"latin-kebab",
  "briefMd":"# Бриф сайта\\n...",
  "designMd":"# Визуальное направление\\n...",
  "sitemapMd":"# Карта сайта\\n...",
  "referencesMd":"# Референсы\\n...",
  "handoffMd":"# Продолжение работы\\n...",
  "cursorPrompt":"..."
}
Правила:
- Русский, конкретика этого проекта. Пустые шаблоны не оставляй.
- Не копируй пример Денсио (медицина, x-ray, sticky-спектакль) в содержание.
- Не выдумывай факты, отзывы, цены, лицензии.
- Если есть style — палитра и шрифт оттуда, bg/text/accent как есть. Запрет клона бренда.
- briefMd держит структуру: Задача, Содержание, Материалы, Ориентиры, Ограничения, Следующий шаг.
- designMd: первый экран, тип, цвет, сетка, изображения, движение, компоненты, приёмка.
- sitemapMd — таблица страница / файл / статус.
- cursorPrompt — короткий заказ агенту Cursor: прочитай AGENTS.md + BRIEF + DESIGN, собери index.html.
- slug — латиница kebab, без пробелов.`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: JSON.stringify({ input, kindLabel: KIND_LABELS[input.kind] }) },
        ],
        max_tokens: 2200,
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) {
      console.error("[site-template] DeepSeek HTTP", res.status);
      return fallback;
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = parseJsonObject(json.choices?.[0]?.message?.content || "");
    if (!parsed) return fallback;

    const productName = asText(parsed.productName, fallback.productName);
    return {
      productName,
      slug: slugify(asText(parsed.slug, slugify(productName))),
      kind: input.kind,
      briefMd: asText(parsed.briefMd, fallback.briefMd),
      designMd: asText(parsed.designMd, fallback.designMd),
      sitemapMd: asText(parsed.sitemapMd, fallback.sitemapMd),
      referencesMd: asText(parsed.referencesMd, fallback.referencesMd),
      handoffMd: asText(parsed.handoffMd, fallback.handoffMd),
      tokensCss: tokensCss(input),
      cursorPrompt: asText(parsed.cursorPrompt, fallback.cursorPrompt),
      warnings: [],
    };
  } catch (error) {
    console.error("[site-template]", error instanceof Error ? error.message : error);
    return fallback;
  }
}
