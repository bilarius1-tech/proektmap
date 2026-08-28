import type { Metadata } from "next";
import CapabilityMapClient from "./capability-map-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Карта способностей создателя — ProektMap Skills",
  description: "Инженерный профиль создателя цифровых продуктов: карта компетенций, подтверждённых артефактами в готовых решениях ProektMap.",
  alternates: { canonical: "https://proektmap.ru/skills" },
};

export default function SkillsPage() {
  return (
    <main style={{ background: "var(--color-bg-primary, #fafafa)", minHeight: "100vh" }}>
      <CapabilityMapClient />
    </main>
  );
}
