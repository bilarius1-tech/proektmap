import { DIRECTION_LABELS, DIRECTION_VOICE, spacingFor } from "./defaults";
import { matchPalette } from "./palettes";
import { SCHOOLS, typeScaleFor } from "./schools";
import { renderSkillsDesignMdSection, renderSkillsRoutePrompt } from "./skills-pack";
import type { StyleTokens } from "./types";

export function renderDesignMd(tokens: StyleTokens): string {
  const space = spacingFor(tokens.density);
  const school = SCHOOLS[tokens.direction];
  const scale = typeScaleFor(tokens.direction, tokens.density);
  const palette = matchPalette(tokens);
  const screenType =
    tokens.direction === "product-minimal" ? "product (приложение)" : "brand (маркетинг)";

  return `# DESIGN.md — правила визуала для AI-агента

## Продукт
- Название: ${tokens.productName}
- Для кого: ${tokens.audience}
- Тип экранов: ${screenType}

## Школа
- Эстетика: ${tokens.direction} (${DIRECTION_LABELS[tokens.direction]})
- Тезис: ${DIRECTION_VOICE[tokens.direction]}
${school.composition.map((line) => `- ${line}`).join("\n")}

## Цветовая пара
- Имя: ${palette ? `${palette.name} — ${palette.note}` : "кастом после съёма / ручной правки"}
- bg ${tokens.bg} / text ${tokens.text} / muted ${tokens.muted} / border ${tokens.border} / accent ${tokens.accent}
- Не разбирать пару по одному hex: менять только вместе или через конструктор.

## Токены (источник правды)
- Шрифты: display ${tokens.fontDisplay}, body ${tokens.fontBody}${tokens.fontMono ? `, mono ${tokens.fontMono} (цифры и кикер)` : ""}
- Запрещены: Inter, Roboto, Arial, Space Grotesk
- Шкала типа: kicker ${scale.kicker.size}px / ${scale.kicker.tracking} / ${scale.kicker.transform}; display ${scale.display.size}px / ${scale.display.weight} / lh ${scale.display.line}; body ${scale.body.size}px / lh ${scale.body.line} / measure ${scale.body.measure}
- Отступы: xs ${space.xs}px / s ${space.s}px / m ${space.m}px / l ${space.l}px / xl ${space.xl}px (${tokens.density === "compact" ? "компакт" : "воздух"})
- Радиусы: ${tokens.radius}px
- Сетка: ${tokens.gridColumns} колонок, max-width ${tokens.maxWidth}px, выравнивание ${school.layout.align}, тени ${school.layout.shadows ? "да" : "нет"}, волосяная линия ${school.layout.hairline ? "да" : "нет"}, стекло ${school.layout.blur ? "одно (blur 16px)" : "нет"}
- Кнопки: ${tokens.buttonStyle === "fill" ? "заливка акцентом" : "контур акцентом"}, высота ${tokens.buttonHeight}px
- Файл токенов в коде: tokens.css (скопируйте из конструктора)

## Компоненты
- Использовать существующие: Button, Card, Input
- Не плодить новые атомы без причины
${school.layout.hairline ? "- Карточка swiss/журнал = волосяная рамка, не тень\n" : ""}
## Запреты (anti-slop)
${school.bans.map((ban) => `- ${ban}`).join("\n")}
- Нет серого текста на цветном фоне
- Один визуальный якорь на экран
- Не копировать чужой бренд, логотип и тексты — стилистика и сетка, не клон

${renderSkillsDesignMdSection()}

## Как агенту работать
1. Прочитай этот файл до кода.
2. Не выдумывай hex вне токенов. Цветовая пара — один объект.
3. Подключи Skills из блока выше в указанном порядке.
4. Сначала 5 буллетов школы, потом шаблон.
`;
}

export function renderAgentPrompt(tokens: StyleTokens): string {
  const scale = typeScaleFor(tokens.direction, tokens.density);
  return `${renderSkillsRoutePrompt(tokens)}

Тип: display ${scale.display.size}px/${scale.display.weight}, body ${scale.body.size}px, measure ${scale.body.measure}, плотность ${tokens.density === "compact" ? "компакт" : "воздух"}.
Положи DESIGN.md и tokens.css в корень. Потом код.`;
}

export function renderTokensCss(tokens: StyleTokens): string {
  const space = spacingFor(tokens.density);
  const scale = typeScaleFor(tokens.direction, tokens.density);
  return `:root {
  --color-bg: ${tokens.bg};
  --color-text: ${tokens.text};
  --color-muted: ${tokens.muted};
  --color-border: ${tokens.border};
  --color-accent: ${tokens.accent};
  --font-display: "${tokens.fontDisplay}", ${tokens.direction === "swiss" ? "sans-serif" : "serif"};
  --font-body: "${tokens.fontBody}", sans-serif;${
    tokens.fontMono ? `\n  --font-mono: "${tokens.fontMono}", ui-monospace, monospace;` : ""
  }
  --text-kicker: ${scale.kicker.size}px;
  --text-display: ${scale.display.size}px;
  --text-body: ${scale.body.size}px;
  --leading-display: ${scale.display.line};
  --leading-body: ${scale.body.line};
  --measure: ${scale.body.measure};
  --tracking-kicker: ${scale.kicker.tracking};
  --space-xs: ${space.xs}px;
  --space-s: ${space.s}px;
  --space-m: ${space.m}px;
  --space-l: ${space.l}px;
  --space-xl: ${space.xl}px;
  --layout-columns: ${tokens.gridColumns};
  --layout-max: ${tokens.maxWidth}px;
  --radius: ${tokens.radius}px;
  --button-height: ${tokens.buttonHeight}px;
}
`;
}
