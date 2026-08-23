import type { Metadata, Viewport } from "next";
import "./vaibik.css";
import { AudioProvider } from "@/components/vaibik/audio-provider";
import SoundToggle from "@/components/vaibik/sound-toggle";
import MusicToggle from "@/components/vaibik/music-toggle";
import ExitButton from "@/components/vaibik/exit-button";
import HomeSiteButton from "@/components/vaibik/home-site-button";
import { Toaster } from "@/components/vaibik/ui/sonner";

const appName = "Вайбик: Миссия №1";
const appDescription =
  "Детский интерактивный квест по вайбкодингу: вместе с роботом Вайбиком юный пользователь придумывает игру, учится составлять промпты и делает первые шаги в мире ИИ.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c6cf0",
};

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
  openGraph: {
    title: appName,
    description: appDescription,
    type: "website",
    locale: "ru_RU",
    siteName: "ProektMap",
    images: [{ url: "/vaibik/assets/quest-splash-1.png", width: 1920, height: 1080, alt: appName }],
  },
};

/**
 * Полноэкранная оболочка поверх шапки/футера ProektMap.
 * CSS Tailwind/shadcn подгружается только в этом разделе.
 */
export default function VaibikLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="vaibik-root dark"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        overflow: "auto",
        background: "#0b1026",
        color: "#fff",
      }}
    >
      <AudioProvider>
        <div className="pointer-events-none fixed left-3 top-3 z-[220] sm:left-5 sm:top-5">
          <div className="pointer-events-auto">
            <HomeSiteButton />
          </div>
        </div>
        <div className="pointer-events-none fixed right-3 top-3 z-[220] flex items-center gap-2 sm:right-5 sm:top-5">
          <div className="pointer-events-auto flex items-center gap-2">
            <SoundToggle />
            <MusicToggle />
            <ExitButton />
          </div>
        </div>
        {children}
        <Toaster />
      </AudioProvider>
    </div>
  );
}
