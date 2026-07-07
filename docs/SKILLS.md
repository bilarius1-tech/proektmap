# Skills-система ProektMap

## Философия

Как WordPress состоит из плагинов, так ProektMap состоит из **Skills** — переиспользуемых модулей.

```
WordPress          ProektMap
  Плагины    →     Skills (навыки)
  Темы       →     Blueprints (шаблоны проектов)
  Виджеты    →     Components (будущее)
```

## Модель

```prisma
model Skill {
  title         // название
  slug          // уникальный идентификатор
  skillMd       // SKILL.md — основной контент в Markdown
  assetsPath    // путь к assets/ (из vibe-coding-cn)
  scriptsPath   // путь к scripts/
  refsPath      // путь к references/
  difficulty    // easy | medium | hard
  xpReward      // очки опыта
  timeEstimate  // примерное время
  promptTemplate // шаблон промпта
}
```

## Жизненный цикл Skill

```
Создание → Публикация → Использование в Blueprint'ах → Аналитика → Улучшение
    │           │              │                          │
    └─ Админка  └─ isPublished └─ DecisionSkill связь     └─ Статистика использования
```

## Как добавить новый Skill

1. `/admin/skills` → Добавить
2. Заполнить SKILL.md (контент в Markdown)
3. Указать XP, сложность, время
4. Опубликовать
5. Привязать к Decision'ам через DecisionSkill

## Источники

- **vibe-coding-cn (22k ⭐):** структура SKILL.md + assets/ + scripts/ + references/
- **WordPress:** философия плагинов и компонентов
