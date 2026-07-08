import type { Metadata } from "next";
import "@/styles/tokens.css";
import GlobalHeader from "@/components/layout/header";
import GlobalFooter from "@/components/layout/footer";
import StreakBanner from "@/components/layout/streak-banner";
import GearAssistant from "@/components/assistant/gear-assistant";
import CookieConsent from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: {
    default: "Карта роста — AI-инженерный навигатор",
    template: "%s — Карта роста",
  },
  description: "Школа AI-инженеров. Научись создавать проекты с помощью AI. Готовые промпты, 12 этапов, персональный AI-консультант.",
  keywords: ["AI-инжиниринг", "vibe coding", "Next.js", "обучение", "разработка", "промпты"],
  authors: [{ name: "Тимофеев Алексей Геннадьевич" }],
  creator: "Тимофеев Алексей",
  publisher: "ИП Тимофеев А.Г.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://proektmap.ru" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Карта роста",
    title: "Карта роста — AI-инженерный навигатор",
    description: "Школа AI-инженеров. Научись создавать проекты с помощью AI.",
    url: "https://proektmap.ru",
  },
  twitter: {
    card: "summary_large_image",
    title: "Карта роста — AI-инженерный навигатор",
    description: "Школа AI-инженеров. Научись создавать проекты с помощью AI.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0fb880" />
        {/* Hreflang */}
        <link rel="alternate" href="https://proektmap.ru" hrefLang="ru" />
        <link rel="alternate" href="https://proektmap.ru" hrefLang="x-default" />
      </head>
      <body suppressHydrationWarning style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <GlobalHeader />
        <StreakBanner />
        <main style={{ flex: 1 }}>{children}</main>
        <GlobalFooter />
        <GearAssistant />
        <CookieConsent />
      </body>
    </html>
  );
}
