// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";

import ParticleImage from "@/components/originkit/ui/hero-22/svg-particle";

/** Public asset under /sections/hero-22/assets */
function asset(file: string) {
  return `/originkit/hero-22/${file}`;
}

/**
 * Head, brain and labelled nodes — Figma 2288:9696 (mobile) and 2288:6221 /
 * 2288:6203 (iPad).
 *
 * The halftone head is rendered live by the particle field (sampling
 * Vector.png, the head silhouette); the brain sits on top of it, and each pill
 * connects to its node dot.
 *
 * These are the only nodes Figma positions absolutely, so they keep absolute
 * coordinates, re-based to this block: the mobile frame places it at y382, the
 * iPad frame at y323, so each Figma y is the original minus that.
 *
 * The layout changes shape between breakpoints — mobile stacks the pills above
 * the head, iPad pushes them out to the sides — so both geometries are held as
 * data and swapped with CSS variables.
 */

type Box = { left: number; top: number; width: number; height: number };

/**
 * The particle canvas is exactly its container, so scattered particles are
 * clipped at the head's own box. Widening the box gives them room to fly; the
 * artwork keeps its size because `scale` is divided by the same factor.
 */
const SCATTER_PAD = 1.6;
/** `scale` 10 = 100% of the contain-fit, so 10 / pad holds the art steady. */
const SCATTER_SCALE = 10 / SCATTER_PAD;

const padBox = (box: Box): Box => ({
  left: box.left - (box.width * (SCATTER_PAD - 1)) / 2,
  top: box.top - (box.height * (SCATTER_PAD - 1)) / 2,
  width: box.width * SCATTER_PAD,
  height: box.height * SCATTER_PAD,
});

/** Head group — mobile 2288:9696 at (83, 507); iPad 2288:6221 at (241, 395). */
const HEAD: Box = { left: 83, top: 125, width: 236.264, height: 298.5 };
const HEAD_TABLET: Box = { left: 241, top: 72, width: 261.194, height: 330 };
/** Desktop — Figma 2288:13213 at (562.99, 394); that block starts at y324. */
const HEAD_DESKTOP: Box = {
  left: 562.99,
  top: 70,
  width: 315.018,
  height: 398,
};

/** Brain — Figma "image 18649", offset inside the head group. */
const BRAIN: Box = {
  left: HEAD.left + 13.3,
  top: HEAD.top + 16,
  width: 183.75,
  height: 156.75,
};
const BRAIN_TABLET: Box = {
  left: HEAD_TABLET.left + 14.7,
  top: HEAD_TABLET.top + 17.7,
  width: 203.14,
  height: 173.291,
};
const BRAIN_DESKTOP: Box = {
  left: HEAD_DESKTOP.left + 17.7,
  top: HEAD_DESKTOP.top + 21.3,
  width: 245,
  height: 209,
};

type Node = {
  label: string;
  color: string;
  pill: { left: number; top: number; width: number };
  pillTablet: { left: number; top: number; width: number };
  pillDesktop: { left: number; top: number; width: number };
  /** Dot is 19.5px on mobile, 21.558px on iPad. */
  dot: { left: number; top: number };
  dotTablet: { left: number; top: number };
  dotDesktop: { left: number; top: number };
  /** Mobile connector: its own box plus the coloured and backing paths. */
  connector: Box & { path: string; shadow: string };
  /**
   * iPad connector, drawn in block space: a horizontal run out of the pill and
   * a short diagonal into the dot, matching Figma 2288:9553-9558.
   */
  connectorTablet: { path: string };
  connectorDesktop: { path: string };
};

