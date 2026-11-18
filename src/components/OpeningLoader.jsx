import { useEffect, useState } from "react";
import { profile } from "../data";
import { useReducedMotion } from "../hooks";
import { ScrambleText } from "./ui";

// Boot screen: a big number liquid-fills with colour while the name decrypts,
// then the screen splits in two and slides away.
//   onReveal   → fired as the panels start opening (hero animations start here)
//   onComplete → fired once the loader can be unmounted
export default function OpeningLoader({ onReveal, onComplete }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Lock scrolling while the loader is up.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (reduced) {
      onReveal();
      const t = setTimeout(onComplete, 60);
      return () => clearTimeout(t);
    }
    const DURATION = 1900;
    const t0 = performance.now();
    let raf = 0;
    const timers = [];
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / DURATION);
      const eased = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else {
        timers.push(
          setTimeout(() => {
            setExiting(true);
            onReveal();
          }, 350),
          setTimeout(onComplete, 350 + 1000),
        );
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [reduced, onReveal, onComplete]);

  const status =
    progress < 35 ? "Loading core components" : progress < 75 ? "Initializing portfolio stack" : progress < 100 ? "Mounting visual assets" : "System ready";

  return (
    <div
      className={`fixed inset-0 z-[100] ${exiting ? "loader-exit pointer-events-none" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="loader-panel top" />
      <div className="loader-panel bottom" />

      <div
        className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 sm:p-10 ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center justify-between font-mono text-xs text-ink-muted">
          <span className="flex items-center gap-2">
            <span className="pulse-dot h-2 w-2 rounded-full bg-volt" />
            SYS.INIT
          </span>
          <span>PORTFOLIO / {new Date().getFullYear()}</span>
        </div>

        <div>
          <p
            className="select-none font-display text-[clamp(7rem,28vw,22rem)] font-extrabold leading-[0.8] tracking-tighter text-transparent"
            style={{
              backgroundImage: `linear-gradient(to top, var(--color-volt) ${progress}%, rgba(238,241,247,0.07) ${progress}%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
            aria-hidden="true"
          >
            {String(progress).padStart(3, "0")}
          </p>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs sm:flex-row sm:items-end sm:justify-between sm:text-sm">
          <p className="text-ink">
            <ScrambleText text={profile.name.toUpperCase()} duration={1300} />
          </p>
          <p className={progress >= 100 ? "text-volt" : "text-ink-muted"}>
            &gt; {status}
            {progress >= 100 ? " ✓" : "…"}
          </p>
        </div>
      </div>
    </div>
  );
}
