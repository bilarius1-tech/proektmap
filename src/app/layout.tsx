import type { Metadata } from "next";
import "@/app/globals.css";
import "@/styles/tokens.css";
import GlobalHeader from "@/components/layout/header";
import BlueprintProgressBar from "@/components/layout/blueprint-progress-bar";
import GlobalFooter from "@/components/layout/footer";
import StreakBanner from "@/components/layout/streak-banner";
import AssistantWrapper from "@/components/assistant/assistant-wrapper";
import DesignTokens from "@/components/design/design-tokens";
import CookieConsent from "@/components/cookie-consent";
import AnalyticsScripts, { AnalyticsFooter } from "@/components/analytics";

export const metadata: Metadata = {
  title: {
    default: "Школа AI-инженеров: создай проект с нуля с помощью ИИ — Карта роста",
    template: "%s — Карта роста",
  },
  description: "Школа AI-инженеров: обучение vibe coding, готовые промпты, 12 этапов разработки. Создай сайт за 1 час с помощью искусственного интеллекта. Персональный AI-консультант.",
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
    title: "Школа AI-инженеров: создай проект с нуля с помощью ИИ",
    description: "Обучение vibe coding: готовые промпты, 12 этапов, AI-консультант. От идеи до сайта за 1 час.",
    url: "https://proektmap.ru",
    images: [{ url: "https://proektmap.ru/api/og?title=Школа+AI-инженеров&category=ProektMap&author=Карта+роста", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Школа AI-инженеров: создай проект с нуля с помощью ИИ",
    description: "Обучение vibe coding: готовые промпты, 12 этапов, AI-консультант. От идеи до сайта за 1 час.",
    images: ["https://proektmap.ru/api/og?title=Школа+AI-инженеров&category=ProektMap&author=Карта+роста"],
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Onest:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0fb880" />
        <DesignTokens />
        <AnalyticsScripts />
        {/* Hreflang */}
        <link rel="alternate" href="https://proektmap.ru" hrefLang="ru" />
        <link rel="alternate" href="https://proektmap.ru" hrefLang="x-default" />
      </head>
      <body suppressHydrationWarning style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <GlobalHeader />
        <StreakBanner />
        <main style={{ flex: 1 }}>{children}</main>
        <BlueprintProgressBar />
        <GlobalFooter />
        <AssistantWrapper />
        <CookieConsent />
        <AnalyticsFooter />
      </body>
    </html>
  );
}
