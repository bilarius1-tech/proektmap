import { ArrowRight, MessagesSquare } from "lucide-react";
import { COMMUNITY_NAME, COMMUNITY_NAME_ON, COMMUNITY_PATH } from "@/lib/community/config";
import { timeAgoRu, type CommunityDiscussion } from "@/lib/community/latest";

const replyWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "ответ";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "ответа";
  return "ответов";
};

/** Ссылки на форум — обычный <a>: это не страницы Next.js. */
export default function HomeCommunity({ discussions }: { discussions: CommunityDiscussion[] | null }) {
  if (discussions === null) return null;

  return (
    <section className="home-hub" aria-labelledby="home-community-title" style={{ paddingBottom: 12 }}>
      <h2 id="home-community-title">Сейчас на {COMMUNITY_NAME_ON}</h2>

      {discussions.length === 0 ? (
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 15 }}>
          Пока тихо. Задайте первый вопрос — вход тем же аккаунтом, что на сайте.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-light)",
            borderRadius: "var(--radius-m)",
          }}
        >
          {discussions.map((d, i) => (
            <li key={d.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-border-light)" }}>
              <a
                href={d.href}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", textDecoration: "none", color: "inherit" }}
              >
                <MessagesSquare size={18} style={{ flex: "none", marginTop: 2, color: "var(--color-text-tertiary)" }} aria-hidden />
                <span style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", overflowWrap: "anywhere" }}>
                    {d.title}
                  </strong>
                  <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--color-text-tertiary)" }}>
                    {[
                      d.tag?.name,
                      d.lastAuthor,
                      timeAgoRu(d.lastPostedAt),
                      d.replies > 0 ? `${d.replies} ${replyWord(d.replies)}` : "без ответов",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <p style={{ margin: "16px 0 0", textAlign: "center" }}>
        <a href={COMMUNITY_PATH} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-accent)", fontWeight: 700, textDecoration: "none" }}>
          Открыть {COMMUNITY_NAME} <ArrowRight size={14} />
        </a>
      </p>
    </section>
  );
}
