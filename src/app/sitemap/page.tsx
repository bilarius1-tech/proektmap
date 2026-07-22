import SitemapClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Карта сайта — ProektMap",
  description: "Все 14 модулей экосистемы ProektMap. Паттерны, промпты, MCP-серверы, AI-инструменты, глоссарий, блог и другие.",
};
export default function Page() {
  return <SitemapClient />;
}
