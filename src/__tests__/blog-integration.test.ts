import { describe, expect, it } from "vitest";
import { linkGlossaryTerms } from "@/lib/blog/link-glossary";
import { blogCoverUrl } from "@/lib/og/card-url";

describe("Blog integrations", () => {
  it("uses an admin cover instead of the generated card", () => {
    expect(blogCoverUrl({
      title: "Статья",
      coverImage: "/uploads/custom.webp",
    })).toBe("/api/media/custom.webp");

    expect(blogCoverUrl({
      title: "Статья",
      coverImage: "/uploads/custom.webp",
      baseUrl: "https://proektmap.ru",
    })).toBe("https://proektmap.ru/api/media/custom.webp");
  });

  it("falls back to a generated card without an admin cover", () => {
    expect(blogCoverUrl({ title: "Статья" })).toContain("/api/og?mode=card");
  });

  it("links the first glossary occurrence and adds an explanation", () => {
    const html = "<p>RAG помогает искать данные. Ещё один RAG здесь.</p>";
    const linked = linkGlossaryTerms(html, [{
      term: "RAG",
      slug: "rag",
      explanation: "Поиск контекста перед генерацией ответа.",
    }]);

    expect(linked.match(/class="glossary-term-link"/g)).toHaveLength(1);
    expect(linked).toContain('href="/glossary/rag"');
    expect(linked).toContain("Поиск контекста перед генерацией ответа.");
  });

  it("does not alter existing links, headings, or code", () => {
    const html = '<h2>RAG</h2><p><a href="/existing">RAG</a></p><pre><code>RAG</code></pre><p>RAG в тексте</p>';
    const linked = linkGlossaryTerms(html, [{
      term: "RAG",
      slug: "rag",
      explanation: "Объяснение",
    }]);

    expect(linked).toContain("<h2>RAG</h2>");
    expect(linked).toContain('<a href="/existing">RAG</a>');
    expect(linked).toContain("<pre><code>RAG</code></pre>");
    expect(linked.match(/class="glossary-term-link"/g)).toHaveLength(1);
  });
});
