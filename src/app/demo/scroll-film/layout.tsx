/** Иммерсивный layout: прячем глобальные шапку/подвал на время фильма */
export default function ScrollFilmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body > header,
        body > footer,
        body > main > div:has(+ *),
        [data-streak],
        .streak-banner {
          /* fallback below via sibling selectors if needed */
        }
        /* Root layout wraps: header, streak, main, footer — hide chrome when film route mounts */
        body:has(.sf-film) > header,
        body:has(.sf-film) > footer,
        body:has(.sf-film) [class*="streak"],
        body:has(.sf-film) > div:has(> [data-assistant]),
        body:has(.sf-film) > aside {
          display: none !important;
        }
        body:has(.sf-film) main {
          padding: 0 !important;
          margin: 0 !important;
        }
        body:has(.sf-film) {
          overflow-x: hidden;
        }
        @media (max-width: 700px) {
          .sf-card-chaos, .sf-card-map { display: none !important; }
        }
      `}</style>
      {children}
    </>
  );
}
