import { describe, expect, it } from "vitest";
import { parseDiscussions, timeAgoRu } from "@/lib/community/latest";

const payload = {
  data: [
    {
      type: "discussions",
      id: "5",
      attributes: { title: "Новости проекта!", slug: "5-novosti-proekta", commentCount: 3, lastPostedAt: "2026-10-19T06:32:15+00:00" },
      relationships: {
        lastPostedUser: { data: { type: "users", id: "1" } },
        tags: { data: [{ type: "tags", id: "11" }] },
      },
    },
    { type: "discussions", id: "6", attributes: { title: "Без slug" } },
  ],
  included: [
    { type: "users", id: "1", attributes: { displayName: "Алексей Тимофеев" } },
    { type: "tags", id: "11", attributes: { name: "Оффтоп", slug: "offtop", color: "#888888", isPrimary: true } },
  ],
};

describe("parseDiscussions", () => {
  it("собирает ссылку, автора, тег и число ответов", () => {
    const [d, ...rest] = parseDiscussions(payload);
    expect(rest).toHaveLength(0);
    expect(d).toMatchObject({
      href: "/community/d/5-novosti-proekta",
      replies: 2,
      lastAuthor: "Алексей Тимофеев",
      tag: { name: "Оффтоп", href: "/community/t/offtop" },
    });
  });

  it("на мусоре возвращает пустой список", () => {
    expect(parseDiscussions(null)).toEqual([]);
    expect(parseDiscussions({ errors: [] })).toEqual([]);
  });
});

describe("timeAgoRu", () => {
  const now = Date.parse("2026-10-19T12:00:00Z");
  it("склоняет единицы", () => {
    expect(timeAgoRu("2026-10-19T11:59:40Z", now)).toBe("только что");
    expect(timeAgoRu("2026-10-19T11:39:00Z", now)).toBe("21 минуту назад");
    expect(timeAgoRu("2026-10-19T09:00:00Z", now)).toBe("3 часа назад");
    expect(timeAgoRu("2026-10-14T12:00:00Z", now)).toBe("5 дней назад");
  });
});
