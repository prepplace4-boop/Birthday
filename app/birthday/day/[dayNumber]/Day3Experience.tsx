"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Letter = {
  n: string;
  sealClass?: "intro" | "bonus";
  seal: string;
  faceTitle: string;
  faceHint: string;
  count: boolean;
  illustration?: React.ReactNode;
  heading: string;
  body: React.ReactNode;
};

const Chevron = () => (
  <svg
    className="d3-chevron"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const I = {
  appreciation: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="20" cy="8" r="3" />
      <line x1="20" y1="11" x2="20" y2="30" />
      <path d="M8 20c0 7 5 12 12 13" />
      <path d="M32 20c0 7-5 12-12 13" />
      <line x1="12" y1="20" x2="28" y2="20" />
    </svg>
  ),
  memory: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 10h18v12H14l-4 4v-4H6z" />
      <path
        d="M18 18h16v10h-4l-3 4v-4h-9z"
        opacity={0.55}
      />
    </svg>
  ),
  laugh: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="20" cy="20" r="14" />
      <path d="M14 18c.5-1.5 2-1.5 2.5 0M23.5 18c.5-1.5 2-1.5 2.5 0" />
      <path d="M13 24c2.5 4 11.5 4 14 0" />
    </svg>
  ),
  realize: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 14c-2-3-6-3-7 1-1 4 3 7 7 10 4-3 8-6 7-10-1-4-5-4-7-1z" />
      <path d="M8 28c3-3 8-3 12-3s9 0 12 3" />
    </svg>
  ),
  relive: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 32C10 24 4 18 4 12c0-4 3-7 7-7 3 0 5 1.5 6 4l1 2 1-2c1-2.5 3-4 6-4 4 0 7 3 7 7 0 6-6 12-16 20z" />
      <path d="M20 12l-2 5 4 2-2 6" />
    </svg>
  ),
  wantedToSay: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
    >
      <path d="M20 4l4.5 10.5L36 16l-8 8 2 12-10-6-10 6 2-12-8-8 11.5-1.5z" />
    </svg>
  ),
  random: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M25 8a12 12 0 1 0 7 21 10 10 0 0 1-7-21z" />
      <path d="M32 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
    </svg>
  ),
  friendship: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 4v10" />
      <path d="M20 14c-6 2-8 8-8 14M20 14c6 2 8 8 8 14" />
      <path d="M20 14c-3 5-3 10 0 16M20 14c3 5 3 10 0 16" />
    </svg>
  ),
  lastMsg: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6c-2 6-2 10 0 14M20 6c2 6 2 10 0 14" />
      <path d="M14 20c0 6 2 10 6 12 4-2 6-6 6-12" />
      <path d="M20 20v12" />
    </svg>
  ),
  bonus: (
    <svg
      className="illustration"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 4c1 6 3 9 9 10-6 1-8 4-9 10-1-6-3-9-9-10 6-1 8-4 9-10z" />
    </svg>
  ),
};

