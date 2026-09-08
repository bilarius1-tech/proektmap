# Project Vault — техническое задание и промпт агента

> **Статус:** канон для агента-археолога и импорта капсул  
> **Раздел сайта:** `/project-vault` (не `/ai-workshop`, не паспорт `/resheniya`)  
> **Пилот:** Реверанс → капсула на https://proektmap.ru/project-vault  
> **Язык ТЗ:** русский · **ключи JSON / slug / пути:** английский  
> **Связанные каноны:** `docs/PHILOSOPHY.md`, `docs/AGENT-ENGINEERING.md`, `docs/CASES-PLAN.md`, `docs/VIBECODER-PORTFOLIO.md`, `docs/PROJECT-VAULT.md`

---

## 1. Purpose / философия Project Vault

**Project Vault** — инженерные капсулы реальных продуктов: не портфолио «красивых кейсов» и не готовый маршрут «собери с нуля», а **переносимый ДНК проекта** + **снимок артефактов без секретов**.

Обещание:

> Следующий похожий проект стартует не с нуля, а с правильных промптов, rules, skills, Harness/Loop/Graph, DoD и паттернов деплоя — уже извлечённых из живого продукта.

Два слоя:

| Слой | Что | Зачем |
|------|-----|--------|
| **Project DNA** | Философия, стек, Cursor rules, AGENTS.md, skills, Harness/Loop/Graph, DoD, паттерны deploy/SEO/admin, промпты, решения | Перенос на новый проект |
| **Project Snapshot** | Архив кода, схема БД, миграции, nginx/pm2/deploy (без секретов), `.env.example`, SECRETS.md (только имена), URL/VPS metadata, changelog, скриншоты | Воспроизводимость и аудит |

**#1 outcome:** переносимость AI-инженерии (окружение агента), а не «красивая витрина».

Отличия (жёстко):

| Раздел | Что это | Что НЕ делает Vault |
|--------|---------|---------------------|
| `/ai-workshop` | Behance-портфолио работ сообщества | Vault ≠ галерея кейсов и XP |
| `/resheniya` | Готовый маршрут «веди к результату» | Vault ≠ passport решения; это капсула уже собранного |
| `/agent-engineering` | Обучение Harness/Loop/Graph | Vault **ссылается** и показывает, как это жило в проде |
| BuildPattern / `/patterns` | «Ты можешь сделать» (шаблон) | Vault — «вот как сделали + DNA для копирования» |
| `/project-vault` | Инженерные капсулы DNA + Snapshot | Капсулы, манифест, Client Boundary |

---

## 2. Glossary

| Термин | Определение |
|--------|-------------|
| **Project DNA** | Переносимый слой: закон проекта, skills, rules, harness/loop/graph, DoD, паттерны, промпты, решения. Версионируется (`dnaVersion`, `derivedFrom`). |
| **Project Snapshot** | Конкретный снимок: код, схема, инфра-конфиги без секретов, метаданные URL/VPS, changelog, скрины. |
| **Capsule** | Публичная единица Vault: DNA + Snapshot + `manifest.json`, карточка на `/project-vault` и страница `/project-vault/[slug]`. |
| **Client Boundary** | Граница клиента: контент клиента, PII, реальные секреты, production customer DB — **OFF по умолчанию**. В пакет не попадают. |
| **Package (Project Package)** | Архив капсулы по стандартному дереву (см. §7) + `manifest.json`. Без секретов, пригоден к git/хранилище ProektMap. |
| **Manifest** | Машиночитаемое ядро капсулы: id, stack, ai.harness/loop/graph, артефакты, reusable skills/patterns. |
| **Arsenal candidate** | Кандидат в `/arsenal` (паттерн/инструмент) — только пометка; **без авто-публикации**. |
| **Instance block** | Заполненные плейсхолдеры одного проекта внутри универсального промпта. Для нового проекта меняется только он. |
| **PASS** | Один из 7 обязательных проходов агента (recon → … → audit). |

---

## 3. TEMPLATE: Agent Mission Prompt

Скопируй блок целиком в новый чат. Замени `{{…}}` или вставь готовый **INSTANCE** (§4). Не переписывай PASS’ы под конкретный бренд.

> **Две разные миссии**  
> - **Археология** (этот §3): готовый продукт → Package → капсула в Vault.  
> - **Bootstrap нового проекта из DNA** (§3.1 ниже / `ai/BOOTSTRAP-FROM-DNA.md`): капсула → каркас агента в проекте #2.

