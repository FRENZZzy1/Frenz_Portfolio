import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile } from "../data";
import { Magnetic } from "./ui";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#certificates", label: "Certificates" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

function Monogram() {
  return (
    <a
      href="#top"
      aria-label={`${profile.name} — back to top`}
      className="grid h-9 w-9 place-items-center rounded-full bg-volt font-display text-sm font-extrabold text-bg transition-transform hover:rotate-[-8deg] hover:scale-110"
    >
      {profile.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)}
    </a>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [pill, setPill] = useState({ x: 0, w: 0, show: false });
  const barRef = useRef(null);
  const listRef = useRef(null);

  // Scroll-progress bar across the very top.
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Which section is under the middle of the viewport.
  useEffect(() => {
    const ids = ["top", ...links.map((l) => l.href.slice(1))];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Slide the highlight pill under the active link.
  useLayoutEffect(() => {
    const a = listRef.current?.querySelector(`[data-id="${active}"]`);
    setPill(a ? { x: a.offsetLeft, w: a.offsetWidth, show: true } : (p) => ({ ...p, show: false }));
  }, [active]);

  // Mobile menu: lock scroll + Esc to close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        ref={barRef}
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-volt via-plasma to-coral"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      {/* Desktop: floating pill */}
      <header className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 lg:block">
        <div className="flex items-center gap-3 rounded-full border border-line bg-bg/70 p-1.5 pr-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <Monogram />
          <nav ref={listRef} className="relative flex items-center font-mono text-xs" aria-label="Primary">
            <span
              aria-hidden="true"
              className="absolute top-0 h-full rounded-full bg-white/10 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
              style={{ left: pill.x, width: pill.w, opacity: pill.show ? 1 : 0 }}
            />
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-id={l.href.slice(1)}
                aria-current={active === l.href.slice(1) ? "true" : undefined}
                className={`relative rounded-full px-4 py-2.5 transition-colors ${
                  active === l.href.slice(1) ? "text-volt" : "text-ink-muted hover:text-ink"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile: compact bar + full-screen menu */}
      <header className="fixed inset-x-3 top-3 z-50 lg:hidden">
        <div className="flex items-center justify-between rounded-full border border-line bg-bg/70 p-1.5 pr-4 backdrop-blur-xl">
          <Monogram />
          <button
            className="font-mono text-xs tracking-widest text-ink"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "CLOSE ✕" : "MENU ＋"}
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-bg/95 px-8 backdrop-blur-2xl transition-opacity duration-500 lg:hidden ${
          open ? "menu-open opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-2">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{ "--i": i }}
              className="menu-link flex items-baseline gap-4 font-display text-[clamp(1.4rem,6.6vw,3rem)] font-extrabold tracking-tight text-ink active:text-volt"
            >
              <span className="font-mono text-xs font-normal text-volt">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menu-link mt-10" style={{ "--i": links.length }}>
          <Magnetic>
            <a href={`mailto:${profile.email}`} className="font-mono text-sm text-ink-muted">
              {profile.email}
            </a>
          </Magnetic>
        </div>
      </div>
    </>
  );
}
