import { MessagesSquare } from "lucide-react";
import { COMMUNITY_NAME_ON } from "@/lib/community/config";

type Props = {
  href: string;
  hint?: string;
};

/** Ссылка из материала ProektMap на ИИ Форум. Обычный <a>: /community — не страница Next.js. */
export function CommunityDiscussLink({ href, hint = "Задайте вопрос по статье или покажите, как применили. Вход тем же аккаунтом ProektMap." }: Props) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-m)",
        padding: "var(--space-m)",
        marginBottom: "var(--space-l)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-m)",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
        textDecoration: "none",
      }}
    >
      <MessagesSquare size={22} color="var(--color-accent)" aria-hidden />
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontWeight: 700, fontSize: "var(--text-m)" }}>Обсудить на {COMMUNITY_NAME_ON}</span>
        <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>{hint}</span>
      </span>
    </a>
  );
}
