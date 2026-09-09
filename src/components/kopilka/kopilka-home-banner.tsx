"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const MagicRings = dynamic(() => import("@/components/react-bits/MagicRings"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "transparent" }} />,
});

export default function KopilkaHomeBanner() {
  return (
    <section style={{ padding: "0 20px", margin: "28px 0 8px" }}>
      <Link
        href="/kopilka"
        style={{
          display: "block",
          maxWidth: 960,
          margin: "0 auto",
          textDecoration: "none",
          color: "inherit",
          borderRadius: 24,
          overflow: "hidden",
          position: "relative",
          minHeight: 220,
          border: "1px solid rgba(15,184,128,0.28)",
          boxShadow: "0 18px 50px rgba(11,18,32,0.18)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
        className="kopilka-home-banner"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 75% 40%, rgba(15,184,128,0.22), transparent 55%), linear-gradient(120deg, #0b1220 0%, #121a2b 55%, #0d1f2a 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.95,
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <MagicRings
            color="#0FB880"
            colorTwo="#42fcff"
            ringCount={7}
            speed={0.85}
            attenuation={12}
            lineThickness={2.2}
            baseRadius={0.28}
            radiusStep={0.09}
            scaleRate={0.12}
            opacity={0.9}
            noiseAmount={0.08}
            rotation={12}
            ringGap={1.45}
            fadeIn={0.65}
            fadeOut={0.55}
            followMouse
            mouseInfluence={0.18}
            hoverScale={1.15}
            parallax={0.06}
            clickBurst={false}
            alphaMode="luminance"
          />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "36px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 520,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
              padding: "5px 12px",
              borderRadius: 999,
              background: "rgba(15,184,128,0.18)",
              color: "#6ee7b7",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <Sparkles size={14} /> Новое · Копилка
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-heading, Inter, sans-serif)",
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "#fff",
            }}
          >
            Копилка AI элементов и сайтов
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 440,
            }}
          >
            Создавайте и организуйте агентов прямо рядом с проектами, совещаниями и подключенными
            приложениями вашей команды.
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
              marginTop: 4,
              padding: "12px 18px",
              borderRadius: 14,
              background: "#0FB880",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              boxShadow: "0 8px 24px rgba(15,184,128,0.4)",
            }}
          >
            Открыть копилку <ArrowRight size={16} />
          </span>
        </div>
      </Link>
      <style>{`
        .kopilka-home-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 56px rgba(11,18,32,0.28);
        }
        @media (max-width: 640px) {
          .kopilka-home-banner {
            min-height: 260px !important;
          }
        }
      `}</style>
    </section>
  );
}
