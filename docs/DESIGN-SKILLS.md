# Design Skills — MVP v0.1

## Идея

Библиотека **визуальных решений** для вайбкодинга. Не код секций — **Design Skill**: описание композиции, иерархии, поведения и ограничений для AI-агента.

## Границы MVP

- Отдельная сущность `DesignSkill` (не путать с обучающим `Skill`)
- Публичный путь: `/design-skills`
- Канонический ID = `slug` (`pm-hero-0001`)
- **8–12 Hero** с разной композицией (не 40 сразу)
- Агент получает Skill по **URL** + Copy Prompt / Copy Skill
- CLI / MCP / payments / marketplace — **не делаем**

## Модель

Фильтры в БД: `slug`, `title`, `category`, `composition`, `designDNA`, `tags`, `preview*`, `isPublished`, `sortOrder`.

Полное описание для агента — одно поле `skillBody` (Markdown).

## Preview

- `previewType`: `live` | `image`
- MVP: живые мини-рендеры (`previewKey` → React-компонент), только собственные композиции
- Скриншоты чужих сайтов запрещены

## Use with AI

Команда: `Use ProektMap Design Skill https://proektmap.ru/design-skills/{slug}`

Машиночитаемый экспорт: `/api/design-skills/{slug}` (Markdown).

## Критерий успеха

Пользователь копирует Skill → агент реализует визуально отличимое решение в своём стеке.
