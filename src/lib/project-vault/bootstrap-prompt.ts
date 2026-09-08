export type BootstrapPromptVars = {
  capsuleSlug: string;
  capsuleName: string;
  /** Optional pre-filled placeholders for the next project */
  newProjectName?: string;
  newProjectSlug?: string;
  newProjectUrl?: string;
};

const PROEKTMAP_ROOT = "/var/www/www-root/data/www/proektmap.ru";

/**
 * Copy-paste prompt: bootstrap a new project from Vault DNA (not archaeology of a finished product).
 */
export function buildBootstrapFromDnaPrompt(vars: BootstrapPromptVars): string {
  const {
    capsuleSlug,
    capsuleName,
    newProjectName = "{{NEW_PROJECT_NAME}}",
    newProjectSlug = "{{NEW_PROJECT_SLUG}}",
    newProjectUrl = "{{NEW_PROJECT_URL}}",
  } = vars;

  const capsuleRoot = `${PROEKTMAP_ROOT}/content/project-vault/${capsuleSlug}`;

  return `# MISSION: Создать новый проект из Project Vault DNA

Ты агент, который поднимает НОВЫЙ проект по ДНК капсулы (не археология готового продукта в Vault).

## Канон (прочитай сначала)
- COPY-FIRST: ${capsuleRoot}/ai/COPY-FIRST.md
- BOOTSTRAP: ${capsuleRoot}/ai/BOOTSTRAP-FROM-DNA.md
- Vault TZ (TEMPLATE для упаковки ЕЩЁ одного готового проекта в Vault): ${PROEKTMAP_ROOT}/docs/PROJECT-VAULT-TZ.md
- Словарь Harness/Loop/Graph: https://proektmap.ru/agent-engineering
- Live-капсула: https://proektmap.ru/project-vault/${capsuleSlug}

## Источник DNA
- Капсула: ${capsuleName} (\`${capsuleSlug}\`)
- Корень пакета: ${capsuleRoot}
- Горячие точки DNA: ai/AGENTS.md, ai/START_HERE.md, ai/.cursor/rules/, ai/harness/, infrastructure/harness/, docs/PHILOSOPHY.md, docs/DEVELOPMENT.md, docs/DEPLOYMENT.md, ai/decisions/

## Новый проект (заполни плейсхолдеры)
- NEW_PROJECT_NAME: ${newProjectName}
- NEW_PROJECT_SLUG: ${newProjectSlug}
- NEW_PROJECT_URL: ${newProjectUrl}
- NEW_WORKSPACE_PATH: {{NEW_WORKSPACE_PATH}}
- NEW_PROD_APP_PATH: {{NEW_PROD_APP_PATH}}
- NEW_PM2_PROCESS: {{NEW_PM2_PROCESS}}

## Сделай
1. Прочитай DNA капсулы: AGENTS, rules, harness, loop, graph, philosophy, stack, deploy-паттерн.
2. Воссоздай каркас агента в новом репо: AGENTS.md + START_HERE + .cursor/rules + harness skeleton + Dev Graph DoD — адаптируя имена/домены/брендинг.
3. Следуй порядку COPY-FIRST; не копируй клиентский контент, секреты, PII, дампы customer DB.
4. Подставь NEW_* во все правила и docs; секреты только именами (.env.example / SECRETS.md).
5. Если позже нужно упаковать ДРУГОЙ готовый продукт в Vault — используй TEMPLATE §3 в PROJECT-VAULT-TZ.md (археология), это отдельная миссия.

## Не делай
- Не копируй значения .env, ключи, customer data
- Не путай Vault с /ai-workshop или /resheniya
- Не коммить секреты; не ломай чужой прод без явного запроса

## Definition of Done
- В новом workspace есть адаптированные AGENTS.md, .cursor/rules, harness stub и понятный day-0 старт
- Брендинг/домен/имена — новые; Client Boundary соблюдён
- Агент следующего чата может продолжить по START_HERE без этой капсулы под рукой
`;
}
