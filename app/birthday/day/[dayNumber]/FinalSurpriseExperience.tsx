"use client";

import { useEffect } from "react";

type Props = {
  title?: string;
  content?: string;
  finalVideo?: {
    title?: string;
    url?: string;
    thumbnailUrl?: string;
  };
  extraGiftUrl?: string | null;
};

export default function FinalSurpriseExperience({
  title,
  content,
  finalVideo,
  extraGiftUrl,
}: Props) {
  useEffect(() => {
    const STAGE_0 = document.getElementById("fs-stage-0");
    const STAGE_1 = document.getElementById("fs-stage-1");
    const STAGE_2 = document.getElementById("fs-stage-2");
    const CAKE = document.querySelector('[data-anim="cake"]') as HTMLElement | null;
    const WISH = document.querySelector('[data-anim="wish"]') as HTMLElement | null;
    const FLAMES = document.querySelectorAll<HTMLElement>('[data-flame]');
    const FILM = document.getElementById("fs-film-video") as HTMLVideoElement | null;
    const COUNTDOWN = document.getElementById("fs-countdown");
    const COUNTDOWN_N = document.getElementById("fs-countdown-n");
    const PROGRESS = document.getElementById("fs-progress");
    let filmTimer: ReturnType<typeof setTimeout> | null = null;
    let cdInterval: ReturnType<typeof setInterval> | null = null;
    const FILM_MAX_MS = 6000;

    function showStage(n: 0 | 1 | 2) {
      [STAGE_0, STAGE_1, STAGE_2].forEach((el) => {
        if (el) (el as HTMLElement).style.display = "none";
      });
      if (n === 0 && STAGE_0) STAGE_0.style.display = "block";
      if (n === 1 && STAGE_1) STAGE_1.style.display = "block";
      if (n === 2 && STAGE_2) STAGE_2.style.display = "block";
    }

    function launchConfetti() {
      const canvasEl = document.getElementById(
        "fs-confetti-canvas",
      ) as HTMLCanvasElement | null;
      if (!canvasEl) return;
      const parent = canvasEl.parentElement;
      if (!parent) return;
      canvasEl.width = parent.clientWidth;
      canvasEl.height = parent.clientHeight;
      const ctxEl = canvasEl.getContext("2d");
      if (!ctxEl) return;
      const canvas: HTMLCanvasElement = canvasEl;
      const ctx: CanvasRenderingContext2D = ctxEl;
      const colors = [
        "#f43f5e",
        "#f59e0b",
        "#ec4899",
        "#a855f7",
        "#10b981",
        "#3b82f6",
      ];
      const parts: Array<{
        x: number;
        y: number;
        w: number;
        h: number;
        c: string;
        s: number;
        r: number;
        rr: number;
      }> = [];
      for (let i = 0; i < 180; i++) {
        parts.push({
          x: canvas.width * Math.random(),
          y: -20 - Math.random() * canvas.height * 0.5,
          w: 6 + Math.random() * 6,
          h: 3 + Math.random() * 4,
          c: colors[(Math.random() * colors.length) | 0],
          s: 1.2 + Math.random() * 3.2,
          r: Math.random() * Math.PI * 2,
          rr: (Math.random() - 0.5) * 0.18,
        });
      }
      function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          p.y += p.s;
          p.x += Math.sin(p.r) * 0.9;
          p.r += p.rr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillStyle = p.c;
          ctx.globalAlpha = 0.92;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
          if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = canvas.width * Math.random();
          }
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function startCountdownAndProgress() {
      if (COUNTDOWN) COUNTDOWN.style.opacity = "1";
      if (PROGRESS) {
        setTimeout(() => {
          if (PROGRESS) PROGRESS.style.width = "100%";
        }, 20);
      }
      let sec = 6;
      if (COUNTDOWN_N) COUNTDOWN_N.textContent = String(sec);
      cdInterval = setInterval(() => {
        sec--;
        if (COUNTDOWN_N && sec >= 1) COUNTDOWN_N.textContent = String(sec);
        if (sec <= 1 && cdInterval) {
          clearInterval(cdInterval);
          cdInterval = null;
        }
      }, 1000);
    }

    function stopCountdown() {
      if (cdInterval) {
        clearInterval(cdInterval);
        cdInterval = null;
      }
    }

    function toStage2() {
      if (filmTimer) {
        clearTimeout(filmTimer);
        filmTimer = null;
      }
      stopCountdown();
      if (FILM) {
        try {
          FILM.pause();
        } catch (_e) {
          /* noop */
        }
      }
      showStage(2);
      setTimeout(() => {
        if (CAKE) {
          CAKE.style.opacity = "1";
          CAKE.style.transform = "translateY(0) scale(1)";
        }
      }, 60);
      setTimeout(() => {
        if (WISH) {
          WISH.style.opacity = "1";
          WISH.style.transform = "translateY(0)";
        }
      }, 600);
      setTimeout(() => launchConfetti(), 380);
    }

    function startFilmTimer() {
      if (filmTimer) return;
      startCountdownAndProgress();
      filmTimer = setTimeout(() => toStage2(), FILM_MAX_MS);
      if (FILM) {
        FILM.addEventListener(
          "ended",
          () => toStage2(),
          { once: true },
        );
      }
    }

    function runFinalSurprise() {
      showStage(1);
      if (FILM) {
        const p = FILM.play();
        if (p && typeof (p as Promise<void>).catch === "function") {
          (p as Promise<void>).catch(() => {
            /* autoplay blocked, timer runs regardless */
          });
        }
      }
      startFilmTimer();
    }

    function skipToCake() {
      toStage2();
    }

    function blowCandles() {
      FLAMES.forEach((f, idx) => {
        setTimeout(() => {
          f.style.transition =
            "opacity 0.55s ease, transform 0.55s ease";
          f.style.opacity = "0";
          f.style.transform = "scale(0.1) translateY(-10px) rotate(-15deg)";
        }, idx * 130);
      });
      setTimeout(
        () => launchConfetti(),
        FLAMES.length * 130 + 220,
      );
    }

    (window as any).__runFinalSurprise = runFinalSurprise;
    (window as any).__startFilmTimer = startFilmTimer;
    (window as any).__skipToCake = skipToCake;
    (window as any).__blowCandles = blowCandles;

    if (!document.getElementById("fs-breathe-kf")) {
      const st = document.createElement("style");
      st.id = "fs-breathe-kf";
      st.textContent =
        "@keyframes fsBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.018)}}";
      document.head.appendChild(st);
    }
  }, []);

  const filmTitle =
    finalVideo?.title ??
    "Sit back... something very sweet is waiting for you right after this.";
  const filmUrl = finalVideo?.url;
  const filmThumb = finalVideo?.thumbnailUrl;
  const hasGift =
    !!extraGiftUrl &&
    extraGiftUrl !== "" &&
    extraGiftUrl !== "https://example.com";

  return (
    <div id="final-surprise-root" className="mt-6">
      <div id="fs-stage-0" className="block">
        <button
          id="fs-open-btn"
          type="button"
          onClick={() => {
            (window as any).__runFinalSurprise?.();
          }}
          className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:scale-[1.02] hover:bg-rose-400 active:scale-[0.98]"
        >
          🎁 Open the final surprise
        </button>
      </div>

      <div id="fs-stage-1" className="hidden">
        <div className="overflow-hidden rounded-[28px] border-2 border-rose-300/60 bg-stone-900 shadow-2xl shadow-rose-500/10 ring-1 ring-white/10">
          <div className="relative">
            {filmUrl ? (
              <video
                id="fs-film-video"
                className="aspect-video w-full bg-stone-950 object-cover"
                autoPlay
                playsInline
                muted
                controls
                poster={filmThumb}
                onPlay={() => {
                  (window as any).__startFilmTimer?.();
                }}
                onError={() => {
                  (window as any).__skipToCake?.();
                }}
              >
                <source src={filmUrl} type="video/mp4" />
                <source src={filmUrl} type="video/quicktime" />
                <source src={filmUrl} type="video/webm" />
              </video>
            ) : (
              <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 text-white/80">
                <div className="text-center px-6">
                  <div className="text-6xl mb-3 animate-pulse">🎬</div>
                  <p className="font-display text-3xl">A little film for you</p>
                  <p className="text-sm mt-3 opacity-70">
                    Something wonderful is about to appear in just a few
                    seconds...
                  </p>
                </div>
              </div>
            )}
            <div className="absolute left-4 top-3 rounded-full bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-rose-200 backdrop-blur-md ring-1 ring-white/10">
              the final surprise
            </div>
            <div
              id="fs-countdown"
              className="absolute right-4 top-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md ring-1 ring-white/10 opacity-0 transition-opacity"
            >
              🎂 <span id="fs-countdown-n">6</span>s
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/30 overflow-hidden">
              <div
                id="fs-progress"
                className="h-full w-0 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 transition-[width] ease-linear"
                style={{ transitionDuration: "6000ms" }}
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-stone-600 text-center italic">
          {filmTitle}
        </p>
      </div>

      <div id="fs-stage-2" className="hidden">
        <div className="relative overflow-hidden rounded-[28px] border-2 border-rose-300/60 bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 p-6 sm:p-10 shadow-inner">
          <canvas
            id="fs-confetti-canvas"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />

          <div
            id="fs-cake-wrap"
            className="relative mx-auto flex max-w-sm flex-col items-center opacity-0 translate-y-6 transition-all duration-700 ease-out"
            data-anim="cake"
          >
            <div className="flex gap-4 mb-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center"
                  style={{ animationDelay: `${i * 80}ms` }}
                  data-candle
                >
                  <div className="h-8 w-1.5 rounded-sm bg-gradient-to-b from-pink-200 via-rose-300 to-rose-400" />
                  <div
                    className="absolute -top-2 h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_12px_4px_rgba(251,191,36,0.6)] animate-pulse"
                    data-flame
                  />
                </div>
              ))}
            </div>
            <div className="relative h-16 w-48 rounded-t-2xl bg-gradient-to-b from-rose-300 to-rose-400 shadow-md">
              <div className="absolute inset-x-0 top-0 h-3 rounded-t-2xl bg-gradient-to-b from-white/70 to-transparent" />
            </div>
            <div className="h-4 w-48 relative">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="absolute -top-1 h-5 w-5 rounded-b-full bg-rose-100/90 shadow-sm"
                  style={{ left: `${i * 12 + 3}%` }}
                />
              ))}
            </div>
            <div className="relative h-24 w-64 rounded-b-2xl bg-gradient-to-b from-pink-200 via-rose-300 to-rose-400 shadow-lg">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/60 to-transparent" />
              <div className="absolute inset-x-4 bottom-3 flex justify-around">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full bg-rose-500/70 border-2 border-rose-100"
                  />
                ))}
              </div>
            </div>
            <div className="h-3 w-72 rounded-full bg-gradient-to-b from-stone-200 to-stone-400 shadow-md" />
          </div>

          <div
            id="fs-wish-wrap"
            className="mt-8 text-center opacity-0 translate-y-4 transition-all duration-700 ease-out"
            data-anim="wish"
            style={{ transitionDelay: "500ms" }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-rose-600">
              the last wish
            </p>
            <h4
              className="mt-4 font-display text-4xl text-stone-800 sm:text-5xl"
              style={{ animation: "fsBreathe 4s ease-in-out infinite" }}
            >
              Make a wish, Kesar ✨
            </h4>
            <div className="mx-auto mt-5 max-w-xl rounded-[20px] bg-white/70 p-5 backdrop-blur-sm ring-1 ring-rose-200/60">
              <p className="text-base leading-8 text-stone-700">
                I hope this year wraps itself around you like the warmest hug.
                I hope every morning you wake up feeling a little more loved. I
                hope the things that scare you grow smaller, and the things
                that make you smile grow bigger. You deserve the kind of
                happiness that doesn&apos;t come and go — the kind that stays,
                quietly, in every ordinary moment.
              </p>
              <p className="mt-4 text-right font-display text-xl italic text-rose-700">
                — always, Hardik 💗
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {hasGift ? (
                <a
                  href={extraGiftUrl!}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-3 text-sm font-medium text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-400"
                >
                  🎁 Open the extra little gift
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  (window as any).__blowCandles?.();
                }}
                className="inline-flex items-center justify-center rounded-full border-2 border-amber-300 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800 shadow-sm transition hover:bg-amber-100 active:scale-[0.98]"
              >
                🌬️ Blow the candles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
