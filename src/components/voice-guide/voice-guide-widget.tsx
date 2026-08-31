"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings2,
  X,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Check,
  FileText,
} from "lucide-react";
import { getVoiceGuideByPath, VoiceGuideItem } from "@/lib/voice-guide/guide-data";

type VoiceMode = "ask" | "auto" | "off";

export default function VoiceGuideWidget() {
  const pathname = usePathname();
  const [guide, setGuide] = useState<VoiceGuideItem | null>(null);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("ask");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScriptText, setShowScriptText] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Инициализация настроек из localStorage
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("proektmap_voice_mode") as VoiceMode | null;
      if (savedMode && (savedMode === "ask" || savedMode === "auto" || savedMode === "off")) {
        setVoiceMode(savedMode);
      }
    } catch {
      // Игнорируем ошибки доступа к localStorage
    }
  }, []);

  // 2. Реакция на изменение пути (pathname)
  useEffect(() => {
    // Останавливаем предыдущее аудио
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsCompleted(false);
    setShowSettings(false);
    setShowScriptText(false);

    const currentGuide = getVoiceGuideByPath(pathname);
    setGuide(currentGuide);

    if (!currentGuide) {
      setIsPromptOpen(false);
      setIsPlayerOpen(false);
      return;
    }

    // Проверяем, прослушано ли в текущей сессии
    let alreadyPlayed = false;
    try {
      alreadyPlayed = !!sessionStorage.getItem(`proektmap_voice_played:${currentGuide.id}`);
    } catch {
      // ignore
    }

    if (alreadyPlayed) {
      setIsCompleted(true);
      setIsPromptOpen(false);
      setIsPlayerOpen(false);
      return;
    }

    // Логика режимов
    if (voiceMode === "off") {
      setIsPromptOpen(false);
      setIsPlayerOpen(false);
    } else if (voiceMode === "auto") {
      setIsPlayerOpen(true);
      setIsPromptOpen(false);
      // Небольшая задержка перед автовоспроизведением
      const t = setTimeout(() => {
        handlePlay(currentGuide);
      }, 700);
      return () => clearTimeout(t);
    } else {
      // Режим "ask" — показываем деликатный промпт через 1.2 сек
      const t = setTimeout(() => {
        setIsPromptOpen(true);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [pathname, voiceMode]);

  // Управление аудио
  const handlePlay = (targetGuide?: VoiceGuideItem | null) => {
    const activeGuide = targetGuide || guide;
    if (!activeGuide) return;

    if (!audioRef.current) {
      const audio = new Audio(activeGuide.audioSrc);
      audioRef.current = audio;

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration || activeGuide.durationSec);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setIsCompleted(true);
        try {
          sessionStorage.setItem(`proektmap_voice_played:${activeGuide.id}`, "1");
        } catch {
          // ignore
        }
      });
    }

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsPromptOpen(false);
        setIsPlayerOpen(true);
      })
      .catch((err) => {
        console.warn("Audio play prevented:", err);
      });
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true));
      setIsCompleted(false);
    } else {
      handlePlay();
    }
  };

  const handleClosePrompt = () => {
    setIsPromptOpen(false);
    if (guide) {
      try {
        sessionStorage.setItem(`proektmap_voice_played:${guide.id}`, "dismissed");
      } catch {
        // ignore
      }
    }
  };

  const handleModeChange = (mode: VoiceMode) => {
    setVoiceMode(mode);
    try {
      localStorage.setItem("proektmap_voice_mode", mode);
    } catch {
      // ignore
    }
    if (mode === "off") {
      handlePause();
      setIsPlayerOpen(false);
      setIsPromptOpen(false);
    }
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!guide) return null;

  const totalDuration = duration || guide.durationSec;
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <>
      {/* 1. Деликатный приглашающий баннер (Prompt) */}
      {isPromptOpen && !isPlayerOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 40,
            maxWidth: "340px",
            background: "rgba(18, 20, 29, 0.94)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(15, 184, 128, 0.35)",
            borderRadius: "16px",
            padding: "14px 16px",
            boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(15, 184, 128, 0.15)",
            animation: "voiceSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "rgba(15, 184, 128, 0.15)",
                border: "1px solid rgba(15, 184, 128, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0fb880",
                flexShrink: 0,
              }}
            >
              <Headphones size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0fb880", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Голосовой проводник
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {guide.durationSec} сек
                </span>
              </div>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#f1f5f9", fontWeight: 500, lineHeight: 1.35 }}>
                Послушать краткую суть раздела «{guide.title}»?
              </p>
            </div>
            <button
              onClick={handleClosePrompt}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => handlePlay()}
              style={{
                flex: 1,
                padding: "8px 14px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0fb880 0%, #0d9668 100%)",
                border: "none",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(15, 184, 128, 0.3)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(15, 184, 128, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 184, 128, 0.3)";
              }}
            >
              <Play size={14} fill="white" />
              Послушать
            </button>
            <button
              onClick={handleClosePrompt}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Позже
            </button>
          </div>
        </div>
      )}

      {/* 2. Развернутый плеер (Active / Expanded Player) */}
      {isPlayerOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 40,
            width: "360px",
            maxWidth: "calc(100vw - 48px)",
            background: "rgba(18, 20, 29, 0.96)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(15, 184, 128, 0.4)",
            borderRadius: "18px",
            padding: "16px 18px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(15, 184, 128, 0.2)",
            animation: "voiceSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "rgba(15, 184, 128, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0fb880",
                }}
              >
                <Headphones size={15} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#0fb880", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Голосовой проводник
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc", lineHeight: 1.2 }}>
                  {guide.title}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  background: showSettings ? "rgba(255,255,255,0.12)" : "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  padding: "5px",
                  borderRadius: "6px",
                  display: "flex",
                }}
                title="Настройки озвучки"
              >
                <Settings2 size={16} />
              </button>
              <button
                onClick={() => {
                  handlePause();
                  setIsPlayerOpen(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  padding: "5px",
                  borderRadius: "6px",
                  display: "flex",
                }}
                title="Свернуть"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Settings Overlay Dropdown */}
          {showSettings && (
            <div
              style={{
                background: "rgba(28, 31, 44, 0.98)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "12px",
                fontSize: "12px",
                color: "#e2e8f0",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "8px", color: "#94a3b8" }}>
                Режим голосового гида:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "4px 6px",
                    borderRadius: "6px",
                    background: voiceMode === "ask" ? "rgba(15, 184, 128, 0.15)" : "transparent",
                    color: voiceMode === "ask" ? "#0fb880" : "#cbd5e1",
                  }}
                  onClick={() => handleModeChange("ask")}
                >
                  <input type="radio" checked={voiceMode === "ask"} onChange={() => handleModeChange("ask")} style={{ accentColor: "#0fb880" }} />
                  <span>Спрашивать перед чтением (рекомендуется)</span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "4px 6px",
                    borderRadius: "6px",
                    background: voiceMode === "auto" ? "rgba(15, 184, 128, 0.15)" : "transparent",
                    color: voiceMode === "auto" ? "#0fb880" : "#cbd5e1",
                  }}
                  onClick={() => handleModeChange("auto")}
                >
                  <input type="radio" checked={voiceMode === "auto"} onChange={() => handleModeChange("auto")} style={{ accentColor: "#0fb880" }} />
                  <span>Читать автоматически при входе</span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "4px 6px",
                    borderRadius: "6px",
                    background: voiceMode === "off" ? "rgba(239, 68, 68, 0.15)" : "transparent",
                    color: voiceMode === "off" ? "#ef4444" : "#cbd5e1",
                  }}
                  onClick={() => handleModeChange("off")}
                >
                  <input type="radio" checked={voiceMode === "off"} onChange={() => handleModeChange("off")} style={{ accentColor: "#ef4444" }} />
                  <span>Выключен</span>
                </label>
              </div>
            </div>
          )}

          {/* Audio Wave & Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "10px",
              padding: "8px 12px",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Sound waves animation */}
              <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "16px" }}>
                <span className={`voice-bar ${isPlaying ? "voice-anim-1" : ""}`} />
                <span className={`voice-bar ${isPlaying ? "voice-anim-2" : ""}`} />
                <span className={`voice-bar ${isPlaying ? "voice-anim-3" : ""}`} />
                <span className={`voice-bar ${isPlaying ? "voice-anim-4" : ""}`} />
              </div>
              <span style={{ fontSize: "12px", color: isPlaying ? "#0fb880" : "#94a3b8", fontWeight: 500 }}>
                {isPlaying ? "Алёна рассказывает..." : isCompleted ? "Завершено" : "На паузе"}
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
              marginBottom: "14px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              if (audioRef.current && totalDuration > 0) {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newRatio = clickX / rect.width;
                audioRef.current.currentTime = newRatio * totalDuration;
              }
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "#0fb880",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isCompleted ? "14px" : "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {isPlaying ? (
                <button
                  onClick={handlePause}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "rgba(15, 184, 128, 0.2)",
                    border: "1px solid #0fb880",
                    color: "#0fb880",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Пауза"
                >
                  <Pause size={18} />
                </button>
              ) : (
                <button
                  onClick={() => handlePlay()}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0fb880 0%, #0d9668 100%)",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(15, 184, 128, 0.4)",
                  }}
                  title="Продолжить"
                >
                  <Play size={18} fill="white" style={{ marginLeft: "2px" }} />
                </button>
              )}

              <button
                onClick={handleReplay}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  display: "flex",
                }}
                title="Сначала"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <button
              onClick={() => setShowScriptText(!showScriptText)}
              style={{
                background: showScriptText ? "rgba(15, 184, 128, 0.15)" : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: showScriptText ? "#0fb880" : "rgba(255,255,255,0.7)",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FileText size={13} />
              {showScriptText ? "Скрыть текст" : "Текст"}
            </button>
          </div>

          {/* Subtitle / Script Text preview */}
          {showScriptText && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.5,
                marginTop: "10px",
                marginBottom: isCompleted ? "12px" : "0",
              }}
            >
              {guide.rawScript}
            </div>
          )}

          {/* Next Actions (Что сделать дальше?) */}
          {isCompleted && guide.nextActions.length > 0 && (
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                paddingTop: "12px",
                marginTop: "12px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                Что сделать дальше:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {guide.nextActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    onClick={() => setIsPlayerOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: action.primary ? "rgba(15, 184, 128, 0.15)" : "rgba(255,255,255,0.04)",
                      border: action.primary ? "1px solid rgba(15, 184, 128, 0.3)" : "1px solid rgba(255,255,255,0.06)",
                      color: action.primary ? "#0fb880" : "#f1f5f9",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "background 0.15s",
                    }}
                  >
                    <span>{action.label}</span>
                    <ArrowRight size={13} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Компактная плавающая иконка (когда плеер свернут) */}
      {!isPlayerOpen && !isPromptOpen && (
        <button
          onClick={() => {
            setIsPlayerOpen(true);
            if (!isPlaying && !isCompleted) {
              handlePlay();
            }
          }}
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 35,
            height: "40px",
            padding: "0 14px",
            borderRadius: "20px",
            background: isPlaying ? "linear-gradient(135deg, #0fb880 0%, #0d9668 100%)" : "rgba(18, 20, 29, 0.9)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: isPlaying ? "none" : "1px solid rgba(15, 184, 128, 0.4)",
            boxShadow: isPlaying ? "0 6px 20px rgba(15, 184, 128, 0.4)" : "0 4px 16px rgba(0, 0, 0, 0.3)",
            color: isPlaying ? "#ffffff" : "#0fb880",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: 600,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
          title="Открыть голосовой проводник"
        >
          {isPlaying ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "12px" }}>
                <span className="voice-bar voice-anim-1" style={{ background: "#ffffff" }} />
                <span className="voice-bar voice-anim-2" style={{ background: "#ffffff" }} />
                <span className="voice-bar voice-anim-3" style={{ background: "#ffffff" }} />
              </div>
              <span>Слушать ({formatTime(currentTime)})</span>
            </>
          ) : isCompleted ? (
            <>
              <Check size={14} color="#0fb880" />
              <span style={{ color: "rgba(255,255,255,0.8)" }}>Гид прослушан</span>
            </>
          ) : (
            <>
              <Headphones size={15} />
              <span>Голосовой гид · {guide.durationSec}с</span>
            </>
          )}
        </button>
      )}

      {/* Global CSS animations for sound wave */}
      <style>{`
        @keyframes voiceSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .voice-bar {
          display: inline-block;
          width: 3px;
          height: 4px;
          background: #0fb880;
          border-radius: 2px;
          transition: height 0.15s ease;
        }
        .voice-anim-1 { animation: voiceWave 0.7s infinite alternate ease-in-out; }
        .voice-anim-2 { animation: voiceWave 0.9s infinite alternate ease-in-out 0.2s; }
        .voice-anim-3 { animation: voiceWave 0.6s infinite alternate ease-in-out 0.1s; }
        .voice-anim-4 { animation: voiceWave 0.8s infinite alternate ease-in-out 0.3s; }
        @keyframes voiceWave {
          0% { height: 3px; }
          100% { height: 15px; }
        }
      `}</style>
    </>
  );
}
