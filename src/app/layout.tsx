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
import { SessionProvider } from "@/components/session-provider";
import KnowledgeProvider from "@/components/knowledge/knowledge-provider";

export const metadata: Metadata = {
  title: {
    default: "Создание сайтов, SaaS и Telegram-ботов с помощью ИИ — ProektMap",
    template: "%s — ProektMap",
  },
  description: "Конструктор цифровых проектов на ИИ: создавайте сайты, Telegram-ботов, CRM-системы, SaaS и другие цифровые продукты. Готовые Blueprint, инструменты, решения и реальные кейсы.",
  keywords: ["создать сайт", "создать телеграм бота", "создать saas", "создать crm", "конструктор проектов", "разработка с ии", "blueprint", "cursor инструкция", "claude code"],
  authors: [{ name: "Тимофеев Алексей Геннадьевич" }],
  creator: "Тимофеев Алексей",
  publisher: "ИП Тимофеев А.Г.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://proektmap.ru", types: { "application/rss+xml": "https://proektmap.ru/blog/rss.xml" } },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "ProektMap",
    title: "Создание сайтов, SaaS и Telegram-ботов с помощью ИИ — ProektMap",
    description: "Конструктор цифровых проектов на ИИ: сайты, Telegram-боты, CRM, SaaS. Готовые Blueprint, инструменты и реальные кейсы.",
    url: "https://proektmap.ru",
    images: [{ url: "https://proektmap.ru/api/og?title=Создавайте+цифровые+продукты+с+ИИ&category=ProektMap&author=Конструктор+проектов", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Создание сайтов, SaaS и Telegram-ботов с помощью ИИ — ProektMap",
    description: "Конструктор цифровых проектов на ИИ: сайты, Telegram-боты, CRM, SaaS. Готовые Blueprint и реальные кейсы.",
    images: ["https://proektmap.ru/api/og?title=Создавайте+цифровые+продукты+с+ИИ&category=ProektMap&author=Конструктор+проектов"],
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
        <meta name="google-site-verification" content="smmoUXndmRCwowjp1qQ9LVbQlqtbZwFUoNg5GxlVz6E" />
        <DesignTokens />
        <AnalyticsScripts />
        <link rel="alternate" href="https://proektmap.ru" hrefLang="ru" />
        <link rel="alternate" href="https://proektmap.ru" hrefLang="x-default" />
        {/* Schema.org — Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ProektMap",
              alternateName: "Конструктор цифровых проектов",
              url: "https://proektmap.ru",
              description: "Конструктор цифровых проектов на ИИ: создавайте сайты, Telegram-ботов, CRM-системы, SaaS и другие цифровые продукты. Готовые Blueprint, инструменты, решения и реальные кейсы.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://proektmap.ru/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <SessionProvider>
          <GlobalHeader />
          <StreakBanner />
          <main style={{ flex: 1 }}>{children}</main>
          <BlueprintProgressBar />
          <GlobalFooter />
          <AssistantWrapper />
          <CookieConsent />
          <KnowledgeProvider />
        </SessionProvider>
        <AnalyticsFooter />
      </body>
    </html>
  );
}