```text
# MISSION: Project Vault — engineering archaeology → Package → ProektMap import

You are the Project Vault archaeology agent for ProektMap.

## Canon (read first, do not reinvent)
- Full TZ: /var/www/www-root/data/www/proektmap.ru/docs/PROJECT-VAULT-TZ.md
- Philosophy stub: …/docs/PROJECT-VAULT.md
- Align with: PHILOSOPHY.md, AGENT-ENGINEERING.md, CASES-PLAN.md (patterns ≠ cases),
  VIBECODER-PORTFOLIO.md (Vault ≠ /ai-workshop)
- File-first pattern like agent-engineering: TS modules + pages + docs canon
- Destination site: https://proektmap.ru · app root:
  /var/www/www-root/data/www/proektmap.ru
- Public section: /project-vault (engineering capsules, NOT Behance)

## Instance (ONLY this block is project-specific)
- PROJECT_SLUG: {{PROJECT_SLUG}}
- PROJECT_NAME: {{PROJECT_NAME}}
- PROJECT_TAGLINE: {{PROJECT_TAGLINE}}
- SOURCE_URL: {{SOURCE_URL}}
- SOURCE_PATHS: {{SOURCE_PATHS}}
- SSH_HOST: {{SSH_HOST}}
- SSH_USER: {{SSH_USER}}
- PROD_APP_PATH: {{PROD_APP_PATH}}
- WORKSPACE_PATH: {{WORKSPACE_PATH}}
- PM2_PROCESS: {{PM2_PROCESS}}
- DB_NAME_HINT: {{DB_NAME_HINT}}   # name only; never dump PII
- PACKAGE_OUTPUT_DIR: {{PACKAGE_OUTPUT_DIR}}
- PROEKTMAP_CAPSULE_SLUG: {{PROEKTMAP_CAPSULE_SLUG}}  # usually = PROJECT_SLUG
- DNA_VERSION: {{DNA_VERSION}}     # e.g. 1.0.0
- DERIVED_FROM: {{DERIVED_FROM}}   # null for first capsule, else prior dnaVersion/slug

## Goal
1) Recon source product (read-only until packaging)
2) Extract Project DNA (AI engineering transferability = #1 outcome)
3) Build Project Snapshot (no secrets, Client Boundary ON)
4) Assemble Project Package (archive layout + manifest.json)
5) Import into ProektMap /project-vault as capsule {{PROEKTMAP_CAPSULE_SLUG}}
6) Audit: could the NEXT agent start a similar project from this capsule alone?

## Operating rules (non-negotiable)
- Read-only on source until PASS 5 packaging; no destructive VPS / UFW / ISPmanager changes
- Never commit or print secrets (.env values, private keys, tokens, customer PII)
- Prefer schema-only DB export; no production customer rows
- SSL: metadata only — no private keys in package
- Arsenal: candidates only, no auto-publish
- Do not confuse Vault with /ai-workshop or /resheniya passport
- Language of docs for humans: Russian; code/JSON keys: English
- No commits unless the human asks; follow ProektMap deploy rules only in PASS 6 when implementing UI/import

## Execute PASS 1 → 7 exactly as in PROJECT-VAULT-TZ.md §6
Stop and report blockers with evidence; do not skip Client Boundary checks.

## Definition of Done (this instance)
- Package exists at {{PACKAGE_OUTPUT_DIR}} with valid manifest.json
- Capsule live (or ready module+routes) at https://proektmap.ru/project-vault/{{PROEKTMAP_CAPSULE_SLUG}}
- Audit checklist PASS 7 green for “start project #2 from DNA”
```

### 3.1 Промпт: создать новый проект из DNA

Не археология. Скопируй в чат, когда нужно **поднять проект #2** по уже существующей капсуле.  
UI: блок «Скопировать промпт» на `/project-vault/[slug]` (после soft-gate). Файлы капсулы: `ai/BOOTSTRAP-FROM-DNA.md`, `ai/COPY-FIRST.md`. Правило: `.cursor/rules/project-vault-bootstrap.mdc`.

