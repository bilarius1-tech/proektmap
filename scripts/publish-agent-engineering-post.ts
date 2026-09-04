/**
 * Pillar-пост: Инженерия агентов (Harness → Loop → Graph).
 * Автор резолвится по email (не хардкодим чужой UUID — защита от FK).
 */
import { getDb } from "../src/lib/db/index";

const SLUG = "inzheneriya-agentov-harness-loop-graph";
const AUTHOR_EMAILS = [
  "bilariuss@yandex.ru",
  "bilarius@yandex.ru",
  process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

const CONTENT = `
<p>Многие начинают с «хорошего промпта» и удивляются, почему агент то гениален, то ломает проект. Дело не в красоте фразы. Промпт — тонкий вход. Настоящее ремесло — <strong>окружение</strong>: закон проекта, цикл с проверкой и карта связей.</p>

<p>На ProektMap для этого есть отдельный трек — <a href="https://proektmap.ru/agent-engineering">Инженерия агентов</a>. Три ступени: <strong>Harness → Loop → Graph</strong>. Ниже — зачем каждая и куда идти руками.</p>

<h2>Почему одного промпта мало</h2>
<p>Чат без каркаса — это умная модель без закона. Она может красиво ответить и при этом:</p>
<ul>
<li>забыть правила репозитория;</li>
<li>«починить» баг разрушительной командой;</li>
<li>остановиться на первом черновике без проверки;</li>
<li>угадывать по файлам вместо карты зависимостей.</li>
</ul>
<p>Промпт говорит «что сделать сейчас». Окружение отвечает «как у нас принято всегда» и «когда считать готовым».</p>

<h2>Harness — каркас вокруг модели</h2>
<p><a href="https://proektmap.ru/agent-engineering/harness">Harness</a> — сбруя: инструкции (AGENTS.md, rules), skills, хуки, права и понятная папка. В Cursor / на ProektMap harness уже живёт в правилах, скиллах и запретах вроде force-reset.</p>
<p><em>Практика:</em> откройте модуль, пройдите чеклист «закон + один skill + что ловит ошибку». Затем посмотрите стеки агентов в <a href="https://proektmap.ru/arsenal">Нейро каталоге</a> (вайбкодинг, MCP-агенты).</p>

<h2>Loop — цикл с проверкой</h2>
<p><a href="https://proektmap.ru/agent-engineering/loop">Loop</a> — не один ответ, а повтор: сделать → увидеть → исправить → снова, пока Definition of Done. Нужны бюджет циклов, критик и правило стопа. Иначе агент крутит одно и то же или уходит после первого «кажется ок».</p>
<p>На платформе зачатки loop уже есть: автор → аудитор, validate:sitemap, smoke HTTP 200 после деплоя. В <a href="https://proektmap.ru/resheniya">готовых решениях</a> тот же принцип — артефакт с проверкой, не «прочитал и забыл».</p>

<h2>Graph — карта системы</h2>
<p><a href="https://proektmap.ru/agent-engineering/graph">Graph</a> — работа по связям, а не по портянке контекста. Окно модели конечно, проект растёт. Агент спрашивает карту (graphify), идёт по рёбрам, меняет систему и обновляет граф.</p>
<p>Осторожный слой — <strong>self-rewrite</strong>: патч к своим skills/rules только после вашего явного «да». Без разрешения агент не «улучшает» себе доступ к секретам.</p>

<h2>Как пройти за один вечер</h2>
<ol>
<li>Откройте <a href="https://proektmap.ru/agent-engineering">хаб трека</a> и послушайте голосовой гид (если включён виджет).</li>
<li>Пройдите <a href="https://proektmap.ru/agent-engineering/harness">Harness</a> → <a href="https://proektmap.ru/agent-engineering/loop">Loop</a> → <a href="https://proektmap.ru/agent-engineering/graph">Graph</a> по чеклистам и одному промпту на модуль.</li>
<li>Возьмите стек в <a href="https://proektmap.ru/arsenal">Нейро каталоге</a> или миссию в <a href="https://proektmap.ru/resheniya">/resheniya</a> — уже с собранной «машиной работы».</li>
</ol>

<h2>Типичная ошибка</h2>
<p>Подменить инженерию агентов бесконечной полировкой промпта. Красивая фраза без правил, DoD и карты связей даёт красивый хаос. Сначала окружение — потом скорость.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="https://proektmap.ru/agent-engineering">Инженерия агентов</a> — хаб трека</li>
<li><a href="https://proektmap.ru/arsenal">Нейро каталог</a> — стеки под миссию</li>
<li><a href="https://proektmap.ru/resheniya">Готовые решения AI</a> — продукт с проверкой результата</li>
<li><a href="https://proektmap.ru/skills">Библиотека Skills</a> — готовые сценарии для агентов</li>
</ul>

<p><em>Коротко:</em> промпт открывает дверь. Harness, Loop и Graph строят комнату, в которой агент работает предсказуемо.</p>
`.trim();

async function resolveAuthorId(db: Awaited<ReturnType<typeof getDb>>): Promise<string> {
  for (const email of AUTHOR_EMAILS) {
    const u = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, email: true, name: true },
    });
    if (u) {
      console.log("author", u.email, u.id, u.name);
      return u.id;
    }
  }
  const admin = await db.user.findFirst({
    where: { OR: [{ role: "admin" }, { email: { contains: "bilarius" } }] },
    select: { id: true, email: true, name: true },
  });
  if (!admin) throw new Error("Admin author not found — refuse create without valid authorId");
  console.log("author(fallback)", admin.email, admin.id);
  return admin.id;
}

async function main() {
  const db = await getDb();
  const authorId = await resolveAuthorId(db);

  const category = await db.blogCategory.findFirst({
    where: {
      OR: [
        { name: { contains: "инжиниринг", mode: "insensitive" } },
        { slug: { contains: "ai-engineering", mode: "insensitive" } },
        { slug: { equals: "ai" } },
      ],
    },
  });
  if (!category) throw new Error("Category AI-инжиниринг not found");
  console.log("category", category.name, category.id);

  const existing = await db.blogPost.findUnique({ where: { slug: SLUG } });
  const data = {
    title: "Инженерия агентов: почему промпта мало — Harness, Loop, Graph",
    slug: SLUG,
    content: CONTENT,
    excerpt:
      "Промпт — только вход. Трек ProektMap учит собирать окружение агента: Harness (каркас), Loop (цикл с проверкой), Graph (карта связей). Ссылки на модули, Нейро каталог и /resheniya.",
    coverImage: "",
    status: "published" as const,
    tags: "инженерия агентов,Harness,Loop,Graph,Cursor,AI-инжиниринг,agent-engineering",
    metaTitle: "Инженерия агентов: Harness → Loop → Graph | ProektMap",
    metaDesc:
      "Почему одного промпта мало. Harness, Loop и Graph — окружение агента в Cursor. Трек /agent-engineering на ProektMap.",
    categoryId: category.id,
    authorId,
    aiGenerated: false,
    aiModel: "",
    publishedAt: new Date(),
  };

  if (existing) {
    const updated = await db.blogPost.update({
      where: { slug: SLUG },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        tags: data.tags,
        metaTitle: data.metaTitle,
        metaDesc: data.metaDesc,
        categoryId: data.categoryId,
        authorId: data.authorId,
        aiGenerated: false,
        status: "published",
        publishedAt: existing.publishedAt || new Date(),
      },
    });
    console.log("updated", updated.slug, updated.id);
  } else {
    const created = await db.blogPost.create({ data });
    console.log("created", created.slug, created.id);
  }

  console.log("URL https://proektmap.ru/blog/" + SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
