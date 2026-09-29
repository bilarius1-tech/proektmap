import HubNav from "./hub-nav";
import { getHeaderMenu } from "@/lib/nav/get-header-menu";

export default async function HubSidebar() {
  const items = await getHeaderMenu();
  if (items.length === 0) return null;
  return (
    <aside className="hub-sidebar" aria-label="Навигация по хабу">
      <HubNav items={items} />
    </aside>
  );
}