```text
# MISSION: Создать новый проект из Project Vault DNA

Ты агент, который поднимает НОВЫЙ проект по ДНК капсулы (не археология готового продукта в Vault).

## Канон
- COPY-FIRST: /var/www/www-root/data/www/proektmap.ru/content/project-vault/{{CAPSULE_SLUG}}/ai/COPY-FIRST.md
- BOOTSTRAP: …/ai/BOOTSTRAP-FROM-DNA.md
- Полный TZ (археология другого продукта): docs/PROJECT-VAULT-TZ.md §3 TEMPLATE
- Live: https://proektmap.ru/project-vault/{{CAPSULE_SLUG}}

## Источник DNA
- CAPSULE_SLUG: {{CAPSULE_SLUG}}
- Корень: /var/www/www-root/data/www/proektmap.ru/content/project-vault/{{CAPSULE_SLUG}}
- Прочитай: AGENTS, START_HERE, .cursor/rules, harness/loop/graph, philosophy, deploy, decisions

## Новый проект
- NEW_PROJECT_NAME: {{NEW_PROJECT_NAME}}
- NEW_PROJECT_SLUG: {{NEW_PROJECT_SLUG}}
- NEW_PROJECT_URL: {{NEW_PROJECT_URL}}
- NEW_WORKSPACE_PATH: {{NEW_WORKSPACE_PATH}}
- NEW_PROD_APP_PATH: {{NEW_PROD_APP_PATH}}
- NEW_PM2_PROCESS: {{NEW_PM2_PROCESS}}

## Сделай
1. Прочитай DNA капсулы
2. Воссоздай AGENTS.md + .cursor/rules + harness skeleton + Dev Graph DoD под NEW_*
3. Следуй COPY-FIRST; не копируй клиентский контент / секреты / PII / customer DB
4. Упаковка другого готового продукта в Vault — отдельная миссия (TEMPLATE §3)

## DoD
- Каркас агента в новом workspace готов к day-0; брендинг новый; Client Boundary OK
```

---

## 4. INSTANCE: Reverans (пилот)

Подставь в TEMPLATE или передай агенту как готовый блок:

```text
## Instance — Reverans (pilot)
- PROJECT_SLUG: reverans
- PROJECT_NAME: Реверанс (СКХГ «Реверанс»)
- PROJECT_TAGLINE: Платформа студии художественной гимнастики: лендинг, ЛК родителя, админка, договоры, ТБанк
- SOURCE_URL: https://reverans.online
- SOURCE_PATHS:
  - workspace/git: /root/projects/reverans
  - production: /var/www/reverans (web app: /var/www/reverans/web)
- SSH_HOST: 159.194.228.226 (alias often: reverans)
- SSH_USER: deploy
- PROD_APP_PATH: /var/www/reverans/web
- WORKSPACE_PATH: /root/projects/reverans
- PM2_PROCESS: reverans
- DB_NAME_HINT: reverans_db
- PACKAGE_OUTPUT_DIR: /var/www/www-root/data/www/proektmap.ru/content/project-vault/reverans
  (или staging: /tmp/project-vault/reverans — затем копировать в content/)
- PROEKTMAP_CAPSULE_SLUG: reverans
- DNA_VERSION: 1.0.0
- DERIVED_FROM: null

## Host notes (Reverans + ProektMap)
- Archaeology often runs WHERE the source lives (reverans host or workspace with SSH to it).
- ProektMap import/UI runs on nordic VPS:
  /var/www/www-root/data/www/proektmap.ru · https://proektmap.ru
- Brief for agents in Reverans workspace:
  /root/projects/reverans/docs/PROJECT_VAULT_ARCHAEOLOGY_TZ.md
- Full canon always: this file (PROJECT-VAULT-TZ.md)

## Reverans DNA hotspots (harvest first)
- START_HERE.md, AGENTS.md, docs/PHILOSOPHY.md, docs/DEVELOPMENT.md, docs/DEVLOG.md, docs/AGENT_HANDOFF.md
- .cursor/rules/* (00-start-here, development, harness, day-close, dev-graph, product)
- harness/ (check-service.sh, config.env — strip secrets), Loop docs if any
- Dev Graph: .cursor/rules/dev-graph.mdc (+ canvas if present)
- tz/outputs/* (product TZ — include as product docs, redact client secrets)
- web/: Next.js App Router, Prisma schema, nginx/pm2 deploy pattern (VPS not Vercel)
```

---

## 5. Operating rules (детали)

### 5.1 Read-only → packaging

| Фаза | Разрешено | Запрещено |
|------|-----------|-----------|
| PASS 1–4 | Read, list, grep, schema introspect, non-destructive health | Write в prod app, rm, drop DB, firewall, «починить» чужой прод без запроса |
| PASS 5 | Писать только в `PACKAGE_OUTPUT_DIR` / staging package | Писать секреты в пакет; коммитить `.env` |
| PASS 6 | Писать модули/страницы ProektMap `/project-vault` | Ломать `/ai-workshop`, выдумывать Behance UX |
| PASS 7 | Читать капсулу глазами «агента проекта #2» | Считать пилот закрытым без usability-аудита |

### 5.2 Секреты и Client Boundary

**Никогда в Package / git / манифест / чат:**

- Значения `DATABASE_URL`, `NEXTAUTH_SECRET`, `TBANK_*`, `YANDEX_*`, API keys, private SSL keys  
- Дамп строк с ФИО детей/родителей, телефонами, email клиентов, платёжными данными  
- Реальные пароли админов  

**Разрешено:**

