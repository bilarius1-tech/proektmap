"""Fix blog: comment count, recent comments, share buttons + OG image"""
import re

# 1. Blog listing: add comment count to query
list_path = '/var/www/www-root/data/www/proektmap.ru/src/app/blog/page.tsx'
with open(list_path, 'r') as f:
    c = f.read()

c = c.replace(
    "include: { author: { select: { name: true, email: true } }, category: { select: { name: true, slug: true } } },",
    "include: { author: { select: { name: true, email: true } }, category: { select: { name: true, slug: true } }, _count: { select: { comments: true } } },"
)
with open(list_path, 'w') as f:
    f.write(c)
print('1. Comment count query: OK')

# 2. RecentComments widget: fetch real data
client_path = '/var/www/www-root/data/www/proektmap.ru/src/app/blog/client.tsx'
with open(client_path, 'r') as f:
    client = f.read()

# Replace the static RecentComments with a dynamic one
old_rc = """function RecentComments() {
  // Static placeholder — real data would come from API
  return (
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
      Пока нет комментариев. Будьте первым!
    </div>
  );
}"""

new_rc = """function RecentComments() {
  const [comments, setComments] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/blog/comments/recent").then(r => r.json()).then(d => setComments(d.comments || []));
  }, []);
  if (!comments.length) return (
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
      Пока нет комментариев. Будьте первым!
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {comments.map((c: any) => (
        <a key={c.id} href={`/blog/${c.post?.slug || "#"}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "var(--text-xs)", lineHeight: 1.5, color: "var(--color-text-secondary)", marginBottom: 2 }}>
            {c.content.slice(0, 80)}{c.content.length > 80 ? "..." : ""}
          </div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "flex", gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{c.authorName}</span>
            <span>{new Date(c.createdAt).toLocaleDateString("ru")}</span>
          </div>
        </a>
      ))}
    </div>
  );
}"""

client = client.replace(old_rc, new_rc)
print('2. RecentComments widget: OK')

with open(client_path, 'w') as f:
    f.write(client)

# 3. Post page: share buttons + OG image fix
post_page = '/var/www/www-root/data/www/proektmap.ru/src/app/blog/[slug]/page.tsx'
with open(post_page, 'r') as f:
    p = f.read()

# Fix OG image to use coverImage if available
p = p.replace(
    'const ogImage = `https://proektmap.ru/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category?.name || "")}&author=${encodeURIComponent(post.author?.name || "")}`;',
    'const ogImage = post.coverImage?.startsWith("/") ? `https://proektmap.ru${post.coverImage}` : post.coverImage || `https://proektmap.ru/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category?.name || "")}&author=${encodeURIComponent(post.author?.name || "")}`;'
)
with open(post_page, 'w') as f:
    f.write(p)
print('3. OG image fix: OK')

# 4. Post client: add share buttons
post_client = '/var/www/www-root/data/www/proektmap.ru/src/app/blog/[slug]/client.tsx'
with open(post_client, 'r') as f:
    pc = f.read()

# Add Share2 import
pc = pc.replace(
    'Send, Bookmark, Rocket, Clock, List',
    'Send, Bookmark, Rocket, Clock, List, Share2'
)

# Add share buttons after the meta line (after tags)
old_tags_end = """{post.tags && post.tags.split(",").map((t: string) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)" }}>
            <Tag size={10} />{t.trim()}
          </span>
        ))}
      </div>"""

new_tags_end = """{post.tags && post.tags.split(",").map((t: string) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)" }}>
            <Tag size={10} />{t.trim()}
          </span>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button onClick={() => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(post.title);
            window.open(`https://t.me/share/url?url=${url}&text=${title}`, "_blank", "width=600,height=400");
          }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4, display: "flex", alignItems: "center", gap: 3, fontSize: 10 }} title="Поделиться в Telegram">
            <span style={{ fontWeight: 700, color: "#2AABEE" }}>TG</span>
          </button>
          <button onClick={() => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(post.title);
            window.open(`https://vk.com/share.php?url=${url}&title=${title}`, "_blank", "width=600,height=400");
          }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4, display: "flex", alignItems: "center", gap: 3, fontSize: 10 }} title="Поделиться ВКонтакте">
            <span style={{ fontWeight: 700, color: "#0077FF" }}>VK</span>
          </button>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Ссылка скопирована!");
          }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4 }} title="Скопировать ссылку">
            <Share2 size={14} />
          </button>
        </div>
      </div>"""

pc = pc.replace(old_tags_end, new_tags_end)
print('4. Share buttons: OK')

with open(post_client, 'w') as f:
    f.write(pc)

print('ALL DONE')
