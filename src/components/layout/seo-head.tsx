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
      <meta property="og:site_name" content="Карта роста" />
      <meta property="og:title" content="Карта роста — AI-инженерный навигатор" />
      <meta property="og:description" content="Школа AI-инженеров. Научись создавать проекты с помощью AI. Готовые промпты и персональный AI-консультант." />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:image" content={`${url}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Карта роста — AI-инженерный навигатор" />
      <meta name="twitter:description" content="Школа AI-инженеров. Научись создавать проекты с помощью AI." />
      <meta name="twitter:image" content={`${url}/og-image.png`} />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Карта роста",
            description: "Школа AI-инженеров. Инженерный навигатор с готовыми промптами.",
            url: url,
            founder: {
              "@type": "Person",
              name: "Тимофеев Алексей Геннадьевич",
            },
            knowsAbout: ["AI-инжиниринг", "Vibe Coding", "Next.js", "Веб-разработка"],
            offers: {
              "@type": "Offer",
              price: "300",
              priceCurrency: "RUB",
              description: "Pro подписка на AI-консультанта",
            },
          }),
        }}
      />
    </>
  );
}