- `.env.example` с пустыми/`CHANGE_ME` значениями  
- `SECRETS.md` — **только имена** переменных и где их взять (без значений)  
- `database-backup.sql` — **schema-only** (или анонимизированный fixture, явно помеченный)  
- Nginx/pm2 конфиги с вырезанными secrets / basic auth passwords  
- Скриншоты UI без PII (замазать ФИО на превью админки)  

### 5.3 Инфра-безопасность

- Не менять UFW / ISPmanager / SSL private keys  
- Не `prisma migrate reset` / force-reset на production  
- Не публиковать package с `node_modules`, `.next`, полными `.git` objects если не нужно — предпочтительно `source-code.tar.gz` из чистого дерева (без secrets, с `.gitignore` уважением)

### 5.4 Arsenal

В `manifest.json` → `arsenalCandidates[]` — slug/title/reason.  
**Не** вызывать скрипты публикации в `/arsenal`. Человек решает позже.

---

## 6. PASS 1–7 — чеклисты (project-agnostic)

Каждый PASS: вход → действия → артефакты → DoD PASS.  
Отчёт агента: `PASS N: PASS|FAIL|BLOCKED` + кратко evidence.

### PASS 1 — Recon

**Цель:** карта источника без правок.

- [ ] Подтвердить доступ к `SOURCE_URL` (HTTP health / главная)  
- [ ] Найти `WORKSPACE_PATH` и/или `PROD_APP_PATH`  
- [ ] Прочитать START_HERE / README / AGENTS.md / PHILOSOPHY (что есть)  
- [ ] Зафиксировать роли продукта, стек, способ деплоя (VPS/PM2/Docker/…)  
- [ ] Найти harness/loop/graph артефакты (или явно «отсутствует»)  
- [ ] Найти где секреты (`.env` path) — **не читать значения в отчёт**  
- [ ] Список кандидатов на DNA harvest (paths)  

**Артефакт:** `docs/recon-notes.md` внутри staging package (или черновик в PACKAGE_OUTPUT_DIR).  
**DoD:** есть карта путей + риски Client Boundary.

### PASS 2 — Architecture

**Цель:** понять систему достаточно для ARCHITECTURE.md и манифеста.

- [ ] Слои: public / auth / cabinets / admin / APIs / webhooks  
- [ ] Данные: ORM/schema, ключевые сущности (без PII-примеров)  
- [ ] Инфра: reverse proxy, process manager, DB, cron/loop  
- [ ] Внешние интеграции (платежи, OAuth) — имена провайдеров, не ключи  
- [ ] Граф дней/фич (Dev Graph) если есть  

**Артефакт:** черновик `docs/ARCHITECTURE.md`, `docs/TECH-STACK.md`, `docs/PROJECT-MAP.md`.  
**DoD:** новый агент понимает «что это за система» за 10 минут чтения.

### PASS 3 — DNA extract

**Цель:** собрать переносимый AI-engineering слой. См. полный чеклист §8.

- [ ] Скопировать/нормализовать в `ai/`: AGENTS.md, `.cursor/`, skills/, prompts/, decisions/  
- [ ] PHILOSOPHY + DEVELOPMENT/day-close + handoff patterns → `docs/`  
- [ ] Harness/Loop/Graph: описать «как устроено» + ссылки на файлы в snapshot  
- [ ] DoD / Dev Graph / definition of done по фазам  
- [ ] Deploy / SEO / admin patterns (обезличенные)  
- [ ] `dnaVersion`, `derivedFrom`  
- [ ] `arsenalCandidates` (если есть сильные паттерны)  

**Артефакт:** дерево `ai/` + DNA-разделы в docs + секция `dna` в manifest.  
**DoD:** по DNA можно собрать harness нового проекта того же класса.

### PASS 4 — Backup (безопасный)

**Цель:** snapshot артефактов без секретов.

- [ ] Schema: `schema.prisma` или SQL DDL; migrations/  
- [ ] Schema-only dump → `database/database-backup.sql` (предпочтительно)  
- [ ] Nginx site config(s) → `infrastructure/nginx/` (redact)  
- [ ] PM2 ecosystem / process notes → `infrastructure/pm2/`  
- [ ] Deploy scripts/docs → `infrastructure/deploy/`  
- [ ] SSL: `infrastructure/ssl/README.md` (issuer, domains, renew method) — **без private key**  
- [ ] `.env.example` + `SECRETS.md` (names only)  
- [ ] Changelog / DEVLOG summary (без секретов)  
- [ ] Screenshots (опционально, без PII) → `docs/screenshots/` или `snapshot/screenshots/`  

**DoD:** backup воспроизводит структуру; grep по package не находит типичные secret patterns (см. PASS 5).

### PASS 5 — Package

