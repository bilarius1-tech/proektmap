import SitemapClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Карта сайта — ProektMap",
  description: "Все 15 модулей экосистемы ProektMap. Готовые решения AI, паттерны, промпты, MCP-серверы, AI-инструменты, глоссарий, блог и другие.",
};
export default function Page() {
  return <SitemapClient />;
}
