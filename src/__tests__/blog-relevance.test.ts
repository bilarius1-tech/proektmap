import { describe, expect, it } from "vitest";
import { judgeRelevance } from "@/lib/blog/relevance";
import { buildPublishReport, isTransientFeedFailure } from "@/lib/blog/publish-report";
import { mapFeedCategory } from "@/lib/blog/categories";

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

  it("drops biology, motorcycles and marketplace news without seller action", () => {
    expect(judgeRelevance("Simulated Cell: как ИИ-платформа Turbine виртуализирует биологические эксперименты").ok).toBe(false);
    expect(judgeRelevance("Мотоциклы в Санкт-Петербурге: данные Авито о спросе и трендах", "", "Авито").ok).toBe(false);
    expect(judgeRelevance("Ozon отчитался о росте оборота за квартал")).toMatchObject({
      ok: false,
      reason: "ozon-without-seller-action",
    });
  });

  it("requires commercial value from general AI news", () => {
    expect(judgeRelevance("VibeCraft от Яндекса: что умеет сервис вайбкодинга").ok).toBe(false);
    expect(judgeRelevance("AI-бот квалифицирует заявки и передаёт лиды в CRM")).toMatchObject({
      ok: true,
      rubric: "Автоматизация продаж",
    });
  });
});

describe("publish report", () => {
  it("returns null when queue is empty — no Telegram noise", () => {
    expect(buildPublishReport([])).toBeNull();
  });

  it("never mentions source errors or Prisma", () => {
    const text = buildPublishReport([{ title: "VibeCraft от Яндекса" }]) || "";
    expect(text).toContain("статьи в очереди");
    expect(text).toContain("VibeCraft");
    expect(text.toLowerCase()).not.toContain("ошибок");
    expect(text.toLowerCase()).not.toContain("prisma");
    expect(text.toLowerCase()).not.toContain("timeout");
  });

  it("treats timeouts as transient, not as a report-worthy crash", () => {
    expect(isTransientFeedFailure("The operation was aborted due to timeout")).toBe(true);
    expect(isTransientFeedFailure("AI не вернул JSON")).toBe(true);
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
  });
});
