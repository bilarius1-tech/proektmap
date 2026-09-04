import { getDb } from "../src/lib/db/index";

const AUTHOR_ID = "138305c9-0083-4cf0-a1a1-259d87f6db46"; // Алексей Тимофеев
const CATEGORY_ID = "c2cf66f5-f7d4-49f1-a373-4aa6187c4797"; // AI-инжиниринг
const SLUG = "claude-academy-i-proektmap";

const CONTENT = `
<p>Если вы только входите в AI, легко застрять между двумя крайностями: бесконечные курсы «про модели» и сразу сложный прод без опоры. Честный путь проще: сначала грамотность, потом практика с проверкой.</p>

<p><a href="https://academy.claude.com/" target="_blank" rel="noopener noreferrer">Claude Academy</a> — бесплатная официальная школа Anthropic. Там объясняют, как думать вместе с моделью, писать код с Claude Code, подключать API/MCP и держать AI Fluency. Принципы переносятся и на другие модели — это не «клуб только Claude».</p>

<p><strong>ProektMap</strong> — не клон Academy. У нас полигон результата: готовые маршруты, микросервисы, чеклисты и наблюдаемая проверка. Ниже — карта «модуль Academy → куда идти у нас».</p>

<h2>Кому это нужно</h2>
<p>AI-инженеру и вайбкодеру, который уже трогал чат с моделью, но хочет перейти от «понял на словах» к «собрал и проверил продукт».</p>

<h2>Какую задачу закрывает</h2>
<p>Проблема: теория и инструменты размазаны по вкладкам. Решение: пройти базу в Academy, затем взять один маршрут на ProektMap и довести до артефакта с проверкой.</p>

<h2>Как открыть</h2>
<ol>
<li>Academy: <a href="https://academy.claude.com/" target="_blank" rel="noopener noreferrer">https://academy.claude.com/</a></li>
<li>Полигон: <a href="https://proektmap.ru/resheniya">Готовые решения AI</a></li>
</ol>

<h2>Карта модулей → разделы ProektMap</h2>
<table>
<thead>
<tr><th>В Academy</th><th>На ProektMap</th><th>Зачем</th></tr>
</thead>
<tbody>
<tr>
<td>Claude.ai / основы диалога</td>
<td><a href="https://proektmap.ru/prompts">Промпты</a>, <a href="https://proektmap.ru/glossary">глоссарий</a>, <a href="https://proektmap.ru/models">модели</a></td>
<td>Сначала ясный запрос и термины, потом стек</td>
</tr>
<tr>
<td>Claude Code / сборка ПО</td>
<td><a href="https://proektmap.ru/resheniya">/resheniya</a> (SaaS, Telegram, Авито)</td>
<td>Готовый порядок: команда → результат → проверка</td>
</tr>
<tr>
<td>Platform / API, Console, MCP</td>
<td><a href="https://proektmap.ru/mcp">MCP-каталог</a>, <a href="https://proektmap.ru/services">микросервисы</a>, <a href="https://proektmap.ru/architect">AI-Архитектор</a></td>
<td>Связать агента с системами и утилитами без «с нуля»</td>
</tr>
<tr>
<td>AI Fluency (4D и ограничения моделей)</td>
<td><a href="https://proektmap.ru/decisions">Методология решений</a> + шаги с DoD в маршрутах</td>
<td>Делегирование и проверка, а не слепая вера в ответ</td>
</tr>
</tbody>
</table>

<h2>Что сделать за 10 минут</h2>
<ol>
<li>Откройте Academy и пробегите оглавление: что уже знакомо, что ещё нет.</li>
<li>На ProektMap откройте <a href="https://proektmap.ru/resheniya">/resheniya</a> и выберите один маршрут (например SaaS или Telegram-бот).</li>
<li>Пройдите только первый шаг маршрута до наблюдаемого результата из инструкции — не «прочитал», а «получилось».</li>
</ol>

<h2>Типичная ошибка</h2>
<p>Подменить практику бесконечным чтением курсов. Academy даёт фундамент; если после часа учёбы нет артефакта (файл, бот ответил /start, объявление собрано), вы всё ещё в школе, а не на полигоне. И наоборот: прыгать в /resheniya без базовой грамотности — тоже дорого по времени на тупики.</p>

<h2>Куда дальше</h2>
<ul>
<li>Школа: <a href="https://academy.claude.com/" target="_blank" rel="noopener noreferrer">Claude Academy</a> (внешний сайт Anthropic)</li>
<li>Полигон: <a href="https://proektmap.ru/resheniya">Готовые решения</a></li>
<li>Утилиты вокруг маршрута: <a href="https://proektmap.ru/services">Микросервисы</a></li>
<li>Связь агента с внешним миром: <a href="https://proektmap.ru/mcp">MCP</a></li>
</ul>

<p><em>Коротко:</em> Academy учит думать с AI. ProektMap заставляет довести идею до проверяемого результата.</p>
`.trim();

async function main() {
  const db = await getDb();

  const existing = await db.blogPost.findUnique({ where: { slug: SLUG } });
  const data = {
    title: "Claude Academy и ProektMap: школа грамотности и полигон результата",
    slug: SLUG,
    content: CONTENT,
    excerpt:
      "Claude Academy — бесплатная школа Anthropic. ProektMap — следующий шаг: маршруты /resheniya, микросервисы и проверка результата. Карта модулей → разделы.",
    coverImage: "",
    status: "published",
    tags: "Claude Academy,AI-инжиниринг,resheniya,обучение",
    metaTitle: "Claude Academy и ProektMap — грамотность, затем практика | ProektMap",
    metaDesc:
      "Бесплатная Claude Academy даёт базу. ProektMap — полигон: /resheniya, MCP, микросервисы. Карта модулей Academy → разделы платформы.",
    categoryId: CATEGORY_ID,
    authorId: AUTHOR_ID,
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
