import type { Metadata } from "next";
import "@/styles/tokens.css";
import GlobalHeader from "@/components/layout/header";
import GlobalFooter from "@/components/layout/footer";
import StreakBanner from "@/components/layout/streak-banner";
import CookieConsent from "@/components/cookie-consent";

export const metadata: Metadata = {
  title: "Карта роста — AI-инженерный навигатор",
  description: "Школа AI-инженеров. Научись создавать проекты с помощью AI.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Карта роста" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <GlobalHeader />
        <StreakBanner />
        <main style={{ flex: 1 }}>{children}</main>
        <GlobalFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
