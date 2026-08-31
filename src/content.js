(() => {
  "use strict";

  // ---- Funcoes puras de calculo/formatacao ----

  function formatTime(totalSeconds) {
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
    const s = Math.round(totalSeconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const two = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${two(m)}:${two(sec)}` : `${m}:${two(sec)}`;
  }

  function computeRemainingClockSeconds(duration, currentTime, playbackRate) {
    if (
      !Number.isFinite(duration) ||
      !Number.isFinite(currentTime) ||
      !Number.isFinite(playbackRate) ||
      playbackRate <= 0
    ) {
      return NaN;
    }
    return (duration - currentTime) / playbackRate;
  }

  // ---- Localizar player e o elemento nativo de tempo ----

  function getVideoEl() {
    return (
      document.querySelector("video.html5-main-video") ||
      document.querySelector("video")
    );
  }

  // O YouTube usa .ytp-time-current para o tempo mostrado a esquerda da barra.
  // No modo "tempo restante" ele exibe algo como "-14:15".
  function getCurrentTimeEl() {
    return document.querySelector(".ytp-time-current");
  }

  // ---- Reescrever o elemento nativo com o tempo ajustado pela velocidade ----

  function renderOnce() {
    const video = getVideoEl();
    const el = getCurrentTimeEl();
    if (!video || !el) return;

    // Item 2: so agimos quando o player esta no modo "tempo restante"
    // (texto nativo negativo, ex: "-14:15"). No modo decorrido ("0:45"),
    // nao tocamos no elemento, preservando o toggle nativo do YouTube.
    if (!el.textContent.trim().startsWith("-")) return;

    const remaining = computeRemainingClockSeconds(
      video.duration,
      video.currentTime,
      video.playbackRate
    );
    if (Number.isNaN(remaining)) return;
    const text = "-" + formatTime(remaining);
    if (el.textContent === text) return; // nada a fazer

    // Item 1: pausamos o observer durante a nossa propria escrita para nao
    // reagir a ela (evita callback extra e qualquer risco de loop). O YouTube
    // continua reescrevendo o texto a cada tick; essa reescrita dele e que
    // dispara o observer, e ai sobrescrevemos de novo.
    if (textObserver) textObserver.disconnect();
    el.textContent = text;
    if (textObserver && boundTimeEl) {
      textObserver.observe(boundTimeEl, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }

  // ---- Atualizacao em tempo real + reacao a velocidade/seek ----

  let updateTimer = null;
  let boundVideo = null;
  let boundTimeEl = null;
  let textObserver = null;
  const VIDEO_EVENTS = [
    "ratechange",
    "timeupdate",
    "seeked",
    "loadedmetadata",
    "durationchange",
  ];

  function startUpdating() {
    const video = getVideoEl();
    const el = getCurrentTimeEl();
    if (!video || !el) return;
    if (boundVideo === video && updateTimer !== null) return; // ja ativo
    stopUpdating();
    boundVideo = video;

    VIDEO_EVENTS.forEach((ev) => video.addEventListener(ev, renderOnce));
    updateTimer = setInterval(renderOnce, 500);

    // O YouTube reescreve o texto nativo a cada tick; reagimos a essa reescrita
    // para sobrescrever imediatamente com o valor ajustado (evita "piscar").
    boundTimeEl = el;
    textObserver = new MutationObserver(renderOnce);
    textObserver.observe(el, { childList: true, characterData: true, subtree: true });

    renderOnce();
  }

  function stopUpdating() {
    if (updateTimer !== null) {
      clearInterval(updateTimer);
      updateTimer = null;
    }
    if (textObserver) {
      textObserver.disconnect();
      textObserver = null;
    }
    boundTimeEl = null;
    if (boundVideo) {
      VIDEO_EVENTS.forEach((ev) =>
        boundVideo.removeEventListener(ev, renderOnce)
      );
      boundVideo = null;
    }
  }

  // ---- Robustez na navegacao SPA do YouTube ----

  function boot() {
    if (getCurrentTimeEl() && getVideoEl()) {
      startUpdating();
    }
  }

  let bootDebounce = null;
  function scheduleBoot() {
    if (bootDebounce !== null) return;
    bootDebounce = setTimeout(() => {
      bootDebounce = null;
      boot();
    }, 300);
  }

  const observer = new MutationObserver(scheduleBoot);
  observer.observe(document.body, { childList: true, subtree: true });

  // Evento proprio do YouTube ao concluir navegacao SPA
  window.addEventListener("yt-navigate-finish", scheduleBoot);

  // Tentativa inicial
  boot();
})();