const NODES: Node[] = [
  {
    label: "Vibe Coding & Cursor",
    color: "#0fb880",
    pill: { left: 147, top: 40, width: 135 },
    pillTablet: { left: 72, top: 73.5, width: 155 },
    pillDesktop: { left: 360, top: 69, width: 175 },
    dot: { left: 195, top: 163 },
    dotTablet: { left: 358.22, top: 112.24 },
    dotDesktop: { left: 713, top: 111 },
    connector: {
      left: 204.34,
      top: 71,
      width: 16.4056,
      height: 102.364,
      path: "M15.6556 0V75L0.655616 102",
      shadow: "M14.6556 0V74.5L1.15562 101",
    },
    connectorTablet: { path: "M200.6 89.75H342.5L369 123" },
    connectorDesktop: { path: "M526 88.5H699L726 124" },
  },
  {
    label: "MCP & AI-Агенты",
    color: "#746ffc",
    pill: { left: 25, top: 85, width: 130 },
    pillTablet: { left: 58, top: 145, width: 150 },
    pillDesktop: { left: 328, top: 165, width: 170 },
    dot: { left: 161.5, top: 220.75 },
    dotTablet: { left: 293, top: 181 },
    dotDesktop: { left: 609, top: 208 },
    connector: {
      left: 98.4,
      top: 115.53,
      width: 73.5876,
      height: 116.483,
      path: "M72.8376 114.969V89.4687L1.58757 0.468722",
      shadow: "M72.0876 116.469V89.9687L0.58757 0.468722",
    },
    connectorTablet: { path: "M199.6 161.25H277.3L303.8 191.8" },
    connectorDesktop: { path: "M496 184.5H595L622 221" },
  },
  {
    label: "Fullstack SaaS & Боты",
    color: "#f59e0b",
    pill: { left: 249, top: 92, width: 140 },
    pillTablet: { left: 534, top: 156, width: 160 },
    pillDesktop: { left: 983, top: 130, width: 185 },
    dot: { left: 220, top: 204.75 },
    dotTablet: { left: 357, top: 188.41 },
    dotDesktop: { left: 767, top: 174 },
    connector: {
      left: 230.5,
      top: 122.42,
      width: 77.9827,
      height: 93.5766,
      path: "M0.75 92.0766V63.5766L76.5 0.576634",
      shadow: "M2 93.5766V64.0766L77.5 0.576634",
    },
    connectorTablet: { path: "M534 172.25H394.3L367.8 199.2" },
    connectorDesktop: { path: "M983 149.5H807L780 187" },
  },
];

/** Background arcs — Figma 2288:6204 / 6205, iPad only. */
const ARCS = [
  {
    id: "arc-wide",
    box: { left: -157, top: 66, width: 1059.65, height: 357.622 },
    boxDesktop: { left: 86, top: 73, width: 1255, height: 423 },
    viewBox: "0 0 1059.65 357.622",
    path: "M0.324945 357.36C0.324945 357.36 289.716 -0.340318 531.513 0.423133C772.18 1.18302 1059.32 357.36 1059.32 357.36",
  },
  {
    id: "arc-inner",
    box: { left: 75.89, top: 66, width: 593.968, height: 342.348 },
    boxDesktop: { left: 362, top: 66, width: 703, height: 405 },
    viewBox: "0 0 593.968 342.348",
    path: "M0.379579 342.171C0.379579 342.171 162.484 -0.307883 297.929 0.423081C432.741 1.15063 593.588 342.171 593.588 342.171",
  },
];

/**
 * Waypoint dots sitting on the arcs — Figma 2288:6212-6215 (iPad) and
 * 2288:13169-13172 (desktop): r4 #C8C8CC with a 2px #0B0B0C ring.
 */
const ARC_DOTS = [
  {
    id: "arc-dot-1",
    tablet: { left: 643.79, top: 362.18 },
    desktop: { left: 1035, top: 417 },
  },
  {
    id: "arc-dot-2",
    tablet: { left: 626.91, top: 169.79 },
    desktop: { left: 1015, top: 189 },
  },
  {
    id: "arc-dot-3",
    tablet: { left: 176.31, top: 222.95 },
    desktop: { left: 481, top: 252 },
  },
  {
    id: "arc-dot-4",
    tablet: { left: -36.33, top: 292.14 },
    desktop: { left: 229, top: 334 },
  },
];

