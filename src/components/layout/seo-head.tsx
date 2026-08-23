import { headers } from "next/headers";

export async function SeoHead() {
  const headersList = await headers();
  const host = headersList.get("host") || "proektmap.ru";
  const url = `https://${host}`;

  return (
    <>
      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Meta Robots */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ProektMap" />
      <meta property="og:title" content="ProektMap — конструктор цифровых проектов с ИИ" />
      <meta property="og:description" content="Создавайте сайты, Telegram-ботов, CRM-системы, SaaS с помощью ИИ. Готовые Blueprint, инструменты, решения и реальные кейсы." />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:image" content={`${url}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ProektMap — конструктор цифровых проектов с ИИ" />
      <meta name="twitter:description" content="Создавайте сайты, Telegram-ботов, CRM-системы, SaaS с помощью ИИ. Готовые Blueprint и реальные кейсы." />
      <meta name="twitter:image" content={`${url}/og-image.png`} />
    </>
  );
}