**Цель:** собрать стандартный архив + valid manifest.

- [ ] Дерево §7 создано  
- [ ] `source/source-code.tar.gz` (exclude secrets, node_modules, .next, .env)  
- [ ] `manifest.json` валиден против схемы §7.2  
- [ ] Secret scan: нет private keys, `sk-`, `Bearer `, connection strings с паролями  
- [ ] Client Boundary checklist подписан в `docs/CLIENT-BOUNDARY.md`  
- [ ] Package лежит в `PACKAGE_OUTPUT_DIR`  

**DoD:** один каталог капсулы + manifest; готов к импорту.

### PASS 6 — Import ProektMap

**Цель:** капсула в `/project-vault`. Спека UI/данных — §9.

- [ ] Добавить TS-модуль капсулы (file-first, как agent-engineering)  
- [ ] Хаб `/project-vault` + деталь `/project-vault/[slug]`  
- [ ] Зарегистрировать в `SITE_TREE` + меню (sync-header если принят в проекте)  
- [ ] Ссылки на `/agent-engineering`, `/ai-skills`, `/arsenal`, decisions  
- [ ] Скопировать/подключить package content (или ссылки на `content/project-vault/...`)  
- [ ] SEO title/description для хаба и капсулы  
- [ ] Build + smoke: `/project-vault`, `/project-vault/{{slug}}` → 200  
- [ ] **Не** публиковать в ai-workshop  

**DoD пилота:** капсула Reverans открывается на proektmap.ru.

### PASS 7 — Audit usability (next project)

**Цель:** проверить переносимость.

Агент (или субагент) **без** доступа к исходному репо, только с капсулой, отвечает:

- [ ] Как поднять harness за день 0?  
- [ ] Какие rules/skills скопировать первыми?  
- [ ] Как устроены Loop и Graph?  
- [ ] Какой deploy pattern на VPS?  
- [ ] Какие секреты завести (имена)?  
- [ ] Чего не хватает для проекта #2 того же класса?  

**Артефакт:** `docs/AUDIT-NEXT-PROJECT.md` внутри капсулы + краткий отчёт в ProektMap docs при необходимости.  
**DoD:** список gaps ≤ разумного; критичные gaps закрыты или задокументированы как Phase 2.

---

## 7. Archive directory standard + manifest

### 7.1 Дерево Package

```text
Project Archive / PACKAGE_OUTPUT_DIR/
├── source/
│   └── source-code.tar.gz
├── database/
│   ├── schema.prisma          # or schema.sql
│   ├── migrations/            # if any
│   └── database-backup.sql    # schema-only preferred
├── infrastructure/
│   ├── nginx/
│   ├── pm2/
│   ├── deploy/
│   └── ssl/                   # metadata only (README), no private keys
├── ai/
│   ├── AGENTS.md
│   ├── .cursor/               # rules, (optional) plans — no secrets
│   ├── skills/
│   ├── prompts/
│   └── decisions/
├── docs/
│   ├── PHILOSOPHY.md
│   ├── ARCHITECTURE.md
│   ├── TECH-STACK.md
│   ├── PROJECT-MAP.md
│   ├── DEPLOYMENT.md
│   ├── CLIENT-BOUNDARY.md
│   ├── SECRETS.md             # names only
│   ├── .env.example
│   ├── AUDIT-NEXT-PROJECT.md  # after PASS 7
│   └── screenshots/           # optional
└── manifest.json
```

Допустимы доп. файлы (`CHANGELOG.md`, `recon-notes.md`), но **не** нарушать Client Boundary.

### 7.2 manifest.json — пример + контракт

