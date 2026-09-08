# BOOTSTRAP-FROM-DNA — промпт: создать новый проект из капсулы

Скопируй блок ниже в новый чат Cursor. Замени `{{…}}`.  
Не копируй клиентский контент, секреты и customer DB — только DNA агента.

```text
# MISSION: Создать новый проект из Project Vault DNA

Ты агент, который поднимает НОВЫЙ проект по ДНК капсулы (не археология готового продукта в Vault).

## Канон (прочитай сначала)
- COPY-FIRST: /var/www/www-root/data/www/proektmap.ru/content/project-vault/{{CAPSULE_SLUG}}/ai/COPY-FIRST.md
- Этот файл: …/ai/BOOTSTRAP-FROM-DNA.md
- Vault TZ (TEMPLATE для упаковки ЕЩЁ одного готового проекта в Vault):
  /var/www/www-root/data/www/proektmap.ru/docs/PROJECT-VAULT-TZ.md
- Словарь Harness/Loop/Graph: https://proektmap.ru/agent-engineering
- Live-капсула: https://proektmap.ru/project-vault/{{CAPSULE_SLUG}}

## Источник DNA
- Капсула slug: {{CAPSULE_SLUG}}   # пример: reverans
- Корень пакета:
  /var/www/www-root/data/www/proektmap.ru/content/project-vault/{{CAPSULE_SLUG}}
- Горячие точки: ai/AGENTS.md, ai/START_HERE.md, ai/.cursor/rules/, ai/harness/,
  infrastructure/harness/, docs/PHILOSOPHY.md, docs/DEVELOPMENT.md, docs/DEPLOYMENT.md, ai/decisions/

## Новый проект
- NEW_PROJECT_NAME: {{NEW_PROJECT_NAME}}
- NEW_PROJECT_SLUG: {{NEW_PROJECT_SLUG}}
- NEW_PROJECT_URL: {{NEW_PROJECT_URL}}
- NEW_WORKSPACE_PATH: {{NEW_WORKSPACE_PATH}}
- NEW_PROD_APP_PATH: {{NEW_PROD_APP_PATH}}
- NEW_PM2_PROCESS: {{NEW_PM2_PROCESS}}

## Сделай
1. Прочитай DNA капсулы: AGENTS, rules, harness, loop, graph, philosophy, stack, deploy.
2. Воссоздай каркас: AGENTS.md + START_HERE + .cursor/rules + harness skeleton + Dev Graph DoD — с новыми именами/доменами/брендингом.
3. Следуй COPY-FIRST; не копируй клиентский контент, секреты, PII, дампы customer DB.
4. Секреты только именами (.env.example / SECRETS.md).
5. Упаковка другого готового продукта в Vault — отдельная миссия: TEMPLATE §3 в PROJECT-VAULT-TZ.md.

## Не делай
- Не копируй значения .env / ключи / customer data
- Не путай Vault с /ai-workshop или /resheniya
- Не коммить секреты; не ломай чужой прод без запроса

## Definition of Done
- В новом workspace есть адаптированные AGENTS.md, .cursor/rules, harness stub и day-0 старт
- Брендинг/домен — новые; Client Boundary соблюдён
```

## Триггер для агента ProektMap

Если пользователь говорит «создай из капсулы X» / «bootstrap from vault» — следуй этому файлу + COPY-FIRST и правилу `.cursor/rules/project-vault-bootstrap.mdc`.
