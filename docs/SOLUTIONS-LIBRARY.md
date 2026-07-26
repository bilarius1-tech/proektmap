# Community Solutions — Библиотека решений

## Идея

Каждый запуск AI-Архитектора → сохранение в БД → коллективная база решений. Пользователи не теряют контент, проект получает SEO-страницы, AI учится на лучших решениях.

## Модель данных

Solution (id, title, slug, description, industry, projectType, complexity, authorId, createdAt)
SolutionStage (id, solutionId, title, order, content)
SolutionSkill (id, solutionId, skillSlug, xp)
SolutionPrompt (id, solutionId, title, content)
SolutionEntity (id, solutionId, name, fields)
SolutionVote (id, solutionId, userId, value)
SolutionUsage (id, solutionId, projectId)

## Механика

Пользователь → Архитектор → генерация → «Сохранить как решение» → модерация → публикация → /solutions/slug

## Дедупликация

AI определяет похожесть решений. Если > 85% — предлагает объединить. На сайт попадают только лучшие.

## Голосование

Рейтинг + метрика «Использовали в проектах: X раз». Последнее ценнее лайков.

## AI-обучение

100 пользователей создали CRM → система видит: 82% используют Next.js + Prisma → рекомендует новым.

## SEO

Автоматические страницы: /solutions/crm-dlya-avtoservisa, /solutions/telegram-mini-app. Тысячи индексируемых страниц.

## Фазы разработки

### Фаза 1 (1-2 дня)
- Модель Solution в БД
- Сохранение из Архитектора
- Страница /solutions/[slug]

### Фаза 2 (2-3 дня)
- Голосование + рейтинг
- Поиск по решениям
- Дедупликация

### Фаза 3 (3-5 дней)
- AI-обучение на лучших
- Персональные рекомендации
- «Похожие решения»

## Статус: запланировано
