import { describe, expect, it } from "vitest";
import { judgeRelevance } from "@/lib/blog/relevance";
import { buildPublishReport, isTransientFeedFailure } from "@/lib/blog/publish-report";
import { mapFeedCategory } from "@/lib/blog/categories";
import { getBlogAutoPublishDailyLimit, mskDayStartUtc } from "@/lib/blog/daily-quota";

describe("relevance filter", () => {
  it("keeps actionable Avito content and assigns the rubric", () => {
    expect(judgeRelevance("Как ИИ может написать описание объявления на Авито по фотографиям", "", "Авито")).toMatchObject({
      ok: true,
      rubric: "Авито",
    });
    expect(judgeRelevance("Автоответы клиентам Авито через Telegram-бота", "", "Авито").ok).toBe(true);
  });

  it("keeps actionable Ozon and Wildberries content", () => {
    expect(judgeRelevance("Как автоматизировать цены и остатки продавца на Ozon")).toMatchObject({
      ok: true,
      rubric: "Ozon",
    });
    expect(judgeRelevance("Wildberries изменил комиссию для продавцов: что пересчитать")).toMatchObject({
      ok: true,
      rubric: "Wildberries",
    });
  });

  it("keeps useful global commerce with a marketplace rubric", () => {
    expect(judgeRelevance("Shopify добавил AI-агента для обработки заказов продавцов")).toMatchObject({
      ok: true,
      rubric: "Маркетплейсы",
    });
  });

  it("prefers AI-engineering over seller stretch", () => {
    expect(judgeRelevance("VibeCraft от Яндекса: что умеет сервис вайбкодинга")).toMatchObject({
      ok: true,
      rubric: "AI-инжиниринг",
    });
    expect(judgeRelevance("Cursor добавил MCP-серверы для агентов в Composer")).toMatchObject({
      ok: true,
      rubric: "AI-инжиниринг",
    });
    expect(judgeRelevance("DeepSeek обновил API: что проверить в промптах")).toMatchObject({
      ok: true,
      rubric: "AI-инжиниринг",
    });
  });

  it("drops biology and marketplace news without seller action", () => {
    expect(judgeRelevance("Simulated Cell: как ИИ-платформа Turbine виртуализирует биологические эксперименты").ok).toBe(false);
    expect(judgeRelevance("Мотоциклы в Санкт-Петербурге: данные Авито о спросе и трендах", "", "Авито").ok).toBe(false);
    expect(judgeRelevance("Ozon отчитался о росте оборота за квартал")).toMatchObject({
      ok: false,
      reason: "ozon-without-seller-action",
    });
  });

  it("keeps sales automation with a clear next step", () => {
    expect(judgeRelevance("AI-бот квалифицирует заявки и передаёт лиды в CRM")).toMatchObject({
      ok: true,
      rubric: "Автоматизация продаж",
    });
  });
});

describe("daily quota", () => {
  it("defaults to 2 posts per day", () => {
    const prev = process.env.BLOG_AUTO_PUBLISH_DAILY_LIMIT;
    delete process.env.BLOG_AUTO_PUBLISH_DAILY_LIMIT;
    expect(getBlogAutoPublishDailyLimit()).toBe(2);
    process.env.BLOG_AUTO_PUBLISH_DAILY_LIMIT = "1";
    expect(getBlogAutoPublishDailyLimit()).toBe(1);
    if (prev === undefined) delete process.env.BLOG_AUTO_PUBLISH_DAILY_LIMIT;
    else process.env.BLOG_AUTO_PUBLISH_DAILY_LIMIT = prev;
  });

  it("returns MSK midnight as Date", () => {
    const start = mskDayStartUtc(new Date("2026-09-04T12:00:00+03:00"));
    expect(start.toISOString()).toBe("2026-09-03T21:00:00.000Z");
  });
});

describe("publish report", () => {
  it("still reports an empty queue without source dumps", () => {
    const text = buildPublishReport([], { queued: 0, hour: 9, timeouts: 2 });
    expect(text).toContain("В очередь: 0");
    expect(text).toContain("AI не успел: 2");
    expect(text.toLowerCase()).not.toContain("ошибок источников");
    expect(text.toLowerCase()).not.toContain("prisma");
  });

  it("never mentions Prisma or raw timeouts", () => {
    const text = buildPublishReport([{ title: "VibeCraft от Яндекса" }], { queued: 1, hour: 9 });
    expect(text).toContain("VibeCraft");
    expect(text.toLowerCase()).not.toContain("ошибок источников");
    expect(text.toLowerCase()).not.toContain("prisma");
    expect(text.toLowerCase()).not.toContain("aborted");
  });

  it("treats timeouts as transient, not as a report-worthy crash", () => {
    expect(isTransientFeedFailure("The operation was aborted due to timeout")).toBe(true);
    expect(isTransientFeedFailure("AI не вернул JSON")).toBe(false);
    expect(isTransientFeedFailure("HTTP 500")).toBe(false);
  });
});

describe("category map", () => {
  it("maps Tproger Development to existing Разработка", () => {
    expect(mapFeedCategory("Development")).toEqual({ name: "Разработка", slug: "development" });
  });

  it("maps seller-first rubrics to stable slugs", () => {
    expect(mapFeedCategory("Ozon")).toEqual({ name: "Ozon", slug: "ozon" });
    expect(mapFeedCategory("Wildberries")).toEqual({ name: "Wildberries", slug: "wildberries" });
    expect(mapFeedCategory("Автоматизация продаж")).toEqual({
      name: "Автоматизация продаж",
      slug: "sales-automation",
    });
    expect(mapFeedCategory("AI-инжиниринг")).toEqual({
      name: "AI-инжиниринг",
      slug: "ai-engineering",
    });
  });
});
