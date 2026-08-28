// @ts-nocheck
"use client";

/** Public asset under /sections/hero-22/assets */
function asset(file: string) {
  return `/originkit/hero-22/${file}`;
}

/**
 * Trusted-by logo strip — Figma "Frame 25" (2288:13047).
 *
 * The seven cells scroll continuously. The track holds two identical copies of
 * the list and translates by exactly -50%, so the moment the first copy leaves
 * the viewport the second sits pixel-for-pixel where it started — the loop has
 * no visible reset. Edges are faded with a mask so logos dissolve rather than
 * clip.
 */

type Logo = { src: string; width: number; height: number; alt: string };

/** Cell sizes come straight from each Figma logo node. */
const LOGOS: Logo[] = [
  { src: asset("logos/logo-1.svg"), width: 98, height: 18, alt: "" },
  { src: asset("logos/logo-2.svg"), width: 78.75, height: 18.75, alt: "" },
  { src: asset("logos/logo-4.svg"), width: 108, height: 53, alt: "" },
  { src: asset("logos/logo-5.svg"), width: 108, height: 53, alt: "" },
  { src: asset("logos/logo-6.svg"), width: 93, height: 14, alt: "" },
  { src: asset("logos/logo-7.svg"), width: 51.25, height: 18.75, alt: "" },
];

const EDGE_MASK =
  "linear-gradient(to right, transparent 0, #000 8%, #000 92%, transparent 100%)";

export const LogoMarquee = () => (
  <div
    className="relative w-full overflow-hidden"
    style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
  >
    <div className="flex w-max animate-logo-marquee items-center will-change-transform">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className="flex shrink-0 items-center"
          aria-hidden={copy === 1}
        >
          {LOGOS.map((logo) => (
            <span
              key={`${copy}-${logo.src}`}
              className="flex h-[52.5px] w-[107.714px] shrink-0 items-center justify-center ipad:w-[132.571px] desktop-sm:h-[70px] desktop-sm:w-[220.5px]"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={
                  {
                    "--w": `${logo.width}px`,
                    "--h": `${logo.height}px`,
                    "--w-d": `${logo.width * 1.3333}px`,
                    "--h-d": `${logo.height * 1.3333}px`,
                  } as React.CSSProperties
                }
                className="block h-[var(--h)] w-[var(--w)] max-w-none desktop-sm:h-[var(--h-d)] desktop-sm:w-[var(--w-d)]"
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
