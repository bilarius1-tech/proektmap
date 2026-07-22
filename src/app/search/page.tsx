import SearchPage from "./client";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Поиск по ProektMap",
  description: "Умный поиск по глоссарию, паттернам, MCP-серверам, AI-инструментам, блогу и промптам.",
};
export default function Page() {
  return <SearchPage />;
}
