import { describe, expect, it } from "vitest";
import {
  appendFaq,
  parseSeoArticle,
  parseSeoKeywords,
  sanitizeArticleHtml,
  scoreSeoArticle,
  SeoArticle,
} from "@/lib/blog/seo-pipeline";

describe("SEO pipeline", () => {
  it("parses keywords without duplicates", () => {
    expect(parseSeoKeywords("Cursor, AI агенты\nCursor; MCP")).toEqual(["Cursor", "AI агенты", "MCP"]);
  });

  it("parses a fenced JSON response", () => {
    const article = parseSeoArticle(`\`\`\`json
{"title":"Cursor X: что это","metaTitle":"Cursor X: обзор новой функции для разработчиков","metaDesc":"Cursor X — новая функция для разработчиков: разбираем принцип работы, применение, ограничения и способы начать работу с инструментом.","contentType":"Explainer","intent":"узнать, что такое Cursor X","primaryKeyword":"Cursor X","secondaryKeywords":["Cursor X что это"],"html":"<p>Текст</p>","faq":[]}
\`\`\``);
    expect(article.contentType).toBe("Explainer");
    expect(article.primaryKeyword).toBe("Cursor X");
  });

  it("removes executable HTML and appends a useful FAQ", () => {
    const clean = sanitizeArticleHtml('<p onclick="alert(1)">Текст</p><script>alert(1)</script>');
    expect(clean).not.toContain("onclick");
    expect(clean).not.toContain("<script");
    expect(appendFaq(clean, [
      { question: "Что это?", answer: "Объяснение." },
      { question: "Кому нужно?", answer: "Разработчикам." },
    ])).toContain('data-seo-faq="true"');
  });

  it("passes an article that meets the deterministic 80-point gate", () => {
    const sourceUrl = "https://example.com/news";
    const body = `Cursor X ${"полезное объяснение и практический контекст ".repeat(120)}`;
    const article: SeoArticle = {
      title: "Cursor X: что это и как использовать новую функцию",
      metaTitle: "Cursor X: обзор и инструкция новой функции",
      metaDesc: "Cursor X — разбор новой функции: как она работает, кому пригодится, какие есть ограничения и как начать использовать инструмент на практике.",
      contentType: "Explainer",
      intent: "понять, что такое Cursor X и как им пользоваться",
      primaryKeyword: "Cursor X",
      secondaryKeywords: ["Cursor X что это", "Cursor X инструкция"],
      html: `<p>${body}</p><h2>Cursor X: что это</h2><p>Разбор.</p><h2>Как работает Cursor X</h2><p>Практика.</p><h2>Cursor X инструкция</h2><p><a href="/ai-tools/cursor">Cursor</a> и <a href="/prompts">промпты</a>.</p><p><a href="${sourceUrl}">Источник</a></p>`,
      faq: [],
    };

    const result = scoreSeoArticle(article, sourceUrl, ["/ai-tools/cursor", "/prompts"]);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.missing).toEqual([]);
  });
});
