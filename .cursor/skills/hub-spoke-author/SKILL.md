---
name: hub-spoke-author
description: >-
  Сажает новую публичную ветку ProektMap в одну из 4 станций хаба и связывает
  её с существующим разделом: SITE_TREE, спица меню, хаб-страница, мост к
  /resheniya. Use when creating a new public page, section, hub, track, catalog
  item, or «ответвление»; when the user asks куда положить раздел, как связать
  с хабом, пункт шапки, или не плодить корень меню.
trust: community
---

# Hub Spoke Author

## Роль

Ты архитектор роста хаба. Новая сущность — **спица существующей станции**, не новый этаж сайта.

Trust: `community` до аудита. Не ставь себе `verified`.

Главная маршрутизирует. Шапка группирует. `/sitemap` инвентаризует. Поиск ловит хвост.

## Когда запускать

- Новый `src/app/**/page.tsx` вне admin/auth/dashboard
- Новый хаб, трек, каталог, утилита, гайд, капсула, слой
- «Куда положить», «как связать с хабом», «добавить в меню»

После выбора станции отдай предметный skill: маршрут → `resheniya-author`, UI → `ui-pattern-author`, стек → `arsenal-resheniya-bridge`, обзор в блог → `product-review-author`, озвучка → `voice-guide-author`.

## Обязательное чтение

1. `.cursor/rules/menu.mdc`
2. `src/app/sitemap/site-map-data.ts` — куда в дереве
3. `scripts/sync-header-menu.ts` — id станций
4. Примеры: [examples.md](examples.md)

Перед поиском по коду: `graphify query "<новая сущность> SITE_TREE menu station"`.

## 1. Выбери одну станцию

Задай вслух: «я спица какой станции?» Ответ — **один**.

| Станция | Корень меню | Хаб | Кладём сюда |
|---|---|---|---|
| Решения | `header-resheniya` | `/resheniya` | готовый маршрут от цели до проверки |
| Собрать | `header-station-build` | `/ui-patterns` | паттерн, секция, капсула, песочница, архитектор |
| Инструменты | `header-station-tools` | `/arsenal` | стек, утилита, Авито-сервис, шпаргалка, РФ-стек |
| Научиться | `header-station-learn` | `/agent-engineering` | гайд, урок, skill, статья, глоссарий, видео |

Карта (`header-sitemap` → `/sitemap`) — не родитель для контента.

Если неясно:

1. Это продукт с финишем (URL, бот, оплата)? → Решения, дальше `resheniya-author`.
2. Это строительный блок экрана/проекта? → Собрать.
3. Это инструмент на задачу? → Инструменты.
4. Это понимание «как устроено»? → Научиться.
5. Это слой страницы (озвучка, плохо/хорошо, SEO)? → **не раздел**. Поле существующей страницы.

Не создавать параллельный каталог к уже существующему: `/ai-tools`↔`/arsenal`, `/prompts`↔`/shpargalka`, `/solutions`↔`/resheniya`, `/skills`↔`/ai-skills`.

## 2. Свяжи с хабом

Спица обязана быть доступна **из родителя**, не только по прямому URL.

```text
Станция (шапка)
  → хаб-страница
    → новая сущность
      → при пользе для маршрута: ссылка из /resheniya/[slug]
```

Минимум связей:

1. Карточка или пункт на хабе станции (каталог `/resheniya`, `/arsenal`, `/ui-patterns`, `/services`, `/agent-engineering`…).
2. `SITE_TREE` — в группу станции, не новый `SiteTreeGroup`.
3. Меню — ребёнок станции в `scripts/sync-header-menu.ts`, затем `npx tsx --env-file=.env scripts/sync-header-menu.ts`.
4. Если помогает живому маршруту — одна ссылка из шага `/resheniya`, не баннер «смотрите ещё».

Группы `SITE_TREE`: `start` ≈ Решения, `design` ≈ Собрать, `tools`/`russia` ≈ Инструменты, `knowledge` ≈ Научиться. `legacy` / `service` / `account` — не для новых продуктов.

## 3. Чеклист перед «готово»

```text
Hub Spoke Progress:
- [ ] 1. Одна станция и один хаб-URL
- [ ] 2. Нет нового корня шапки (parentId: null)
- [ ] 3. Нет нового showcase-блока на главной
- [ ] 4. Запись в SITE_TREE
- [ ] 5. Спица в sync-header-menu.ts (если пункт достоин мега-меню)
- [ ] 6. Ссылка с хаб-страницы родителя
- [ ] 7. metadata + canonical; динамика — в sitemap.ts
- [ ] 8. Плохо→хорошо или before→after в данных
- [ ] 9. npm run validate:sitemap
- [ ] 10. Предметный skill (resheniya / ui-pattern / arsenal / voice)
```

Пункт 5 не для каждой мелкой карточки: новый UI-паттерн живёт внутри `/ui-patterns`, не отдельной ссылкой шапки. В меню — только хаб или крупная коллекция.

## Запрещено

- Новый корень шапки без явного решения Алексея
- Витрина на `/` как способ «запустить раздел»
- Пункт меню для слоя (voice guide, примеры, SEO)
- Второй каталог рядом с Арсеналом / шпаргалкой / `/resheniya`
- Ссылка только в `/sitemap` без входа с хаба
- Legacy `/blueprints` как активный родитель

## После кода

`npm run validate:sitemap`. Если менялся UI — проверка в браузере. Деплой: `rm -rf .next && npx next build && pm2 restart proektmap`.