const LETTERS: Letter[] = [
  {
    n: "00",
    sealClass: "intro",
    seal: "✎",
    faceTitle: "Before you open these",
    faceHint: "tap to open",
    count: false,
    heading: "Before you open these",
    body: (
      <>
        <p>
          None of these were easy to write. Some I&apos;ve been meaning to say
          for a while, some I didn&apos;t even know I felt until I started
          typing. There&apos;s no order you have to read them in — open
          whichever one you want first.
        </p>
        <p>Just know that all ten are true.</p>
      </>
    ),
  },
  {
    n: "01",
    seal: "01",
    faceTitle: "Something I've always appreciated about you",
    faceHint: "tap to open",
    count: true,
    illustration: I.appreciation,
    heading: "Something I've always appreciated about you",
    body: (
      <>
        <p>
          You&apos;ve never really changed. That&apos;s the part I appreciate
          most — not in a boring way, but in a way that feels rare. The trust,
          the honesty, the same nature and behaviour, whether it&apos;s been a
          good week or a bad one. People change with time, with mood, with
          convenience. You just didn&apos;t.
        </p>
        <p>
          I don&apos;t think I&apos;ve ever told you that this consistency is
          what made it easy to trust you in the first place. It&apos;s a quiet
          thing, easy to miss, but it&apos;s the foundation everything else was
          built on.
        </p>
        <div className="media-row">
          <span className="chip">🎨 then-vs-now photo pair</span>
        </div>
        <div className="photo-slot">
          📷 slot for a &quot;different days, same you&quot; photo
        </div>
      </>
    ),
  },
  {
    n: "02",
    seal: "02",
    faceTitle: "A memory I never told you was special",
    faceHint: "tap to open",
    count: true,
    illustration: I.memory,
    heading: "A memory I never told you was special",
    body: (
      <>
        <p>
          I don&apos;t even have one specific moment to point to — and
          that&apos;s kind of the point. It&apos;s every regular conversation.
          The random texts, the pointless calls, the &quot;kya kar rahi ho&quot;
          messages that turned into an hour of talking about nothing. Every
          single time, it made me feel special, and I never said it because it
          felt too small to mention.
        </p>
        <p>Turns out the small things were never small.</p>
        <div className="media-row">
          <span className="chip">🎧 an old voice note, if you have one</span>
        </div>
      </>
    ),
  },
  {
    n: "03",
    seal: "03",
    faceTitle: "Something about you that always makes me laugh",
    faceHint: "tap to open",
    count: true,
    illustration: I.laugh,
    heading: "Something about you that always makes me laugh",
    body: (
      <>
        <p>
          Your innocence. Genuinely. There&apos;s a certain baby-like cuteness
          in how you react to things — the way you get confused over the
          simplest stuff, or how seriously you take the smallest things.
          It&apos;s not something you&apos;re doing on purpose, which makes it
          funnier.
        </p>
        <p>
          I could be having the worst day and one dumb reaction from you fixes
          my mood instantly.
        </p>
        <div className="media-row">
          <span className="chip">😂 funniest photo you&apos;ve got</span>
          <span className="chip">keep it light, no caption needed</span>
        </div>
      </>
    ),
  },
  {
    n: "04",
    seal: "04",
    faceTitle: "Something you probably don't realize about yourself",
    faceHint: "tap to open",
    count: true,
    illustration: I.realize,
    heading: "Something you probably don't realize about yourself",
    body: (
      <>
        <p>
          You do so much for the people around you and somehow never register
          it as a big deal. It&apos;s second nature to you — helping, showing
          up, being there — but you never give yourself credit for it.
          You&apos;d probably brush this message off too, saying
          &quot;arre it&apos;s nothing,&quot; which is exactly the point
          I&apos;m making.
        </p>
        <p>It&apos;s not nothing. People notice. I notice.</p>
        <div className="media-row">
          <span className="chip">🎥 short highlight-reel video</span>
        </div>
      </>
    ),
  },
  {
    n: "05",
    seal: "05",
    faceTitle: "A picture that means more than you think",
    faceHint: "tap to open",
    count: true,
    heading: "A picture that means more than you think",
    body: (
      <>
        <p>
          This one photo — I only have one of just us — means more to me than
          you&apos;d guess. It&apos;s not really about how the picture looks.
          It&apos;s what it represents: proof that this moment happened, that we
          existed in the same frame at some point.
        </p>
        <p>I don&apos;t need a caption for this one. The photo says it.</p>
        <div className="photo-slot photo-slot--filled">
          <img
            src="/day-3/Myfav.jpeg"
            alt="A picture that means more than you think"
            className="photo-slot__img"
            loading="lazy"
            decoding="async"
          />
        </div>
      </>
    ),
  },
  {
    n: "06",
    seal: "06",
    faceTitle: "A moment I'd happily relive",
    faceHint: "tap to open",
    count: true,
    illustration: I.relive,
    heading: "A moment I'd happily relive",
    body: (
      <>
        <p>
          Honestly? The moments right after I&apos;ve done something stupid —
          some &quot;altu jalatu harkat&quot; — and you forgive me anyway. Not
          because I enjoy messing up, but because that moment of being
          forgiven, that easy reset, is something I&apos;d replay on loop if I
          could.
        </p>
        <p>
          It says a lot about you that forgiving me is never a whole event. You
          just let it go, and we move on like nothing happened.
        </p>
        <div className="media-row">
          <span className="chip">🎞️ write it like a movie scene</span>
        </div>
      </>
    ),
  },
  {
    n: "07",
    seal: "07",
    faceTitle: "Something I've wanted to say",
    faceHint: "tap to open",
    count: true,
    illustration: I.wantedToSay,
    heading: "Something I've wanted to say",
    body: (
      <>
        <p>
          You are the best person I&apos;ve ever met. I don&apos;t say it often
          because it feels like it should be obvious, but I don&apos;t want it
          to go unsaid — stay exactly the way you are. Don&apos;t let anything
          or anyone change that about you.
        </p>
        <p>
          That&apos;s it. That&apos;s the whole message. Some things don&apos;t
          need three paragraphs to matter.
        </p>
        <div className="media-row">
          <span className="chip">🎧 say it out loud in a voice note</span>
        </div>
      </>
    ),
  },
  {
    n: "08",
    seal: "08",
    faceTitle: "A random thought I've never told you",
    faceHint: "tap to open",
    count: true,
    illustration: I.random,
    heading: "A random thought I've never told you",
    body: (
      <>
        <p>
          Random 2 a.m. thought: what if we&apos;d never met? I try to imagine
          it sometimes and I genuinely can&apos;t picture finding another
          person like you — not a replacement, just someone who fits the same
          way you do. That thought alone makes me appreciate the version of
          life where we did meet.
        </p>
        <div className="media-row">
          <span className="chip">
            💭 split-screen: &quot;never met&quot; vs &quot;what happened&quot;
          </span>
        </div>
      </>
    ),
  },
  {
    n: "09",
    seal: "09",
    faceTitle: "Why this friendship matters to me",
    faceHint: "tap to open",
    count: true,
    illustration: I.friendship,
    heading: "Why this friendship matters to me",
    body: (
      <>
        <p>
          Because it&apos;s old. Because it&apos;s not &quot;matlab ka
          rishta&quot; — not based on convenience, not based on what either of
          us needs at a given moment. It&apos;s lasted through time without
          needing a reason to keep going. That&apos;s rare, and that&apos;s
          exactly why it matters.
        </p>
        <p>
          Most things fade when they stop being useful. This one didn&apos;t,
          because it was never about being useful in the first place.
        </p>
        <div className="media-row">
          <span className="chip">🎨 a small timeline of milestones</span>
        </div>
      </>
    ),
  },
  {
    n: "10",
    seal: "10",
    faceTitle: "One last message",
    faceHint: "tap to open",
    count: true,
    illustration: I.lastMsg,
    heading: "One last message",
    body: (
      <>
        <p>
          I just pray to god that you stay in my life, always. Not asking for
          anything grand — just this one thing, because everything else about
          this friendship already feels like enough.
        </p>
        <div className="media-row">
          <span className="chip">
            🕯️ keep the background quiet — no noise after this one
          </span>
        </div>
      </>
    ),
  },
];

