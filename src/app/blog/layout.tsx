export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Блог Карты роста",
            description: "AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста.",
            url: "https://proektmap.ru/blog",
            publisher: {
              "@type": "Organization",
              name: "Карта роста",
              url: "https://proektmap.ru",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
