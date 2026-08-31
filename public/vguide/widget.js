/**
 * ProektMap Voice Guide — Embeddable Standalone Widget
 * Version: 1.0.0
 * https://proektmap.ru/services/voice-guide-builder
 */
(function () {
  if (window.__PM_VOICE_GUIDE_LOADED__) return;
  window.__PM_VOICE_GUIDE_LOADED__ = true;

  // 1. Поиск конфига
  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  var globalConfig = window.ProektMapVoiceGuideConfig || {};
  var routesAttr = currentScript ? currentScript.getAttribute("data-routes") : null;
  var themeColor = (currentScript && currentScript.getAttribute("data-theme")) || globalConfig.theme || "#0fb880";
  var defaultMode = (currentScript && currentScript.getAttribute("data-mode")) || globalConfig.mode || "ask"; // "ask" | "auto" | "off"
  var position = (currentScript && currentScript.getAttribute("data-position")) || globalConfig.position || "bottom-right"; // "bottom-right" | "bottom-left"

  var routes = globalConfig.routes || [];
  if (routesAttr) {
    try {
      routes = JSON.parse(routesAttr);
    } catch (e) {
      console.warn("[VoiceGuide] Invalid data-routes JSON:", e);
    }
  }

  // 2. Определение текущего маршрута
  var currentPath = window.location.pathname || "/";
  var activeGuide = null;

  for (var i = 0; i < routes.length; i++) {
    var r = routes[i];
    if (r.route === currentPath || (r.route !== "/" && currentPath.indexOf(r.route) === 0)) {
      activeGuide = r;
      break;
    }
  }

  // Если точного нет, пробуем корневой "/"
  if (!activeGuide) {
    for (var j = 0; j < routes.length; j++) {
      if (routes[j].route === "/" || routes[j].route === "*") {
        activeGuide = routes[j];
        break;
      }
    }
  }

  if (!activeGuide) return; // Нет сценария для текущей страницы

  // 3. Состояние
  var savedMode = "ask";
  try {
    savedMode = localStorage.getItem("pm_vguide_mode") || defaultMode;
  } catch (e) {}

  if (savedMode === "off") return;

  var sessionKey = "pm_vguide_played_" + (activeGuide.id || activeGuide.route);
  var alreadyPlayed = false;
  try {
    alreadyPlayed = !!sessionStorage.getItem(sessionKey);
  } catch (e) {}

  var state = {
    isOpen: false,
    isPromptOpen: false,
    isPlaying: false,
    isCompleted: alreadyPlayed,
    currentTime: 0,
    duration: activeGuide.duration || 30,
    audio: null,
    showText: false,
  };

  // 4. Стили
  var isLeft = position === "bottom-left";
  var posStyles = isLeft ? "left: 24px;" : "right: 24px;";

  var css = `
    .pm-vguide-root {
      position: fixed;
      bottom: 24px;
      ${posStyles}
      z-index: 999990;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    .pm-vguide-root * { box-sizing: border-box; }
    .pm-vguide-btn {
      height: 44px;
      padding: 0 16px;
      border-radius: 22px;
      background: rgba(18, 20, 29, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid ${themeColor};
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .pm-vguide-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(0,0,0,0.45);
    }
    .pm-vguide-playing-btn {
      background: linear-gradient(135deg, ${themeColor} 0%, #0d9668 100%);
      border: none;
      box-shadow: 0 8px 24px rgba(15, 184, 128, 0.4);
    }
    .pm-vguide-card {
      position: fixed;
      bottom: 24px;
      ${posStyles}
      width: 350px;
      max-width: calc(100vw - 48px);
      background: rgba(18, 20, 29, 0.96);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      padding: 16px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.55), 0 0 20px rgba(15,184,128,0.15);
      color: #f8fafc;
      animation: pmVGuideSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes pmVGuideSlide {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .pm-vguide-bars { display: flex; align-items: center; gap: 3px; height: 16px; }
    .pm-vguide-bar {
      display: inline-block;
      width: 3px;
      height: 4px;
      background: ${themeColor};
      border-radius: 2px;
    }
    .pm-vguide-anim-1 { animation: pmWave 0.7s infinite alternate ease-in-out; }
    .pm-vguide-anim-2 { animation: pmWave 0.9s infinite alternate ease-in-out 0.2s; }
    .pm-vguide-anim-3 { animation: pmWave 0.6s infinite alternate ease-in-out 0.1s; }
    .pm-vguide-anim-4 { animation: pmWave 0.8s infinite alternate ease-in-out 0.3s; }
    @keyframes pmWave { 0% { height: 3px; } 100% { height: 15px; } }
  `;

  var styleEl = document.createElement("style");
  styleEl.innerHTML = css;
  document.head.appendChild(styleEl);

  // 5. DOM Контейнер
  var container = document.createElement("div");
  container.className = "pm-vguide-root";
  document.body.appendChild(container);

  function formatTime(s) {
    var mins = Math.floor(s / 60);
    var secs = Math.floor(s % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }

  function initAudio() {
    if (state.audio) return;
    state.audio = new Audio(activeGuide.audioSrc);
    state.audio.addEventListener("timeupdate", function () {
      state.currentTime = state.audio.currentTime;
      render();
    });
    state.audio.addEventListener("loadedmetadata", function () {
      state.duration = state.audio.duration || activeGuide.duration || 30;
      render();
    });
    state.audio.addEventListener("ended", function () {
      state.isPlaying = false;
      state.isCompleted = true;
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch (e) {}
      render();
    });
  }

  function playAudio() {
    initAudio();
    state.audio.play().then(function () {
      state.isPlaying = true;
      state.isPromptOpen = false;
      state.isOpen = true;
      render();
    }).catch(function (e) {
      console.warn("[VoiceGuide] Play prevented:", e);
    });
  }

  function pauseAudio() {
    if (state.audio) {
      state.audio.pause();
      state.isPlaying = false;
      render();
    }
  }

  function replayAudio() {
    if (state.audio) {
      state.audio.currentTime = 0;
      state.audio.play().then(function () {
        state.isPlaying = true;
        state.isCompleted = false;
        render();
      });
    } else {
      playAudio();
    }
  }

  function render() {
    var html = "";

    // А) Промпт-приглашение
    if (state.isPromptOpen && !state.isOpen) {
      html = `
        <div class="pm-vguide-card">
          <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
            <div style="width: 34px; height: 34px; border-radius: 10px; background: rgba(15,184,128,0.15); border: 1px solid ${themeColor}; display: flex; align-items: center; justify-content: center; color: ${themeColor}; flex-shrink: 0;">
              🎧
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 11px; font-weight: 700; color: ${themeColor}; text-transform: uppercase;">Голосовой гид</span>
                <span style="font-size: 10px; padding: 1px 6px; border-radius: 4px; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);">${activeGuide.duration || 30} сек</span>
              </div>
              <p style="margin: 3px 0 0; font-size: 13px; color: #f1f5f9; font-weight: 500; line-height: 1.35;">
                Послушать краткий рассказ о странице «${activeGuide.title || "этом разделе"}»?
              </p>
            </div>
            <button id="pm-vguide-close-prompt" style="background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; padding: 2px; font-size: 16px;">✕</button>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="pm-vguide-start-btn" style="flex: 1; padding: 8px 14px; border-radius: 10px; background: ${themeColor}; border: none; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer;">
              ▶ Послушать
            </button>
            <button id="pm-vguide-dismiss-btn" style="padding: 8px 12px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); font-size: 12px; cursor: pointer;">
              Позже
            </button>
          </div>
        </div>
      `;
    }
    // Б) Развернутый плеер
    else if (state.isOpen) {
      var progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
      var actionsHtml = "";
      if (state.isCompleted && activeGuide.actions && activeGuide.actions.length > 0) {
        actionsHtml = `
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; margin-top: 12px;">
            <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Что сделать дальше:</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${activeGuide.actions.map(function (act) {
                return `
                  <a href="${act.href}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 8px; background: ${act.primary ? "rgba(15,184,128,0.15)" : "rgba(255,255,255,0.04)"}; border: 1px solid ${act.primary ? themeColor : "rgba(255,255,255,0.08)"}; color: ${act.primary ? themeColor : "#f1f5f9"}; font-size: 12px; font-weight: 600; text-decoration: none;">
                    <span>${act.label}</span>
                    <span>→</span>
                  </a>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }

      var textHtml = state.showText && activeGuide.text ? `
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 10px; font-size: 12px; color: #e2e8f0; line-height: 1.45; margin-top: 10px;">
          ${activeGuide.text}
        </div>
      ` : "";

      html = `
        <div class="pm-vguide-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">🎧</span>
              <div>
                <div style="font-size: 11px; font-weight: 700; color: ${themeColor}; text-transform: uppercase;">Голосовой гид</div>
                <div style="font-size: 13px; font-weight: 600; color: #f8fafc;">${activeGuide.title || "Страница"}</div>
              </div>
            </div>
            <button id="pm-vguide-close-player" style="background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 16px;">✕</button>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 6px 10px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <div class="pm-vguide-bars">
                <span class="pm-vguide-bar ${state.isPlaying ? "pm-vguide-anim-1" : ""}"></span>
                <span class="pm-vguide-bar ${state.isPlaying ? "pm-vguide-anim-2" : ""}"></span>
                <span class="pm-vguide-bar ${state.isPlaying ? "pm-vguide-anim-3" : ""}"></span>
              </div>
              <span style="font-size: 12px; color: ${state.isPlaying ? themeColor : "#94a3b8"}; font-weight: 500;">
                ${state.isPlaying ? "Озвучивание..." : state.isCompleted ? "Завершено" : "На паузе"}
              </span>
            </div>
            <div style="font-size: 12px; color: #94a3b8; font-variant-numeric: tabular-nums;">
              ${formatTime(state.currentTime)} / ${formatTime(state.duration)}
            </div>
          </div>

          <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 12px;">
            <div style="width: ${progress}%; height: 100%; background: ${themeColor};"></div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="pm-vguide-toggle-play" style="width: 36px; height: 36px; border-radius: 50%; background: ${state.isPlaying ? "rgba(15,184,128,0.2)" : themeColor}; border: ${state.isPlaying ? "1px solid " + themeColor : "none"}; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px;">
                ${state.isPlaying ? "⏸" : "▶"}
              </button>
              <button id="pm-vguide-replay" style="background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 15px;" title="Сначала">
                🔄
              </button>
            </div>
            ${activeGuide.text ? `
              <button id="pm-vguide-toggle-text" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border-radius: 6px; padding: 4px 8px; font-size: 11px; cursor: pointer;">
                ${state.showText ? "Скрыть текст" : "Текст"}
              </button>
            ` : ""}
          </div>

          ${textHtml}
          ${actionsHtml}
        </div>
      `;
    }
    // В) Свернутая плавающая кнопка
    else {
      var btnClass = state.isPlaying ? "pm-vguide-btn pm-vguide-playing-btn" : "pm-vguide-btn";
      html = `
        <button id="pm-vguide-floating-btn" class="${btnClass}">
          <span>🎧</span>
          <span>${state.isPlaying ? "Слушать (" + formatTime(state.currentTime) + ")" : state.isCompleted ? "Гид прослушан ✓" : "Аудиогид · " + (activeGuide.duration || 30) + "с"}</span>
        </button>
      `;
    }

    container.innerHTML = html;
    bindEvents();
  }

  function bindEvents() {
    var startBtn = document.getElementById("pm-vguide-start-btn");
    if (startBtn) startBtn.onclick = function () { playAudio(); };

    var closePrompt = document.getElementById("pm-vguide-close-prompt");
    if (closePrompt) closePrompt.onclick = function () { state.isPromptOpen = false; render(); };

    var dismissBtn = document.getElementById("pm-vguide-dismiss-btn");
    if (dismissBtn) dismissBtn.onclick = function () { state.isPromptOpen = false; render(); };

    var closePlayer = document.getElementById("pm-vguide-close-player");
    if (closePlayer) closePlayer.onclick = function () { pauseAudio(); state.isOpen = false; render(); };

    var togglePlay = document.getElementById("pm-vguide-toggle-play");
    if (togglePlay) togglePlay.onclick = function () {
      if (state.isPlaying) pauseAudio(); else playAudio();
    };

    var replay = document.getElementById("pm-vguide-replay");
    if (replay) replay.onclick = function () { replayAudio(); };

    var toggleText = document.getElementById("pm-vguide-toggle-text");
    if (toggleText) toggleText.onclick = function () { state.showText = !state.showText; render(); };

    var floatingBtn = document.getElementById("pm-vguide-floating-btn");
    if (floatingBtn) floatingBtn.onclick = function () {
      state.isOpen = true;
      if (!state.isPlaying && !state.isCompleted) {
        playAudio();
      } else {
        render();
      }
    };
  }

  // 6. Запуск логики появления
  if (!alreadyPlayed) {
    if (savedMode === "auto") {
      setTimeout(function () {
        playAudio();
      }, 800);
    } else {
      setTimeout(function () {
        state.isPromptOpen = true;
        render();
      }, 1500);
    }
  }

  render();
})();