const BONUS: Letter = {
  n: "bonus",
  sealClass: "bonus",
  seal: "🔒",
  faceTitle: "One more — locked for now",
  faceHint: "opens once you've read all ten",
  count: false,
  illustration: I.bonus,
  heading: "Not on the list. Just because.",
  body: (
    <>
      <p>
        You read every single one of them. Even the long ones. Even the ones
        that probably made you roll your eyes a little. That alone says
        something — that you&apos;re willing to sit with my words, messy and
        honest as they are. That&apos;s not something I take for granted.
      </p>
      <p>
        So here&apos;s the real one I saved for last: none of these letters
        were easy to write, but all of them were true. And every single one of
        them was worth it, just for the off-chance that you&apos;d finish
        reading and feel, even for a second, that you are seen. You are. You
        always have been.
      </p>
    </>
  ),
};

const styles = `
  :root {
    --bg-a: #F7F1E3;
    --bg-b: #E4D9C0;
    --paper: #FBF6E9;
    --paper-edge: #E9DFC6;
    --ink: #2E2418;
    --ink-soft: #6E5F49;
    --gold: #A9822F;
    --rose: #9C3F45;
    --hero-text: #2E2418;
    --hero-sub: #6E5F49;
    --seal-text: #FBF6E9;
    --shadow: rgba(46, 36, 24, 0.18);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg-a: #241F33; --bg-b: #14111C; --paper: #F3E8D2; --paper-edge: #E3D5B3;
      --ink: #2E2418; --ink-soft: #7A6B57; --gold: #D4AF37; --rose: #C1555C;
      --hero-text: #F1E9D8; --hero-sub: #C9BCA5; --seal-text: #F3E8D2; --shadow: rgba(0,0,0,0.45);
    }
  }
  * { box-sizing: border-box; }
  .d3-wrap {
    min-height: 100vh;
    background: radial-gradient(circle at 20% -10%, var(--bg-a), var(--bg-b) 75%);
    color: var(--ink);
    font-family: 'Literata', Georgia, 'Times New Roman', serif;
    overflow-x: hidden;
    position: relative;
  }
  .d3-motes { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .d3-mote {
    position: absolute; bottom: -5%; width: 5px; height: 5px; border-radius: 50%;
    background: var(--gold); opacity: 0; animation: d3drift linear infinite;
  }
  @keyframes d3drift {
    0% { transform: translateY(0) translateX(0); opacity: 0; }
    8% { opacity: .35; }
    92% { opacity: .25; }
    100% { transform: translateY(-115vh) translateX(var(--drift-x, 20px)); opacity: 0; }
  }
  .d3-warmth {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(circle at 50% 25%, rgba(212,175,55, var(--warmth, 0)) 0%, transparent 68%);
    transition: background .9s ease;
  }
  .d3-progress {
    display: inline-flex; align-items: center; gap: 8px; margin: 16px auto 0;
    font-size: 12.5px; letter-spacing: .02em; color: var(--hero-sub); opacity: 0;
    animation: d3fadeUp .8s ease-out 1.3s forwards;
  }
  .d3-progress-track { width: 64px; height: 4px; border-radius: 4px; background: rgba(110,95,73,.2); overflow: hidden; }
  .d3-progress-fill { height: 100%; width: 0%; background: var(--rose); transition: width .6s ease; }

  .d3-env.intro .d3-face { background: linear-gradient(180deg, var(--paper) 0%, var(--paper-edge) 100%); }
  .d3-env.intro .d3-seal { background: radial-gradient(circle at 32% 28%, var(--gold), #7a5d1f 78%); font-size: 20px; }

  .d3-env.bonus .d3-face { background: linear-gradient(180deg, var(--paper) 0%, var(--paper-edge) 100%); }
  .d3-env.bonus.locked .d3-face { cursor: not-allowed; opacity: .55; filter: grayscale(.5); }
  .d3-env.bonus.locked .d3-face:hover { transform: none; box-shadow: 0 8px 20px -10px var(--shadow); }
  .d3-env.bonus .d3-seal { background: radial-gradient(circle at 32% 28%, var(--gold), #7a5d1f 78%); }
  .d3-env.bonus.unlocked .d3-seal { animation: d3sealGlow 1.8s ease-in-out 1; }
  @keyframes d3sealGlow {
    0%,100% { box-shadow: inset 0 -3px 6px rgba(0,0,0,.25), 0 3px 6px rgba(0,0,0,.2); }
    40% { box-shadow: 0 0 0 8px rgba(212,175,55,.25), 0 0 18px 4px rgba(212,175,55,.5); }
  }

  .d3-hero { max-width: 640px; margin: 0 auto; padding: clamp(56px,10vh,96px) 24px 32px; text-align: center; position: relative; z-index: 1; }
  .d3-eyebrow {
    font-family: 'Caveat', cursive; font-size: clamp(20px,3vw,24px); color: var(--rose);
    margin: 0 0 6px; transform: rotate(-2deg); display: inline-block;
  }
  .d3-title {
    font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; font-weight: 500; font-style: italic;
    font-size: clamp(34px,6vw,56px); line-height: 1.08; margin: 0 0 18px; color: var(--hero-text);
    background-image: linear-gradient(90deg, var(--hero-text) 0%, var(--hero-text) 100%);
    background-repeat: no-repeat; background-size: 0% 100%; -webkit-background-clip: text;
    background-clip: text; animation: d3inkReveal 1.4s ease-out 0.15s forwards;
  }
  @keyframes d3inkReveal { to { background-size: 100% 100%; } }
  .d3-sub {
    font-size: clamp(15px,2vw,17px); color: var(--hero-sub); line-height: 1.6; max-width: 46ch;
    margin: 0 auto; opacity: 0; animation: d3fadeUp .8s ease-out 1.1s forwards;
  }
  @keyframes d3fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .d3-letters {
    max-width: 640px; margin: 0 auto; padding: 8px 20px 60px;
    display: flex; flex-direction: column; gap: 22px; perspective: 1400px; position: relative; z-index: 1;
  }
  .d3-env { opacity: 0; transform: translateY(16px); animation: d3settleIn .6s ease-out forwards; }
  .d3-env:nth-child(1) { animation-delay: .15s; }
  .d3-env:nth-child(2) { animation-delay: .25s; }
  .d3-env:nth-child(3) { animation-delay: .35s; }
  .d3-env:nth-child(4) { animation-delay: .45s; }
  .d3-env:nth-child(5) { animation-delay: .55s; }
  .d3-env:nth-child(6) { animation-delay: .65s; }
  .d3-env:nth-child(7) { animation-delay: .75s; }
  .d3-env:nth-child(8) { animation-delay: .85s; }
  .d3-env:nth-child(9) { animation-delay: .95s; }
  .d3-env:nth-child(10) { animation-delay: 1.05s; }
  .d3-env:nth-child(11) { animation-delay: 1.15s; }
  @keyframes d3settleIn { to { opacity: 1; transform: translateY(0); } }

  .d3-face {
    width: 100%; text-align: left;
    background: linear-gradient(180deg, var(--paper) 0%, var(--paper-edge) 100%);
    border: none; border-radius: 10px; padding: 18px 20px;
    display: flex; align-items: center; gap: 16px; cursor: pointer;
    box-shadow: 0 8px 20px -10px var(--shadow);
    transition: transform .35s ease, box-shadow .35s ease;
    position: relative; font-family: inherit;
  }
  .d3-face:hover { transform: translateY(-3px) rotate(-0.3deg); box-shadow: 0 14px 28px -12px var(--shadow); }
  .d3-face:active { transform: translateY(-1px); }
  .d3-face:focus-visible { outline: 2px solid var(--rose); outline-offset: 3px; }

  .d3-seal {
    flex: none; width: 46px; height: 46px; border-radius: 50%;
    background: radial-gradient(circle at 32% 28%, var(--rose), #7c2c31 78%);
    color: var(--seal-text); display: flex; align-items: center; justify-content: center;
    font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px;
    box-shadow: inset 0 -3px 6px rgba(0,0,0,.25), 0 3px 6px rgba(0,0,0,.2);
    transition: transform .5s cubic-bezier(.34,1.56,.64,1);
  }
  .d3-env.open .d3-seal { transform: rotate(50deg) scale(.92); }

  .d3-facetext { flex: 1; min-width: 0; }
  .d3-facetitle {
    font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(15px,2vw,17px);
    color: var(--ink); margin: 0 0 2px;
  }
  .d3-facehint { font-size: 12.5px; color: var(--ink-soft); margin: 0; letter-spacing: .02em; }
  .d3-facehint.locked-hint { color: var(--ink-soft); }

  .d3-chevron { flex: none; width: 18px; height: 18px; color: var(--ink-soft); transition: transform .4s ease; }
  .d3-env.open .d3-chevron { transform: rotate(180deg); }

  .d3-lettercontent { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .55s ease; }
  .d3-env.open .d3-lettercontent { grid-template-rows: 1fr; }
  .d3-letterinner { overflow: hidden; }

  .d3-paper {
    margin-top: 10px; background: var(--paper); border-radius: 10px;
    padding: 24px 24px 22px;
    box-shadow: 0 10px 24px -14px var(--shadow), inset 0 0 0 1px rgba(46,36,24,.05);
    transform: translateY(-6px); transition: transform .55s ease;
  }
  .d3-env.open .d3-paper { transform: translateY(0); }
  .d3-paper h3 {
    font-family: 'Fraunces', serif; font-style: italic; font-weight: 500;
    font-size: clamp(18px,2.4vw,21px); margin: 0 0 12px; color: var(--ink);
  }
  .d3-paper p {
    font-size: 15px; line-height: 1.75; color: var(--ink); margin: 0 0 12px; max-width: 60ch;
  }
  .d3-paper p:last-of-type { margin-bottom: 16px; }

  .media-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(169,130,47,.12); border: 1px solid rgba(169,130,47,.3);
    color: var(--ink-soft); font-size: 12.5px; padding: 6px 11px; border-radius: 100px; line-height: 1.2;
  }
  .photo-slot {
    margin-top: 14px; border: 1.5px dashed rgba(46,36,24,.28); border-radius: 8px; padding: 22px 14px;
    text-align: center; font-size: 12.5px; color: var(--ink-soft); transform: rotate(-0.6deg);
    background: rgba(46,36,24,.02);
  }
  .photo-slot--filled {
    border: none;
    padding: 0;
    overflow: hidden;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(46,36,24,.18), 0 2px 6px rgba(46,36,24,.10);
    background: #f5ecdd;
  }
  .photo-slot__img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 520px;
    object-fit: cover;
    border-radius: 14px;
  }
  .d3-illustration { width: 34px; height: 34px; color: var(--gold); margin-bottom: 8px; display: block; }

  .d3-footer { max-width: 640px; margin: 10px auto 70px; padding: 0 24px; text-align: center; position: relative; z-index: 1; }
  .d3-signoff {
    font-family: 'Caveat', cursive; font-size: clamp(22px,3vw,27px); color: var(--hero-sub);
    transform: rotate(-1deg); display: inline-block;
  }

  @media (max-width: 480px) {
    .d3-face { padding: 15px 14px; gap: 12px; }
    .d3-paper { padding: 20px 16px 18px; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    .d3-title { background-size: 100% 100%; }
    .d3-mote { display: none; }
  }
`;

