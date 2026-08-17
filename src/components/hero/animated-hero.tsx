"use client";

export default function AnimatedHero({ children }: { children: React.ReactNode }) {
  return (
    <div className="home-animated-hero" style={{ position: "relative", overflow: "hidden", minHeight: 460, background: "var(--color-bg-primary)" }}>
      {/* Blob 1 — green */}
      <div style={{
        position: "absolute", zIndex: 0, pointerEvents: "none",
        width: "60vw", height: "60vw", maxWidth: 700, maxHeight: 700,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(15,184,128,0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "heroBlob1 18s ease-in-out infinite",
      }} />
      {/* Blob 2 — blue */}
      <div style={{
        position: "absolute", zIndex: 0, pointerEvents: "none",
        width: "50vw", height: "50vw", maxWidth: 550, maxHeight: 550,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,144,217,0.13) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "heroBlob2 22s ease-in-out infinite",
      }} />
      {/* Blob 3 — purple */}
      <div style={{
        position: "absolute", zIndex: 0, pointerEvents: "none",
        width: "40vw", height: "40vw", maxWidth: 400, maxHeight: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "heroBlob3 25s ease-in-out infinite",
      }} />

      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, var(--color-border) 0.5px, transparent 0.5px)",
        backgroundSize: "32px 32px",
        opacity: 0.35,
      }} />

      <style>{`
        @keyframes heroBlob1 {
          0%, 100% { top: -15%; left: -10%; transform: scale(1) rotate(0deg); }
          25% { top: 10%; left: 45%; transform: scale(1.2) rotate(90deg); }
          50% { top: 40%; left: 60%; transform: scale(0.9) rotate(180deg); }
          75% { top: 5%; left: 20%; transform: scale(1.1) rotate(270deg); }
        }
        @keyframes heroBlob2 {
          0%, 100% { top: 30%; left: 50%; transform: scale(1) rotate(0deg); }
          33% { top: -10%; left: 10%; transform: scale(1.3) rotate(120deg); }
          66% { top: 50%; left: 70%; transform: scale(0.8) rotate(240deg); }
        }
        @keyframes heroBlob3 {
          0%, 100% { top: 50%; left: 20%; transform: scale(1) rotate(0deg); }
          50% { top: -5%; left: 60%; transform: scale(1.4) rotate(180deg); }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
