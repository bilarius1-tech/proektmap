import type { Metadata } from "next";
import Image from "next/image";
import BackLink from "@/components/vaibik/back-link";
import { Globe, Send } from "lucide-react";

const AUTHOR = {
  name: "Тимофеев Алексей",
  role: "Автор и дизайнер",
  site: "https://proektmap.ru",
  telegram: "https://t.me/bilarius",
  photo: "/vaibik/assets/author-photo.jpg",
};

export const metadata: Metadata = {
  title: "Контакты — «Вайбик: Миссия №1»",
  description:
    "Свяжись с автором квеста «Вайбик: Миссия №1» Тимофеевым Алексеем: сайт proektmap.ru и Телеграм @bilarius.",
};

export default function ContactsPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 py-14">
      <div className="absolute inset-0 cosmic-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <BackLink />
        </div>

        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-indigo-400/40 to-fuchsia-400/30 blur-2xl" />
            <Image
              src={AUTHOR.photo}
              alt={`Фото ${AUTHOR.name}`}
              width={2400}
              height={1792}
              className="relative h-36 w-36 rounded-full border-2 border-indigo-300/40 object-cover shadow-[0_0_40px_-8px_rgba(124,108,240,0.8)] sm:h-44 sm:w-44"
            />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {AUTHOR.name}
          </h1>
          <p className="mt-2 text-lg text-indigo-100/80">{AUTHOR.role}</p>
        </div>

        <div className="mt-10 grid gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <a
            href={AUTHOR.site}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl border border-white/15 bg-slate-900/70 px-6 py-5 backdrop-blur-md transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg">
              <Globe className="h-6 w-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-bold text-white">Мой сайт</span>
              <span className="text-sm text-indigo-100/70">proektmap.ru</span>
            </div>
          </a>

          <a
            href={AUTHOR.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl border border-white/15 bg-slate-900/70 px-6 py-5 backdrop-blur-md transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg">
              <Send className="h-6 w-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-bold text-white">Телеграм</span>
              <span className="text-sm text-indigo-100/70">@bilarius</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
