// @ts-nocheck
"use client";

import { LogoMarquee } from "@/components/originkit/ui/hero-22/logo-marquee";
import { NeuralDiagram } from "@/components/originkit/ui/hero-22/neural-diagram";

/** Public asset under /sections/hero-22/assets */
function asset(file: string) {
  return `/originkit/hero-22/${file}`;
}

/** Desktop nav — Figma 2288:13181; "Solutions" is the active item. */
const NAV_LINKS = [
  { label: "Platform", active: false },
  { label: "Solutions", active: true },
  { label: "Architecture", active: false },
  { label: "Resources", active: false },
  { label: "Contact", active: false },
];

/**
 * Figma "iPhone 16 & 17 Pro - 32" (2288:9670).
 *
 * The frame stacks its blocks top to bottom, and every block Figma gives
 * auto-layout to (nav, hero, trusted strip) is built with flex here. Only the
 * edge textures and the neural diagram stay absolutely placed — those are the
 * nodes Figma itself positions absolutely.
 *
 * Vertical rhythm from the frame: nav 56 -> hero at y100 (44 gap) -> hero ends
 * y382 -> diagram block 423 tall -> trusted strip at y805.
 */
export const Section27Hero = () => (
  <main className="w-full bg-[#0b0b0c]">
    <div className="relative flex w-full min-w-[402px] flex-col items-center overflow-hidden bg-[#0b0b0c]">
      {/* Nav — Figma 2288:9671 (mobile) / 2288:13174 (desktop) */}
      <nav className="z-20 w-full bg-white">
        <div className="mx-auto flex h-14 w-full items-center justify-between p-4 ipad:px-12 desktop-sm:h-[67px] desktop-sm:max-w-[1223px] desktop-sm:px-[10px] desktop-sm:py-[10px]">
          <a href="#home" className="block h-[18.535px] w-[90px]">
            <img
              src={asset("wordmark.svg")}
              alt="Aurra"
              className="block size-full max-w-none"
            />
          </a>

          {/* desktop links + actions */}
          <div className="hidden items-center gap-10 desktop-sm:flex">
            <ul className="flex items-center gap-7 font-geist text-[15px] leading-[1.5] font-medium tracking-[-0.3px] whitespace-nowrap">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={`#${link.label.toLowerCase()}`}
                    className={`transition-opacity duration-200 ease-out [@media(hover:hover)]:hover:opacity-70 ${
                      link.active ? "text-[#0b0b0c]" : "text-[#424643]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-start gap-[10px]">
              <a
                href="#sign-in"
                className="flex cursor-pointer items-center justify-center rounded-[1px] bg-[#0b0b0c] px-8 py-3 font-geist text-[15px] leading-[1.5] font-semibold tracking-[-0.3px] whitespace-nowrap text-white transition-opacity duration-200 ease-out [@media(hover:hover)]:hover:opacity-85"
              >
                Sign in
              </a>
              <a
                href="#access"
                className="flex cursor-pointer items-center justify-center rounded-[1px] border border-solid border-[#0b0b0c] bg-white px-8 py-3 font-geist text-[15px] leading-[1.5] font-medium tracking-[-0.3px] whitespace-nowrap text-[#0b0b0c] transition-colors duration-200 ease-out [@media(hover:hover)]:hover:bg-[#f2f2f2]"
              >
                Request Access
              </a>
            </div>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            className="size-6 desktop-sm:hidden"
          >
            <img
              src={asset("menu.svg")}
              alt=""
              className="block size-6 max-w-none"
            />
          </button>
        </div>
      </nav>

      {/* Edge textures — Figma 2288:9679 / 2288:9680. Noise fill drawn at
          600 x 621.6 from the top-left at 7% opacity, ruled on both edges so
          each strip reads as a channel. Pinned to the screen edges, with the
          stage held at 402 minimum so they never ride over the node pills. */}
      {["left-0", "right-0"].map((side) => (
        <span
          key={side}
          aria-hidden
          className={`pointer-events-none absolute top-14 z-0 block h-[817px] w-4 border-x border-solid border-[#19191a] ipad:h-[1077px] ipad:w-8 desktop-sm:h-[817px] desktop-sm:w-[38px] ${side}`}
        >
          <span
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url(${asset("texture.png")})`,
              backgroundSize: "600px 621.6px",
              backgroundPosition: "top left",
            }}
          />
        </span>
      ))}

      {/* Headline + CTAs — Figma 2288:9681, auto-layout column, gap 24, px 8 */}
      <section className="z-20 mt-11 flex w-[367px] flex-col items-center gap-6 px-2 ipad:mt-[74px] ipad:w-[603px] desktop-sm:mt-16 ipad:gap-[50px] ipad:p-[10px]">
        <div className="flex w-full flex-col items-center gap-4 ipad:gap-0">
          <h1 className="relative h-24 w-full text-center font-geist text-[40px] leading-[48px] font-medium tracking-[-0.8px] text-white ipad:h-[58px] ipad:text-[48px] ipad:leading-[57.6px] ipad:tracking-[-0.96px] ipad:whitespace-nowrap">
            <img
              src={asset("highlight.svg")}
              alt=""
              aria-hidden
              className="absolute top-[48px] right-[58px] block h-[53px] w-[131px] max-w-none ipad:top-0 ipad:right-[-0.5px] ipad:h-[58px] ipad:w-[154px]"
            />
            <span className="relative">Systems That Think </span>
            <span className="relative font-canela-deck font-medium leading-[48px] text-[#0b0b0c] [font-synthesis:none]">
              Ahead.
            </span>
          </h1>

          <p className="w-[307px] text-center font-geist text-[16px] leading-[1.5] font-medium tracking-[-0.32px] text-[#aaadac] ipad:w-full ipad:text-[17px] ipad:tracking-[-0.34px]">
            AI infrastructure for autonomous decisions and realtime
            intelligence.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-5 ipad:w-auto ipad:flex-row ipad:items-start">
          <a
            href="#explore"
            className="group flex w-full max-w-[323px] cursor-pointer items-center justify-center gap-1 rounded-[1px] bg-white py-2 pr-2 pl-5 shadow-[2px_2px_0px_0px_#0b0b0c,3px_3px_0px_0px_white] transition-[transform,box-shadow] duration-200 ease-out ipad:w-auto [@media(hover:hover)]:hover:-translate-x-px [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:shadow-[3px_3px_0px_0px_#0b0b0c,5px_5px_0px_0px_white] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_0px_#0b0b0c,2px_2px_0px_0px_white]"
          >
            <span className="font-geist text-[15px] leading-[1.5] font-semibold tracking-[-0.3px] whitespace-nowrap text-[#0b0b0c]">
              Explore System
            </span>
            <span className="relative block size-[23px] shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5">
              <img
                src={asset("arrow.svg")}
                alt=""
                className="absolute top-0 left-1/2 block h-[23px] w-[11.5px] max-w-none -translate-x-1/2"
              />
            </span>
          </a>

          <a
            href="#preview"
            className="flex w-full max-w-[323px] cursor-pointer items-center justify-center rounded-[1px] bg-white/5 px-5 py-2 shadow-[2px_2px_0px_0px_#0b0b0c,3px_3px_0px_0px_#171718] transition-[transform,box-shadow,background-color] duration-200 ease-out ipad:w-auto [@media(hover:hover)]:hover:-translate-x-px [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:bg-white/10 [@media(hover:hover)]:hover:shadow-[3px_3px_0px_0px_#0b0b0c,5px_5px_0px_0px_#171718] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_0px_#0b0b0c,2px_2px_0px_0px_#171718]"
          >
            <span className="font-geist text-[15px] leading-[1.5] font-semibold tracking-[-0.3px] whitespace-nowrap text-white">
              Live Preview
            </span>
          </a>
        </div>
      </section>

      {/* Head, nodes and connectors */}
      <div className="z-10">
        <NeuralDiagram />
      </div>

      {/* Trusted strip — Figma 2288:13045, auto-layout column, gap 28 */}
      <section className="z-20 flex w-full flex-col items-center gap-7 overflow-hidden bg-white px-4 py-8 ipad:px-0 ipad:py-10">
        <p className="w-[232px] text-center font-geist text-[15px] leading-[1.4] font-medium text-[#646568] ipad:w-full">
          TRUSTED BY 180+ PRODUCT COMPANY WORLD WIDE
        </p>
        <LogoMarquee />
      </section>
    </div>
  </main>
);
