import { useEffect, useMemo, useRef, useState } from "react";
import { profile, stats } from "../data";
import { useReducedMotion } from "../hooks";
import ParticleField from "./ParticleField";
import { Arrow, KineticText, Magnetic, ScrambleText } from "./ui";

function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function ProfilePhoto() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-[22rem] sm:max-w-[26rem]">
      {/* spinning gradient ring that morphs with the photo */}
      <div className="blob-ring absolute -inset-[5px]" aria-hidden="true" />
      <div className="blob relative h-full w-full overflow-hidden bg-surface-2">
        {profile.photo && (
          <img
            src={profile.photo}
            alt={profile.name}
            className="h-full w-full object-cover object-[50%_18%] contrast-[1.05] saturate-[1.05]"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
        )}
        <div
          className="h-full w-full items-center justify-center font-display text-7xl font-extrabold text-ink-muted"
          style={{ display: profile.photo ? "none" : "flex" }}
        >
          {initials(profile.name)}
        </div>
      </div>
    </div>
  );
}

// Rotating text badge, a nod to print-style "stamps".
function Badge() {
  return (
    <div className="absolute -bottom-6 -left-3 h-32 w-32 sm:-left-10 sm:h-36 sm:w-36">
      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <circle cx="60" cy="60" r="58" className="fill-bg stroke-line" strokeWidth="1" />
        <text fontSize="10" className="fill-ink font-mono" fontWeight="500">
          <textPath href="#badge-circle" textLength="270" lengthAdjust="spacing">
            OPEN TO OPPORTUNITIES •{" "}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-volt">
        <Arrow className="h-7 w-7" />
      </span>
    </div>
  );
}

function Sticker() {
  const s = stats[0];
  return (
    <div className="absolute -right-2 top-6 rotate-[7deg] sm:-right-8">
      <div className="animate-float rounded-2xl bg-volt px-4 py-3 text-bg shadow-[0_12px_30px_-8px_rgba(204,255,51,0.45)]">
        <p className="font-mono text-[10px] font-medium tracking-widest">{s.note?.toUpperCase()}</p>
        <p className="font-display text-2xl font-extrabold leading-none">
          {s.label} {s.value.toFixed(s.decimals)}
        </p>
      </div>
    </div>
  );
}

export default function Hero({ ready }) {
  const reduced = useReducedMotion();
  const heroRef = useRef(null);
  const roles = useMemo(() => profile.role.split("|").map((r) => r.trim()).filter(Boolean), []);
  const [ri, setRi] = useState(0);

  // Cycle through the roles in the title line.
  useEffect(() => {
    if (!ready || reduced || roles.length < 2) return;
    const t = setInterval(() => setRi((i) => (i + 1) % roles.length), 3000);
    return () => clearInterval(t);
  }, [ready, reduced, roles.length]);

  // Cursor parallax for the photo column (CSS vars, no re-renders).
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduced) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <section ref={heroRef} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <ParticleField />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-bg)_100%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 pb-28 pt-32 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10">
        <div>
          <p
            className="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-volt"
            style={{ opacity: ready ? 1 : 0, transition: "opacity 1s .2s" }}
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-volt" />
            OPEN TO OPPORTUNITIES
            <span className="hidden text-ink-muted sm:inline">/ {profile.location.toUpperCase()}</span>
          </p>

          <h1
            className="mt-6 font-display font-extrabold uppercase leading-[0.9] tracking-tighter text-[clamp(2.8rem,8.2vw,6.75rem)]"
            aria-label={profile.name}
          >
            <KineticText text={profile.name} play={ready} outline={[1]} />
          </h1>

          <div className="mt-8 flex items-center gap-3 font-mono text-sm text-ink sm:text-lg">
            <span className="text-volt" aria-hidden="true">&gt;</span>
            <span className="sr-only">{profile.role}</span>
            <span aria-hidden="true" className="flex items-center">
              <ScrambleText key={ri} text={roles[ri]} play={ready} duration={700} delay={ri === 0 ? 900 : 0} />
              <span className="caret" />
            </span>
          </div>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
            style={{ opacity: ready ? 1 : 0, transform: ready ? "none" : "translateY(16px)", transition: "all 1s .9s cubic-bezier(.2,.7,.2,1)" }}
          >
            {profile.tagline}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4"
            style={{ opacity: ready ? 1 : 0, transform: ready ? "none" : "translateY(16px)", transition: "all 1s 1.1s cubic-bezier(.2,.7,.2,1)" }}
          >
            <Magnetic>
              <a href="#projects" className="inline-flex items-center gap-2 rounded-full bg-volt px-7 py-3.5 font-mono text-sm font-medium text-bg">
                View work <Arrow />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/40 px-7 py-3.5 font-mono text-sm text-ink backdrop-blur transition-colors hover:border-volt hover:text-volt">
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:mx-0 lg:justify-self-end"
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 1.2s .5s",
          }}
        >
          <div style={{ transform: "translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -14px), 0)", transition: "transform .4s ease-out" }}>
            <ProfilePhoto />
            <Badge />
            <Sticker />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex" aria-hidden="true">
        <span className="font-mono text-[10px] tracking-[0.3em] text-ink-muted">SCROLL</span>
        <span className="scroll-line" />
      </div>
    </section>
  );
}
