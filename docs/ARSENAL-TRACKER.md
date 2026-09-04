# Нейро каталог — трекер статусов

> Display name: **Нейро каталог**. Legacy code/URL: `arsenal`.

Легенда: ✅ сделано · 🟡 в работе · ⬜ запланировано  

Источник: Excel 304 инструмента · план: [ARSENAL-PLAN.md](./ARSENAL-PLAN.md)

---

## Этапы

| | Этап | Содержание | Кол-во | Статус |
|---|---:|---|---:|---|
| ✅ | 0 | План, IA, V1-стеки, DEVLOG | 0 | **сделано** (2026-09-04) |
| ✅ | 1 | MVP `/arsenal` + 12 арсеналов + ~100 тулов | 102 | **сделано** (2026-09-04) |
| ✅ | 2 | Голос и Аудио (добор) | 27 (+12 = 39) | **сделано** (2026-09-04) |
| ✅ | 3 | Локальный AI (добор) | 24 (+14 = 38) | **сделано** (2026-09-04) |
| ✅ | 4 | Кодинг (добор) | 21 (+14 = 35) | **сделано** (2026-09-04) |
| ✅ | 5 | Агенты и скиллы (добор) | 17 (+20 = 37) | **сделано** (2026-09-04) |
| ✅ | 6 | Изображения (добор) | 18 (+12 = 30) | **сделано** (2026-09-04) |
| ✅ | 7 | Видео + Маркетинг | 20 (+8 = 28 уник.) | **сделано** (2026-09-04) |
| ✅ | 8 | Поиск + Промпты + LLM | +17 (из 39 Excel) | **сделано** (2026-09-04) |
| ✅ | 9 | Обучение + Docs + FinTech + Разное | +47 (из 54 Excel) | **сделано** (2026-09-04) |
| ✅ | 10 | Дедуп + QA + перелинковка с /resheniya | 292 тула | **сделано** (2026-09-04) |

**Покрытие:** этапы 1–9 → **293**, этап 10: −1 near-dup Nano Banana → **292** инструментов; Excel **304** строк / **298** уникальных; намеренно исключено **5** (см. [ARSENAL-EXCLUSIONS.md](./ARSENAL-EXCLUSIONS.md)).  
**Этап 1 факт:** **12** стеков, **102** тула. **Этап 2:** 🎙️ **39**/39. **Этап 3:** 🖥️ **38**/38. **Этап 4:** 💻 **35**/35 уникальных (Excel 37 строк, 2 дубля уже были). **Этап 5:** 🧩 **37**/37 уникальных (Excel 37 строк, 0 внутрикатег. дублей; Agent Reach — кросс-категорийный дубль, уже был). **Этап 6:** 🎨 **30**/30 уникальных (Excel 31 строка, 1 дубль Real-ESRGAN). **Этап 7:** 🎬 **20**/20 уникальных (Excel 21/−1 дубль HyperFrames) + 📈 **8**/8 (Excel 8 строк); добор **+13** video + **+7** marketing = **+20**.  
**Этап 8:** Excel 🔍 **13**/13 уник. + 💬 Промпты **12** строк + 💬 LLM **14**/14 = **39** строк. Уже были: research 7 + Agent Reach (agents, `wasDuplicate`) + prompts 8 + llm 5. Добор **+5** research + **+3** prompts + **+9** llm = **+17**. Итого в категориях: 🔍 **12** карточек (+ Agent Reach), 💬 Промпты **11**/12 (1 jailbreak отфильтрован по плану §7.5), 💬 LLM **14**/14. Каталог **246**.  
**Этап 9:** Excel 🧠 **15** строк / **14** уник. (−1 дубль AI Engineering) + 📊 **9** + ₿ **6** + 📁 **24** = **54** строк / **53** уник. Уже были: Easy-Vibe, Zero to Claude Code. Добор **+12** learning + **+9** docs + **+6** fintech + **+20** misc = **+47**. Отфильтровано 4 из «Разное» (OSINT-пробив, пиратские каталоги, маскировка UI). Итого: 🧠 **14**/14, 📊 **9**/9, ₿ **6**/6, 📁 **20**/24. Каталог **293**. Hero: 12 / 293 / 14 / 293.  
**Этап 10:** подтверждены 6 Excel-дублей (`wasDuplicate`) + слит near-dup `awesome-nano-banana-pro` → **292**; QA URL (`scripts/qa-arsenal-urls.ts`); мосты `/arsenal` ↔ `/resheniya` + skill `arsenal-resheniya-bridge`.

---

## Документы этапа 0

- [x] `docs/ARSENAL-PLAN.md`
- [x] `docs/ARSENAL-STRUCTURE.md`
- [x] `docs/ARSENAL-V1-STACKS.md`
- [x] `docs/ARSENAL-TRACKER.md`
- [x] Запись в `docs/DEVLOG.md` (2026-09-04)

## Код этапа 1

- [x] `src/app/arsenal/page.tsx` + клиент хаба
- [x] `src/app/arsenal/[slug]/page.tsx`
- [x] `src/app/arsenal/tools/[slug]/page.tsx`
- [x] `src/lib/arsenal/*` данные (types, tools, stacks, index)
- [x] SITE_TREE + sitemap + metadata
- [x] Пункт меню через `scripts/sync-header-menu.ts` (`header-arsenal`)
- [x] `npm run validate:sitemap`
- [x] Билд + проверка HTTP 200