const TOTAL = 10;

export default function Day3Experience() {
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const warmthRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    node.style.setProperty("--warmth", (opened.size / TOTAL).toFixed(3));
  }, [opened.size]);

  useEffect(() => {
    const t = window.setTimeout(() => setHeroRevealed(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  const motes = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => ({
      left: Math.random() * 100,
      duration: 14 + Math.random() * 10,
      delay: Math.random() * 12,
      driftX: Math.random() * 60 - 30,
      key: i,
    }));
  }, []);

  const handleToggle = (letter: Letter) => (e: React.MouseEvent) => {
    if (letter.sealClass === "bonus" && !bonusUnlocked) return;
    const n = letter.n;
    const isCurrentlyOpen = opened.has(n);
    const next = new Set(opened);
    if (isCurrentlyOpen) next.delete(n);
    else next.add(n);
    setOpened(next);
    if (letter.count && !isCurrentlyOpen) {
      const counted = Array.from(next).filter((id) => {
        const all = [...LETTERS];
        const match = all.find((l) => l.n === id);
        return match?.count;
      }).length;
      if (counted >= TOTAL) setBonusUnlocked(true);
    }
    void e;
  };

  const hintText = (letter: Letter, open: boolean) => {
    if (letter.sealClass === "bonus" && !bonusUnlocked) return "opens once you've read all ten";
    return open ? "tap to close" : "tap to open";
  };

  const seal = (letter: Letter) => {
    if (letter.sealClass === "bonus") {
      return bonusUnlocked ? "✦" : letter.seal;
    }
    return letter.seal;
  };

  const countOpened = Array.from(opened).filter((id) => {
    return LETTERS.find((l) => l.n === id)?.count;
  }).length;

  const progressWidth = `${(countOpened / TOTAL) * 100}%`;

  const allLetters: (Letter & { bonusLocked?: boolean })[] = [
    ...LETTERS,
    { ...BONUS, bonusLocked: !bonusUnlocked },
  ];

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className="d3-wrap"
        style={{ fontFamily: "'Literata', Georgia, 'Times New Roman', serif" }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Literata:ital,wght@0,400;0,500;1,400&family=Caveat:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <div
          className="d3-warmth"
          aria-hidden
          ref={warmthRef}
        />
        <div className="d3-motes" aria-hidden>
          {motes.map((m) => (
            <span
              key={m.key}
              className="d3-mote"
              style={
                {
                  left: `${m.left}%`,
                  animationDuration: `${m.duration}s`,
                  animationDelay: `${m.delay}s`,
                  ["--drift-x" as never]: `${m.driftX}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <header className="d3-hero">
          <span className="d3-eyebrow">day three</span>
          <h1
            className={`d3-title ${heroRevealed ? "revealed" : ""}`}
          >
            The things I never said
          </h1>
          <p className="d3-sub">
            Ten letters, sealed. Tap one open when you&apos;re ready to read it.
          </p>
          <div className="d3-progress">
            <span>
              {countOpened} of {TOTAL} opened
            </span>
            <span className="d3-progress-track">
              <span
                className="d3-progress-fill"
                style={{ width: progressWidth }}
              />
            </span>
          </div>
        </header>

        <main className="d3-letters">
          {allLetters.map((letter) => {
            const open = opened.has(letter.n);
            const envelopeClasses = [
              "d3-env",
              letter.sealClass ?? "",
              letter.sealClass === "bonus"
                ? bonusUnlocked
                  ? "unlocked"
                  : "locked"
                : "",
              open ? "open" : "",
            ]
              .filter(Boolean)
              .join(" ");
            const disabled =
              letter.sealClass === "bonus" && !bonusUnlocked ? true : undefined;
            return (
              <div
                key={letter.n}
                className={envelopeClasses}
                data-n={letter.n}
              >
                <button
                  type="button"
                  className="d3-face"
                  aria-expanded={open}
                  aria-disabled={disabled}
                  onClick={handleToggle(letter)}
                >
                  <span className="d3-seal">{seal(letter)}</span>
                  <span className="d3-facetext">
                    <p className="d3-facetitle">
                      {letter.sealClass === "bonus" && bonusUnlocked
                        ? "One more — just for you."
                        : letter.faceTitle}
                    </p>
                    <p
                      className={`d3-facehint ${
                        letter.sealClass === "bonus" && !bonusUnlocked
                          ? "locked-hint"
                          : ""
                      }`}
                    >
                      {letter.sealClass === "bonus" && bonusUnlocked
                        ? hintText(letter, open)
                        : hintText(letter, open)}
                    </p>
                  </span>
                  <Chevron />
                </button>
                <div className="d3-lettercontent">
                  <div className="d3-letterinner">
                    <div className="d3-paper">
                      {letter.illustration ? (
                        <div
                          className="d3-illustration"
                          style={{ display: "block" }}
                        >
                          {letter.illustration}
                        </div>
                      ) : null}
                      <h3>{letter.heading}</h3>
                      {letter.body}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </main>

        <footer className="d3-footer">
          <span className="d3-signoff">
            — written with you in mind, always.
          </span>
        </footer>
      </div>
    </>
  );
}
