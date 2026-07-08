"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Sparkles } from "lucide-react";

type State = "idle" | "thinking" | "responding" | "hidden";

interface Message {
  text: string;
  type: "assistant" | "user";
}

export default function GearAssistant({ context = "" }: { context?: string }) {
  const [state, setState] = useState<State>("idle");
  const [showBubble, setShowBubble] = useState(false);
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [idleTimer, setIdleTimer] = useState(0);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Greeting after 30 seconds of idling
  useEffect(() => {
    const t = setInterval(() => setIdleTimer(prev => prev + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (idleTimer === 30 && state === "idle" && !showBubble) {
      setMessage("Привет! Я твой AI-помощник. Наведи на термин или спроси меня о чём угодно.");
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 8000);
    }
  }, [idleTimer]);

  async function ask(question: string) {
    if (!question.trim()) return;
    setState("thinking");
    setHistory(prev => [...prev, { text: question, type: "user" }]);
    setUserInput("");

    try {
      const res = await fetch("/api/assistant/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });
      const data = await res.json();
      const answer = data.response || "Хм, я пока не знаю ответа. Спроси что-нибудь другое!";
      setMessage(answer);
      setHistory(prev => [...prev, { text: answer, type: "assistant" }]);
      setState("responding");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      setMessage("Ой, что-то пошло не так. Попробуй ещё раз.");
      setState("responding");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  function toggleChat() {
    setShowChat(!showChat);
    setShowBubble(false);
  }

  if (state === "hidden") return null;

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 400 }}>
      {/* Chat window */}
      {showChat && (
        <div style={{
          position: "absolute", bottom: 80, right: 0, width: 340, maxHeight: 400,
          background: "white", borderRadius: "var(--radius-xl)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--color-border-light)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: "var(--text-s)" }}>
              <GearIcon size={20} spinning={state === "thinking"} />
              AI-помощник
            </div>
            <button onClick={toggleChat} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-text-tertiary)" }}><X size={16} /></button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "12px 16px", maxHeight: 250, display: "flex", flexDirection: "column", gap: 8, fontSize: "var(--text-xs)" }}>
            {history.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.type === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%", padding: "8px 14px", borderRadius: "var(--radius-m)",
                background: m.type === "user" ? "var(--color-accent)" : "var(--color-bg-secondary)",
                color: m.type === "user" ? "white" : "var(--color-text-primary)",
                lineHeight: 1.5,
              }}>{m.text}</div>
            ))}
            {state === "thinking" && (
              <div style={{ padding: "8px 14px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", alignSelf: "flex-start", display: "flex", gap: 4 }}>
                <span style={{ animation: "blink 1.4s infinite" }}>●</span>
                <span style={{ animation: "blink 1.4s infinite 0.2s" }}>●</span>
                <span style={{ animation: "blink 1.4s infinite 0.4s" }}>●</span>
              </div>
            )}
          </div>
          <div style={{ padding: "10px 16px", borderTop: "1px solid var(--color-border-light)", display: "flex", gap: 8 }}>
            <input
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && ask(userInput)}
              placeholder="Спроси о чём угодно..."
              style={{ flex: 1, padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}
            />
            <button
              onClick={() => ask(userInput)}
              disabled={!userInput.trim() || state === "thinking"}
              style={{
                padding: "8px 14px", borderRadius: "var(--radius-s)", background: userInput.trim() ? "var(--color-accent)" : "var(--color-border)",
                color: "white", border: "none", cursor: userInput.trim() ? "pointer" : "default", fontSize: "var(--text-xs)", fontWeight: 600,
              }}>
              <MessageCircle size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Speech bubble */}
      {showBubble && message && !showChat && (
        <div ref={bubbleRef} style={{
          position: "absolute", bottom: 70, right: 10, maxWidth: 280,
          padding: "12px 16px", background: "white", borderRadius: "var(--radius-l)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid var(--color-border)",
          fontSize: "var(--text-xs)", lineHeight: 1.5, cursor: "pointer",
        }} onClick={toggleChat}>
          {message}
          <div style={{ position: "absolute", bottom: -6, right: 20, width: 12, height: 12, background: "white", transform: "rotate(45deg)", borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }} />
        </div>
      )}

      {/* Main gear button */}
      <button
        onClick={toggleChat}
        onMouseEnter={() => { if (!showChat && !showBubble) { setMessage("Нажми чтобы спросить!"); setShowBubble(true); setTimeout(() => setShowBubble(false), 3000); } }}
        style={{
          width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
          background: state === "thinking" ? "var(--color-warning)" : "var(--color-accent)",
          boxShadow: "0 4px 16px rgba(15,184,128,0.4)", display: "flex",
          alignItems: "center", justifyContent: "center",
          transition: "transform 0.3s, background 0.3s",
          animation: state === "thinking" ? "pulse 1.5s infinite" : "none",
        }}>
        <GearIcon size={28} color="white" spinning={state === "thinking"} />
      </button>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

function GearIcon({ size, color, spinning }: { size: number; color?: string; spinning?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"} style={{
      animation: spinning ? "spin 2s linear infinite" : "none",
    }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2l2.4 1.1c.6.3 1.3.3 1.9 0l2.4-1.1.8 2.5c.2.6.7 1.1 1.3 1.3l2.5.8-1.1 2.4c-.3.6-.3 1.3 0 1.9l1.1 2.4-2.5.8c-.6.2-1.1.7-1.3 1.3l-.8 2.5-2.4-1.1c-.6-.3-1.3-.3-1.9 0L12 22l-2.4-1.1c-.6-.3-1.3-.3-1.9 0l-2.4 1.1-.8-2.5c-.2-.6-.7-1.1-1.3-1.3l-2.5-.8 1.1-2.4c.3-.6.3-1.3 0-1.9L.7 10.5l2.5-.8c.6-.2 1.1-.7 1.3-1.3l.8-2.5 2.4 1.1c.6.3 1.3.3 1.9 0L12 2z" />
      <circle cx="12" cy="12" r="5" fill="white" />
      <circle cx="9" cy="10" r="1.2" fill="#333" />
      <circle cx="15" cy="10" r="1.2" fill="#333" />
      <path d="M9 14c.7.8 1.8 1.3 3 1.3s2.3-.5 3-1.3" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}
