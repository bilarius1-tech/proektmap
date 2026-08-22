import type { Metadata } from "next";
import ScrollFilm from "@/components/demo/ScrollFilm";

export const metadata: Metadata = {
  title: "Scroll-фильм — демо",
  description: "Демо scroll-лендинга «сайт-фильм»: скролл управляет камерой через 5 сцен. Next.js + GSAP ScrollTrigger + Lenis.",
  robots: { index: false, follow: false },
};

export default function ScrollFilmPage() {
  return <ScrollFilm />;
}
