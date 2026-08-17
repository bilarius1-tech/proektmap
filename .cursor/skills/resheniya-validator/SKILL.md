---
name: resheniya-validator
description: >-
  Автоматически валидирует готовые инженерные маршруты ProektMap: обязательные поля,
  один рекомендуемый путь, готовые действия, команды или промпты, наблюдаемый результат
  и внутренние ссылки. Use after editing src/app/resheniya/**, before resheniya-auditor,
  build or publication of a solution route.
trust: community
---

# Resheniya Validator

## Роль

Ты автоматический quality gate между автором и независимым аудитором. Валидатор блокирует структурный отход от зафиксированной модели, но не заменяет смысловой, mobile и live-аудит.

Обязательный порядок:

```text
resheniya-author → resheniya-validator → resheniya-auditor → build → публикация
```

## Перед запуском

Прочитай:

1. `docs/RESHENIYA-V1.md`
2. `docs/PHILOSOPHY.md`
3. `.cursor/skills/resheniya-author/template.md`

## Автоматическая проверка

Из корня проекта выполни:

```bash
npm run validate:resheniya
```

Для нового маршрута передай путь к его data-файлу и имя экспортируемого объекта:

```bash
npx tsx .cursor/skills/resheniya-validator/scripts/validate.ts <data-file> <export-name>
```

Код возврата `0` означает PASS, `1` — FAIL. При FAIL исправь маршрут и повтори проверку. Не ослабляй валидатор ради прохождения конкретного маршрута.

## Что блокируется

- нет измеримого результата или длительности;
- нет шагов либо повторяются slug;
- шаг без goal, recommendation, причины, instructions, success или artifact;
- нет готовой команды и нет готового промпта;
- ссылка ведёт не на внутреннюю страницу;
- в основном тексте обнаружены анкеты, просьбы выбрать стек/архитектуру, написать обоснование или путь к файлу;
- пользователь должен сам спроектировать основной путь.

## Ручная проверка после PASS

PASS скрипта не означает готовность к публикации. Передай маршрут независимому `resheniya-auditor`, который проверит:

- осмысленность и выполнимость каждого действия;
- действительно ли выбран один хороший основной путь;
- качество команд и промптов;
- glossary и контекстную перелинковку;
- блокировку следующих шагов;
- mobile 375px, accessibility, build и live-путь.

## Формат результата

```text
RESHENIYA VALIDATOR: PASS
Route: <slug>
Steps: <count>
```

или:

```text
RESHENIYA VALIDATOR: FAIL
- <точная блокирующая ошибка>
```