/** Both geometries as CSS variables; the ipad: variants pick the second set. */
const boxVars = (mobile: Box, tablet: Box, desktop: Box) =>
  ({
    "--l": `${mobile.left}px`,
    "--t": `${mobile.top}px`,
    "--w": `${mobile.width}px`,
    "--h": `${mobile.height}px`,
    "--l-i": `${tablet.left}px`,
    "--t-i": `${tablet.top}px`,
    "--w-i": `${tablet.width}px`,
    "--h-i": `${tablet.height}px`,
    "--l-d": `${desktop.left}px`,
    "--t-d": `${desktop.top}px`,
    "--w-d": `${desktop.width}px`,
    "--h-d": `${desktop.height}px`,
  }) as React.CSSProperties;

const BOX_CLASS =
  "absolute top-[var(--t)] left-[var(--l)] h-[var(--h)] w-[var(--w)] ipad:top-[var(--t-i)] ipad:left-[var(--l-i)] ipad:h-[var(--h-i)] ipad:w-[var(--w-i)] desktop-sm:top-[var(--t-d)] desktop-sm:left-[var(--l-d)] desktop-sm:h-[var(--h-d)] desktop-sm:w-[var(--w-d)]";

export const NeuralDiagram = () => {
  const blockRef = useRef<HTMLDivElement>(null);
  /** Hover assembly is a desktop affordance; touch has no hover to give. */
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /**
   * The particle field only assembles while its own canvas is hovered, and the
   * canvas is offset inside a padded box. Entering the diagram block forwards a
   * mousemove to the canvas centre; leaving forwards a mouseout — so the
   * component runs its own assemble/scatter transitions rather than being
   * re-initialised, and the hover area is the diagram itself, not the page.
   */
  useEffect(() => {
    const block = blockRef.current;
    if (!block || !isDesktop) return;

    const canvas = () => block.querySelector("canvas");

    const assemble = () => {
      const target = canvas();
      if (!target) return;
      const box = target.getBoundingClientRect();
      target.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: box.left + box.width / 2,
          clientY: box.top + box.height / 2,
          bubbles: true,
        }),
      );
    };

    const scatter = () => {
      // React synthesises onMouseLeave from a native mouseout whose
      // relatedTarget sits outside the element; a dispatched "mouseleave"
      // never reaches it, which is why the field stayed assembled.
      canvas()?.dispatchEvent(
        new MouseEvent("mouseout", {
          bubbles: true,
          relatedTarget: document.body,
        }),
      );
    };

    block.addEventListener("pointerenter", assemble);
    block.addEventListener("pointerleave", scatter);
    return () => {
      block.removeEventListener("pointerenter", assemble);
      block.removeEventListener("pointerleave", scatter);
    };
  }, [isDesktop]);

  return (
    <div
      ref={blockRef}
      className="relative h-[423px] w-[402px] max-w-none shrink-0 ipad:h-[402px] ipad:w-[744px] desktop-sm:h-[468px] desktop-sm:w-[1440px]"
    >
      {/* Background arcs — iPad only */}
      {ARCS.map((arc) => (
        <svg
          key={arc.id}
          aria-hidden
          className="pointer-events-none absolute top-[var(--t-i)] left-[var(--l-i)] hidden h-[var(--h-i)] w-[var(--w-i)] ipad:block desktop-sm:top-[var(--t-d)] desktop-sm:left-[var(--l-d)] desktop-sm:h-[var(--h-d)] desktop-sm:w-[var(--w-d)]"
          style={
            {
              "--l-i": `${arc.box.left}px`,
              "--t-i": `${arc.box.top}px`,
              "--w-i": `${arc.box.width}px`,
              "--h-i": `${arc.box.height}px`,
              "--l-d": `${arc.boxDesktop.left}px`,
              "--t-d": `${arc.boxDesktop.top}px`,
              "--w-d": `${arc.boxDesktop.width}px`,
              "--h-d": `${arc.boxDesktop.height}px`,
            } as React.CSSProperties
          }
          viewBox={arc.viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={arc.path}
            stroke="white"
            strokeOpacity="0.1"
            strokeWidth="0.843825"
          />
        </svg>
      ))}

      {/* Waypoint dots on the arcs — iPad and desktop only */}
      {ARC_DOTS.map((dot) => (
        <span
          key={dot.id}
          aria-hidden
          className="pointer-events-none absolute top-[var(--t-i)] left-[var(--l-i)] hidden size-[8.438px] rounded-full border-[1.688px] border-solid border-[#0b0b0c] bg-[#c8c8cc] ipad:block desktop-sm:top-[var(--t-d)] desktop-sm:left-[var(--l-d)] desktop-sm:size-[10px] desktop-sm:border-2"
          style={
            {
              "--l-i": `${dot.tablet.left}px`,
              "--t-i": `${dot.tablet.top}px`,
              "--l-d": `${dot.desktop.left}px`,
              "--t-d": `${dot.desktop.top}px`,
              backgroundClip: "padding-box",
            } as React.CSSProperties
          }
        />
      ))}

      {/* Halftone head — particle field sampling the silhouette */}
      <div
        className={BOX_CLASS}
        style={boxVars(padBox(HEAD), padBox(HEAD_TABLET), padBox(HEAD_DESKTOP))}
      >
        <ParticleImage
          width="100%"
          height="100%"
          backgroundColor="transparent"
          particleCount={20}
          particleSize={20}
          particleShape="circle"
          particleColor="single"
          singleColor="#d9d9d9"
          hoverEnabled={isDesktop}
          hoverConfig={{
            hoverType: "roam",
            // Default roam area is a rectangle, which reads as a box of dots.
            roamShape: "oval",
            roamOpacity: 0.5,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          // repulsionEnabled
          // repulsionConfig={{
          //   repulsionMode: "random",
          //   repulsionForce: 8,
          //   repulsionRadius: 55,
          // }}
          imageConfig={{
            image: asset("Vector.png"),
            mode: "fit",
            scale: SCATTER_SCALE,
          }}
        />
      </div>

      {/* Brain, over the particle head */}
      <img
        aria-hidden
        src={asset("brain-only.png")}
        alt=""
        className={`${BOX_CLASS} pointer-events-none block max-w-none`}
        style={boxVars(BRAIN, BRAIN_TABLET, BRAIN_DESKTOP)}
      />

      {/* Connectors — mobile: vertical drop into the dot */}
      {NODES.map((node) => (
        <svg
          key={`m-${node.label}`}
          aria-hidden
          className="pointer-events-none absolute overflow-visible ipad:hidden"
          style={{
            left: node.connector.left,
            top: node.connector.top,
            width: node.connector.width,
            height: node.connector.height,
          }}
          viewBox={`0 0 ${node.connector.width} ${node.connector.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={node.connector.shadow} stroke="#0b0b0c" strokeWidth="1.5" />
          <path d={node.connector.path} stroke={node.color} strokeWidth="1.5" />
        </svg>
      ))}

      {/* Connectors — iPad: horizontal run out of the pill, diagonal into the dot */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full ipad:block desktop-sm:hidden"
        viewBox="0 0 744 402"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {NODES.map((node) => (
          <g key={`t-${node.label}`}>
            {/* Dark backing stroke, offset like Figma's paired vector */}
            <path
              d={node.connectorTablet.path}
              stroke="#0b0b0c"
              strokeWidth="1.658"
              transform="translate(1.4 1.4)"
            />
            <path
              d={node.connectorTablet.path}
              stroke={node.color}
              strokeWidth="1.658"
            />
          </g>
        ))}
      </svg>

      {/* Connectors — desktop */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full desktop-sm:block"
        viewBox="0 0 1440 468"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {NODES.map((node) => (
          <g key={`d-${node.label}`}>
            {/* Dark backing stroke, offset like Figma's paired vector */}
            <path
              d={node.connectorDesktop.path}
              stroke="#0b0b0c"
              strokeWidth="2"
              transform="translate(1.7 1.7)"
            />
            <path
              d={node.connectorDesktop.path}
              stroke={node.color}
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>

      {/* Node dots — translucent disc with a 3px black ring */}
      {NODES.map((node) => (
        <span
          key={`dot-${node.label}`}
          aria-hidden
          className="pointer-events-none absolute top-[var(--t)] left-[var(--l)] size-[19.5px] rounded-full border-[3px] border-solid border-black ipad:top-[var(--t-i)] ipad:left-[var(--l-i)] ipad:size-[21.558px] desktop-sm:top-[var(--t-d)] desktop-sm:left-[var(--l-d)] desktop-sm:size-[26px]"
          style={
            {
              "--l": `${node.dot.left}px`,
              "--t": `${node.dot.top}px`,
              "--l-i": `${node.dotTablet.left}px`,
              "--t-i": `${node.dotTablet.top}px`,
              "--l-d": `${node.dotDesktop.left}px`,
              "--t-d": `${node.dotDesktop.top}px`,
              backgroundColor: `${node.color}80`,
              backgroundClip: "padding-box",
            } as React.CSSProperties
          }
        />
      ))}

      {/* Labels */}
      {NODES.map((node) => (
        <div
          key={`pill-${node.label}`}
          className="pointer-events-none absolute top-[var(--t)] left-[var(--l)] flex h-[29px] w-[var(--w)] items-center justify-center gap-1.5 rounded-[0.75px] border-[0.75px] border-solid bg-[#0b0b0c] p-1.5 ipad:top-[var(--t-i)] ipad:left-[var(--l-i)] ipad:h-[32.5px] ipad:w-[var(--w-i)] ipad:gap-[6.751px] ipad:rounded-[0.844px] ipad:border-[0.844px] ipad:px-[10.126px] ipad:py-[6.751px] desktop-sm:top-[var(--t-d)] desktop-sm:left-[var(--l-d)] desktop-sm:h-[39px] desktop-sm:w-[var(--w-d)] desktop-sm:gap-2 desktop-sm:rounded-[1px] desktop-sm:border desktop-sm:px-3 desktop-sm:py-2"
          style={
            {
              "--l": `${node.pill.left}px`,
              "--t": `${node.pill.top}px`,
              "--w": `${node.pill.width}px`,
              "--l-i": `${node.pillTablet.left}px`,
              "--t-i": `${node.pillTablet.top}px`,
              "--w-i": `${node.pillTablet.width}px`,
              "--l-d": `${node.pillDesktop.left}px`,
              "--t-d": `${node.pillDesktop.top}px`,
              "--w-d": `${node.pillDesktop.width}px`,
              borderColor: node.color,
              boxShadow: `1.5px 1.5px 0px 0px #0b0b0c, 2.25px 2.25px 0px 0px ${node.color}`,
            } as React.CSSProperties
          }
        >
          <span
            className="size-[6.75px] shrink-0 ipad:size-[7.594px] desktop-sm:size-[9px]"
            style={{ backgroundColor: node.color }}
          />
          <span
            className="font-geist text-[11.25px] leading-normal font-semibold tracking-[-0.225px] whitespace-nowrap ipad:text-[12.657px] ipad:tracking-[-0.2531px] desktop-sm:text-[15px] desktop-sm:tracking-[-0.3px]"
            style={{ color: node.color }}
          >
            {node.label}
          </span>
        </div>
      ))}
    </div>
  );
};
