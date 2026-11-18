import { useEffect, useRef, useState } from "react";
import { hasFinePointer, prefersReducedMotion, useInView, useReducedMotion } from "../hooks";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

// Text that "decrypts" into place, left to right. The real text is always in
// the DOM (hidden while scrambling) so screen readers and layout are stable.
export function ScrambleText({ text, play = true, delay = 0, duration = 900, className = "" }) {
  const reduced = useReducedMotion();
  const [overlay, setOverlay] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!play || reduced) return;
    let raf = 0;
    let last = 0;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / duration);
        if (now - last > 32 || k === 1) {
          last = now;
          const reveal = Math.floor(k * text.length);
          setOverlay(
            text
              .split("")
              .map((c, i) => (c === " " ? " " : i < reveal ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
              .join(""),
          );
        }
        if (k < 1) raf = requestAnimationFrame(tick);
        else {
          setOverlay(null);
          setDone(true);
        }
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [play, text, delay, duration, reduced]);

  const showReal = reduced || done;
  return (
    <span className={`relative inline-block ${className}`}>
      <span className={showReal ? "" : "opacity-0"}>{text}</span>
      {!showReal && overlay && (
        <span aria-hidden="true" className="absolute inset-0 whitespace-pre-wrap">
          {overlay}
        </span>
      )}
    </span>
  );
}

// Fade/slide in when scrolled into view.
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`} style={{ "--d": `${delay}ms` }}>
      {children}
    </Tag>
  );
}

// Eyebrow + big scramble-in title used at the top of each section.
export function SectionHeading({ index, label, title }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className="mb-12 sm:mb-16">
      <div className="flex items-center gap-4 font-mono text-xs tracking-[0.25em] text-volt">
        <span>{index}</span>
        <span
          className="h-px w-16 origin-left bg-volt transition-transform duration-1000 ease-out"
          style={{ transform: inView ? "scaleX(1)" : "scaleX(0)" }}
        />
        <span>{label.toUpperCase()}</span>
      </div>
      <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
        <ScrambleText text={title} play={inView} />
      </h2>
    </div>
  );
}

// Giant headline whose letters rise out of a mask, one by one.
export function KineticText({ text, play, outline = [], stagger = 55, className = "" }) {
  let n = 0;
  return (
    <span className={`block ${play ? "is-ready" : ""} ${className}`} style={{ "--stagger": `${stagger}ms` }}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className={`kinetic-word ${outline.includes(wi) ? "text-outline" : ""}`} aria-hidden="true">
          {[...word].map((ch) => (
            <span key={n} className="kinetic-letter" style={{ "--i": n++ }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

// Count-up number that runs when scrolled into view.
export function Counter({ to, decimals = 0 }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setV(to);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 1600);
      setV(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals)}
    </span>
  );
}

// 3D tilt + cursor-following spotlight. Mouse only — touch is left alone.
// Pass max={0} for the spotlight without the tilt.
export function TiltCard({ children, className = "", max = 7 }) {
  const ref = useRef(null);
  function onMove(e) {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  }
  function onLeave() {
    const el = ref.current;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt spot ${className}`}>
      {children}
    </div>
  );
}

// Wrapper that gently pulls its child toward the cursor when it gets close.
export function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const reach = Math.max(r.width, r.height) * 0.85;
      if (Math.hypot(dx, dy) < reach) el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      else el.style.transform = "";
    };
    const reset = () => (el.style.transform = "");
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
    };
  }, [strength]);
  return (
    <span ref={ref} className={`inline-block transition-transform duration-300 ease-out ${className}`}>
      {children}
    </span>
  );
}

export function Star({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 fill-current ${className}`} aria-hidden="true">
      <path d="M12 0c.6 6.7 5.3 11.4 12 12-6.7.6-11.4 5.3-12 12-.6-6.7-5.3-11.4-12-12C6.7 11.4 11.4 6.7 12 0z" />
    </svg>
  );
}

export function Arrow({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
