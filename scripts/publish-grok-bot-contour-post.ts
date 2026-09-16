/**
 * Обзор внутреннего продукта: мануал Grok Bot + маршрут /resheniya/grok-bot-cursor.
 * Автор резолвится по email (не хардкодим UUID).
 */
import { getDb } from "../src/lib/db/index";

const SLUG = "grok-bot-vneshniy-kontur-cursor";
const AUTHOR_EMAILS = [
  "bilariuss@yandex.ru",
  "bilarius@yandex.ru",
  process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

const CONTENT = `
<p>Grok Bot в Cursor легко принять за ещё один чат. Тогда бот и читает почту, и сразу правит репозиторий — грязный контекст попадает в код, а PR уходит без вашего «да».</p>
<p>На ProektMap это уже разобрано двумя слоями: русский <a href="https://proektmap.ru/agent-engineering/grok-bot">мануал Grok Bot</a> и готовое решение <a href="https://proektmap.ru/resheniya/grok-bot-cursor">Собрать контур Grok Bot → Cursor</a>.</p>

<h2>Кому это нужно</h2>
<p>Вайбкодеру и AI-инженеру, у кого Cursor уже есть, а Grok Bot появился как «коллега с облачным компьютером». Не продавцу и не тому, кто ищет обход доступа.</p>

<h2>Какую задачу закрывает</h2>
<p>Проблема: один агент делает всё сразу — Slack, бриф, diff, публикация. Результат: письма клиентам, выдуманные факты, коммит без проверки.</p>
<p>Что получаете: внешний продюсер собирает бриф, внутренний Cursor меняет файлы. Письма, покупки и PR — только после вашего ОК.</p>

<h2>Как открыть</h2>
<p>Сначала теория с копируемыми шаблонами: <a href="https://proektmap.ru/agent-engineering/grok-bot">https://proektmap.ru/agent-engineering/grok-bot</a>.</p>
<p>Затем маршрут по шагам: <a href="https://proektmap.ru/resheniya/grok-bot-cursor">https://proektmap.ru/resheniya/grok-bot-cursor</a>. Рабочая зона — кнопка «Начать маршрут».</p>

<h2>Что сделать за 10 минут</h2>
<ol>
<li>Откройте мануал и блоки «Не путать продукты»: Grok Bot ≠ чат grok.com ≠ Grok Build ≠ Cursor-агент.</li>
<li>Скопируйте хороший устав (кнопка Copy) и вставьте в описание бота. Не пишите «будь полезным».</li>
<li>Откройте <a href="https://proektmap.ru/resheniya/grok-bot-cursor/workspace">рабочую зону маршрута</a>, дойдите до шага «Два контура» и назовите роли вслух: продюсер / кодер.</li>
</ol>
<p>Наблюдаемый результат: в чате бота есть правило «код сам не пишу», а не обещание «сделаю фичу и опубликую».</p>

<h2>Типичная ошибка</h2>
<p>Искать Grok Bot на grok.com или ставить routine и флот ботов до первого удачного брифа. Нет пункта в Cursor — честная остановка. Серые схемы доступа в маршрут не входят. Все боты аккаунта делят один компьютер: имя не сейф.</p>
<p><strong>Плохо:</strong> «Grok Bot, сделай фичу, разбери почту и опубликуй пост».</p>
<p><strong>Хорошо:</strong> «Ты внешний продюсер. Собери бриф: цель, файлы, Definition of Done, запреты. Код не пиши. PR не открывай. Покажи бриф мне».</p>

<h2>Куда дальше</h2>
<ul>
<li>Продукт: <a href="https://proektmap.ru/agent-engineering/grok-bot">мануал Grok Bot</a></li>
<li>Смежный маршрут: <a href="https://proektmap.ru/resheniya/grok-bot-cursor">контур Grok Bot → Cursor</a></li>
<li>Каркас агента: <a href="https://proektmap.ru/agent-engineering/harness">Harness</a></li>
<li>Стек кодера: <a href="https://proektmap.ru/arsenal/vibe-coder">Нейро каталог · агент-кодер</a></li>
</ul>

<p><em>Коротко:</em> сначала чистый бриф снаружи, потом diff внутри. Автопилот — после ручного прогона, не вместо него.</p>
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
    title: "Grok Bot снаружи, Cursor внутри: контур без автопилота в прод",
    slug: SLUG,
    content: CONTENT,
    excerpt:
      "Вайбкодеру: Grok Bot собирает бриф, Cursor пишет код. Мануал, 10 минут и готовый маршрут — без флота ботов и серых схем доступа.",
    coverImage: "",
    status: "published" as const,
    tags: "Grok Bot,Cursor,инженерия агентов,готовые решения,вайбкодинг,AI-инжиниринг",
    metaTitle: "Grok Bot → Cursor: внешний бриф, внутренний код",
    metaDesc:
      "Как собрать внешний контур Grok Bot и внутренний Cursor: мануал, 10 минут, типичная ошибка и готовый маршрут на ProektMap.",
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