```json
{
  "manifestVersion": "1.0",
  "id": "reverans",
  "slug": "reverans",
  "name": "Реверанс",
  "tagline": "Платформа студии художественной гимнастики",
  "sourceUrl": "https://reverans.online",
  "createdAt": "2026-09-08",
  "dnaVersion": "1.0.0",
  "derivedFrom": null,
  "clientBoundary": {
    "piiExcluded": true,
    "secretsExcluded": true,
    "customerDataExcluded": true,
    "notes": "Schema-only DB; no parent/child rows"
  },
  "stack": {
    "framework": "Next.js App Router",
    "language": "TypeScript",
    "ui": "Tailwind CSS",
    "orm": "Prisma",
    "db": "PostgreSQL",
    "auth": "NextAuth (Yandex + email)",
    "payments": "TBank acquiring",
    "hosting": "VPS + Nginx + PM2"
  },
  "ai": {
    "harness": true,
    "loop": true,
    "graph": true,
    "agentsMd": true,
    "cursorRules": true,
    "skills": [],
    "prompts": [],
    "decisions": []
  },
  "artifacts": {
    "sourceArchive": "source/source-code.tar.gz",
    "schema": "database/schema.prisma",
    "migrations": "database/migrations/",
    "dbBackup": "database/database-backup.sql",
    "nginx": "infrastructure/nginx/",
    "pm2": "infrastructure/pm2/",
    "deploy": "infrastructure/deploy/",
    "docs": "docs/",
    "ai": "ai/"
  },
  "reusable": {
    "patterns": [
      "vps-pm2-nginx-next",
      "day-close-devlog",
      "harness-healthcheck",
      "dev-graph-dod"
    ],
    "skills": [],
    "rules": [
      "00-start-here",
      "harness",
      "day-close",
      "dev-graph",
      "development"
    ]
  },
  "arsenalCandidates": [],
  "urls": {
    "production": "https://reverans.online",
    "vault": "https://proektmap.ru/project-vault/reverans"
  },
  "hosts": {
    "sshHost": "159.194.228.226",
    "appPath": "/var/www/reverans/web",
    "workspacePath": "/root/projects/reverans",
    "pm2": "reverans"
  },
  "links": {
    "agentEngineering": "/agent-engineering",
    "aiSkills": "/ai-skills",
    "arsenal": "/arsenal",
    "resheniya": "/resheniya"
  }
}
```

**Минимально обязательные поля:** `manifestVersion`, `id`, `slug`, `name`, `dnaVersion`, `clientBoundary`, `stack`, `ai`, `artifacts`, `reusable`.