## Код этапа 2 + ребрендинг

- [x] Добор 🎙️ Голос и Аудио: +27 → **39/39**, всего **129** тулов в `tools.ts`
- [x] Display name **Нейро каталог** (UI, meta, SITE_TREE, menu label, guide-data, ARSENAL-*.md)
- [x] URL `/arsenal` без смены пути
- [x] `npm run validate:sitemap` + билд + smoke

## Код этапа 3

- [x] Добор 🖥️ Локальный AI и Модели: +24 → **38/38**, всего **153** тулов в `tools.ts`
- [x] Трекер + DEVLOG; билд + smoke (коммит не делали)

## Код этапа 4

- [x] Добор 💻 Кодинг и Разработка: +21 → **35**/35 уникальных (Excel 37/−2 дубля), всего **174** тула в `tools.ts`
- [x] Трекер + DEVLOG; билд + smoke (коммит не делали)

## Код этапа 5

- [x] Добор 🧩 AI-агенты и Скиллы: +17 → **37**/37 уникальных (Excel 37 строк, 0 внутрикатег. дублей), всего **191** тул в `tools.ts`
- [x] Трекер + DEVLOG; билд + smoke (коммит не делали)

## Код этапа 6 + hero-статы

- [x] Добор 🎨 Изображения и Графика: +18 → **30**/30 уникальных (Excel 31/−1 дубль Real-ESRGAN), всего **209** тулов в `tools.ts`
- [x] Hero mini-dashboard: живые счётчики из `getArsenalHubStats()` (арсеналы / инструменты / категории / со ссылкой)
- [x] Трекер + DEVLOG; билд + smoke (коммит не делали)

## Код этапа 7

- [x] Добор 🎬 Видео и Анимация: +13 → **20**/20 уникальных (Excel 21/−1 дубль HyperFrames)
- [x] Добор 📈 Маркетинг, SEO и SMM: +7 → **8**/8 (Excel 8 строк)
- [x] Всего в каталоге **229** тулов; hero-статы из данных (12 / 229 / 11 / 229)
- [x] Трекер + DEVLOG; билд + smoke (коммит не делали)

## Код этапа 8

- [x] Добор 🔍 Поиск и Исследования: +5 → **13**/13 уникальных (Excel 13; Agent Reach уже в agents)
- [x] Добор 💬 Промпты: +3 → **11**/12 (Excel 12; «The Gay Jailbreak Technique» отфильтрован — план §7.5)
- [x] Добор 💬 LLM: +9 → **14**/14 (Excel 14; Qwen/Meta AI — отдельные карточки от voice/images)
- [x] Всего в каталоге **246** тулов; hero-статы из данных (12 / 246 / 11 / 246)
- [x] Трекер + DEVLOG; билд + smoke (коммит не делали)

## Код этапа 9

- [x] Добор 🧠 Обучение и Гайды: +12 → **14**/14 уникальных (Excel 15/−1 дубль AI Engineering; Easy-Vibe и Zero to Claude Code уже были)
- [x] Добор 📊 Презентации и Документы: +9 → **9**/9
- [x] Добор ₿ FinTech и Крипта: +6 → **6**/6 (нейтральные описания)
- [x] Добор 📁 Разное: +20 → **20**/24 (отфильтрованы AWESOME OSINT ARSENAL, HuggingBay, BookHunter, GPTDisguise)
- [x] В `ARSENAL_CATEGORIES` добавлены docs / fintech / misc
- [x] Всего в каталоге **293** тула; hero-статы из данных (12 / 293 / 14 / 293)
- [x] Трекер + DEVLOG; билд + smoke (коммит не делали)

## Код этапа 10

- [x] Дедуп: 6 Excel-дублей подтверждены (`wasDuplicate`); near-dup Nano Banana слит → **292** тула
- [x] Исключения задокументированы: `docs/ARSENAL-EXCLUSIONS.md` (jailbreak + 4 misc)
- [x] QA URL: `scripts/qa-arsenal-urls.ts`; фиксы QClaw, MetaMask, Hermes Skills, Krea
- [x] Перелинковка: `NeuroCatalogCallout`, `ArsenalBridgePanel`, `RESHENIYA_ARSENAL_BRIDGES`, усилены `relatedRoutes`
- [x] Skill: `.cursor/skills/arsenal-resheniya-bridge/SKILL.md` + правки author/auditor
- [x] Билд + PM2 + smoke (коммит не делали)

---

## V1-стеки

| | slug | Название |
|---|---|---|
| ✅ docs+код | `local-ai-pc` | Локальный AI на ПК |
| ✅ docs+код | `local-ai-mobile` | Локальный AI на телефоне |
| ✅ docs+код | `vibe-coder` | Агент-кодер |
| ✅ docs+код | `mcp-agents` | Агенты и скиллы |
| ✅ docs+код | `voice-pipeline` | Голосовой конвейер |
| ✅ docs+код | `listing-photo` | Картинки для объявлений |
| ✅ docs+код | `ethical-research` | Этичный ресёрч |
| ✅ docs+код | `rf-stack` | РФ-дружелюбный стек |
| ✅ docs+код | `seller-content` | Контент продавца |
| ✅ docs+код | `short-video` | Короткие видео |
| ✅ docs+код | `prompt-ops` | Промпт-операции |
| ✅ docs+код | `desktop-agent` | Агент на рабочем столе |