JSON Schema (черновик для валидатора агента):

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://proektmap.ru/schemas/project-vault-manifest-1.0.json",
  "type": "object",
  "required": [
    "manifestVersion", "id", "slug", "name", "dnaVersion",
    "clientBoundary", "stack", "ai", "artifacts", "reusable"
  ],
  "properties": {
    "manifestVersion": { "const": "1.0" },
    "id": { "type": "string", "minLength": 1 },
    "slug": { "type": "string", "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    "name": { "type": "string" },
    "tagline": { "type": "string" },
    "sourceUrl": { "type": "string" },
    "createdAt": { "type": "string" },
    "dnaVersion": { "type": "string" },
    "derivedFrom": { "type": ["string", "null"] },
    "clientBoundary": {
      "type": "object",
      "required": ["piiExcluded", "secretsExcluded", "customerDataExcluded"],
      "properties": {
        "piiExcluded": { "type": "boolean" },
        "secretsExcluded": { "type": "boolean" },
        "customerDataExcluded": { "type": "boolean" },
        "notes": { "type": "string" }
      }
    },
    "stack": { "type": "object" },
    "ai": {
      "type": "object",
      "properties": {
        "harness": { "type": "boolean" },
        "loop": { "type": "boolean" },
        "graph": { "type": "boolean" },
        "agentsMd": { "type": "boolean" },
        "cursorRules": { "type": "boolean" },
        "skills": { "type": "array" },
        "prompts": { "type": "array" },
        "decisions": { "type": "array" }
      }
    },
    "artifacts": { "type": "object" },
    "reusable": { "type": "object" },
    "arsenalCandidates": { "type": "array" },
    "urls": { "type": "object" },
    "hosts": { "type": "object" },
    "links": { "type": "object" }
  },
  "additionalProperties": true
}
```

### 7.3 Версионирование DNA

- `dnaVersion` — semver капсулы DNA (не обязательно = version продукта).  
- `derivedFrom` — `null` для первого снимка; иначе `"{{slug}}@{{dnaVersion}}"` предка.  
- При повторной археологии того же продукта: bump `dnaVersion`, обновить Snapshot, сохранить историю решений в `ai/decisions/`.

---

## 8. DNA extraction checklist (start next project faster)

Собирать **всё**, что ускоряет день 0–1 нового похожего проекта:

### 8.1 Закон и навигация агента

- [ ] `AGENTS.md` / `START_HERE.md`  
- [ ] `docs/PHILOSOPHY.md` — границы продукта  
- [ ] `docs/DEVELOPMENT.md` / day-close  
- [ ] `docs/AGENT_HANDOFF.md` (обезличить доступы: шаблон хостов, без паролей)  
- [ ] Приоритет/DEVLOG pattern (как вести «Сейчас»)  

### 8.2 Cursor / skills / prompts

- [ ] `.cursor/rules/**` (все always-on и task rules)  
- [ ] Project skills (если есть) → `ai/skills/`  
- [ ] Повторяемые промпты (QA клиента, day close, harness tick) → `ai/prompts/`  
- [ ] Decisions / ADR → `ai/decisions/`  

### 8.3 Harness / Loop / Graph

- [ ] Harness scripts + что должно быть green  
- [ ] Loop: интервал, что проверяет, куда репортит  
- [ ] Graph: узлы фич, DoD по дням/фазам, canvas если есть  
- [ ] Связь с `/agent-engineering` vocabulary (Harness/Loop/Graph)  

### 8.4 Продуктовые и инженерные паттерны

- [ ] Deploy: build → process restart → health  
- [ ] SEO: sitemap / SITE_TREE pattern (если применимо к источнику)  
- [ ] Admin / roles pattern  
- [ ] Auth providers (имена)  
- [ ] Payments webhook pattern (без ключей)  
- [ ] Design tokens / UI kit pointers (если есть)  

### 8.5 Мета для манифеста

- [ ] `reusable.patterns[]`, `reusable.rules[]`, `reusable.skills[]`  
- [ ] `arsenalCandidates[]`  
- [ ] Явный список «скопируй первым делом в проект #2»  

---

## 9. ProektMap import spec — `/project-vault`

### 9.1 Принцип реализации

Как **agent-engineering** (file-first), не как AiProject portfolio:

| Слой | Путь (рекомендация) |
|------|---------------------|
| Canon docs | `docs/PROJECT-VAULT.md`, `docs/PROJECT-VAULT-TZ.md` |
| Package storage | `content/project-vault/{{slug}}/` (дерево §7) |
| Data modules | `src/lib/project-vault/` — `types.ts`, `capsules.ts` (или `capsules/*.ts`) |
| Hub page | `src/app/project-vault/page.tsx` |
| Detail | `src/app/project-vault/[slug]/page.tsx` |
| Components | `src/components/project-vault/*` |
| SITE_TREE | группа «Начать» или сосед с agent-engineering / ai-skills |
| Menu | sync-header по принятому скрипту ProektMap |

**Не** использовать модель `/ai-workshop` (XP, респекты, форма `/projects/new`) для v1.

### 9.2 TS module shape (капсула)

```ts
// src/lib/project-vault/types.ts (контракт)

export type VaultCapsuleStatus = "draft" | "published";

export type VaultCapsuleCard = {
  slug: string;
  name: string;
  tagline: string;
  sourceUrl: string;
  dnaVersion: string;
  stackLabels: string[];      // short chips for card
  aiFlags: {
    harness: boolean;
    loop: boolean;
    graph: boolean;
  };
  status: VaultCapsuleStatus;
  accent?: string;
  seoTitle: string;
  seoDescription: string;
};

export type VaultDnaSection = {
  id: string;                 // philosophy | harness | rules | ...
  title: string;
  summary: string;
  paths: string[];            // relative to package
};

export type VaultCapsule = VaultCapsuleCard & {
  derivedFrom: string | null;
  longSummary: string[];      // 3–7 bullets
  dnaSections: VaultDnaSection[];
  snapshotHighlights: string[];
  reusablePatterns: string[];
  arsenalCandidates: { title: string; reason: string }[];
  packageRoot: string;        // e.g. content/project-vault/reverans
  manifestPath: string;
  links: {
    agentEngineering: string;
    aiSkills: string;
    arsenal: string;
    decisions?: string;
  };
};
```

Реестр: `export const CAPSULES: VaultCapsule[]` + `TRACK` meta для хаба (по аналогии с `TRACK` / `MODULES` в agent-engineering).

### 9.3 UI — карточка хаба

Поля карточки:

- Name, tagline  
- Stack chips  
- AI flags: Harness / Loop / Graph (иконки или бейджи)  
- `dnaVersion`  
- CTA → `/project-vault/[slug]`  
- Опционально: source URL (external)  

Тон: инженерный, спокойный; **не** Behance-галерея.

### 9.4 UI — страница капсулы (секции ≈ DNA tree)

1. Hero: name, tagline, source URL, dnaVersion / derivedFrom  
2. **Зачем эта капсула** (перенос AI-инженерии)  
3. **DNA** — секции с путями к файлам в package / якорям  
4. **Snapshot** — что в архиве (schema, infra, source tarball) + Client Boundary badge  
5. **Reusable** — patterns / rules / skills списком  
6. **Arsenal candidates** (если есть) — явно «не опубликовано автоматически»  
7. **Связи:** `/agent-engineering`, `/ai-skills`, `/arsenal`, decisions  
8. **Phase 2 teaser:** «Создать из этого» (disabled / coming) — см. §12  
9. Downloads / paths для агента (manifest, package root) — для людей-инженеров  

### 9.5 Регистрация в карте сайта

В `SITE_TREE` (пример формулировок):

```ts
{
  title: "Project Vault",
  href: "/project-vault",
  description: "Инженерные капсулы: DNA + Snapshot без секретов",
  children: [
    { title: "Реверанс", href: "/project-vault/reverans" },
    // дальше — новые капсулы
  ],
}
```

Рекомендуемое место: группа **«Начать»** рядом с «Инженерия агентов» и «AI Engineering Skills».

### 9.6 Связь с другими столпами

- Callout на `/agent-engineering`: «как это объясняется в треке»  
- Не подменять `/resheniya` — максимум «похожий класс задач» без обещания маршрута  
- Не дублировать `/ai-workshop` карточками «работы автора»  

---

## 10. DoD — пилот (Reverans)

- [ ] Package Reverans собран по §7, Client Boundary green  
- [ ] `manifest.json` валиден, secret scan clean  
- [ ] `/project-vault` хаб live на https://proektmap.ru/project-vault  
- [ ] `/project-vault/reverans` показывает DNA + Snapshot секции  
- [ ] Запись в SITE_TREE + меню  
- [ ] PASS 7 audit записан  
- [ ] Канон-доки: этот ТЗ + `docs/PROJECT-VAULT.md`  
- [ ] Brief в Reverans: `/root/projects/reverans/docs/PROJECT_VAULT_ARCHAEOLOGY_TZ.md`  

---

## 11. DoD — reusable template (проект #2)

Шаблон готов, если:

- [ ] Агент получает **только** заполненный INSTANCE block (§3 + новые `{{…}}`)  
- [ ] Не нужно переписывать PASS 1–7 под бренд  
- [ ] Новый slug появляется как новая капсула тем же file-first путём  
- [ ] DNA прошлого проекта читается как стартовый harness (или gaps явные в AUDIT)  

**Как завести проект #2 (кратко):**

1. Скопировать TEMPLATE §3.  
2. Заполнить INSTANCE (slug, URL, paths, SSH, package dir, dnaVersion).  
3. Запустить агента с каноном `PROJECT-VAULT-TZ.md`.  
4. PASS 1–7 → новая папка `content/project-vault/{{slug}}` + запись в `CAPSULES`.  
5. Smoke URL + audit.

---

## 12. Phase 2 — «Create from this» (описать, не делать в v1)

UI на странице капсулы: чекбоксы копирования в новый репозиторий/workspace:

- [ ] AGENTS.md + START_HERE skeleton  
- [ ] `.cursor/rules` subset  
- [ ] Harness scripts stub  
- [ ] Loop schedule stub  
- [ ] Dev Graph / DoD template  
- [ ] Deploy docs (VPS pattern)  
- [ ] `.env.example` + SECRETS.md  
- [ ] Design tokens / UI kit pointers  
- [ ] (опц.) пустой Prisma schema from snapshot  

**DoD Phase 2 (будущее):** генерация checklist + archive «seed kit» без Client Boundary нарушений; без авто-деплоя на чужой VPS.

v1: только teaser / `status: "planned"` в UI.

---

## 13. Non-goals (v1)

- Не строить Behance / XP / лайки  
- Не делать полноценный `/resheniya` passport из капсулы  
- Не авто-публиковать Arsenal  
- Не включать PII / customer DB / private keys  
- Не требовать «Create from this» в первом ship  
- Не миграция на Vercel/Supabase «потому что в ТЗ другого продукта» — фиксируем факт источника  
- Не универсальный CI/CD SaaS — только капсула + Vault UI  
- Не переписывать продукт-источник «заодно»  

---

## 14. Связанные файлы и владельцы

| Файл | Роль |
|------|------|
| `docs/PROJECT-VAULT-TZ.md` | Этот канон + agent prompt (source of truth) |
| `docs/PROJECT-VAULT.md` | Короткая философия раздела (публичный/канон outline) |
| Reverans `docs/PROJECT_VAULT_ARCHAEOLOGY_TZ.md` | Instance brief + указатель на канон |
| `src/lib/agent-engineering/*` | Образец file-first модулей |
| `docs/AGENT-ENGINEERING.md` | Словарь Harness/Loop/Graph |
| `docs/VIBECODER-PORTFOLIO.md` | Граница с `/ai-workshop` |
| `docs/CASES-PLAN.md` | Паттерны ≠ кейсы — тон Vault ближе к паттернам+доказательству |

---

## 15. Open questions (для человека / следующего агента)

1. Точный path хранения пакетов: только `content/project-vault/` или также git LFS / внешний object storage?  
2. Публиковать ли download `source-code.tar.gz` всем посетителям или только метаданные + внутренний path для агентов?  
3. Нужен ли draft→published workflow в админке ProektMap или достаточно status в TS-модуле?  
4. Голос/voice-guide для `/project-vault` в v1 или позже?  

---

*Конец ТЗ. Пилот: заполнить INSTANCE Reverans (§4) и выполнить PASS 1–7.*
