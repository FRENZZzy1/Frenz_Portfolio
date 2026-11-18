import { useEffect, useRef, useState } from "react";

// ── Small shared helpers + hooks for the motion layer ──────────────────────

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

// True once the element has scrolled into view (fires once by default).
export function useInView({ threshold = 0.2, rootMargin = "0px 0px -8% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView];
}

// Writes a 0→1 CSS variable on the element as it travels through the viewport.
// No React re-renders — styling is driven entirely by CSS using the variable.
export function useScrollVar(ref, { start = 0.9, end = 0.3, name = "--p" } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const s = vh * start;
      const e = vh * end;
      const p = (s - r.top) / (r.height + (s - e));
      el.style.setProperty(name, Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, start, end, name]);
}

// Preloads a list of image URLs and returns only the ones that actually load,
// with their natural sizes. A missing file simply drops out instead of showing
// a broken-image icon.
export function useLoadedImages(urls) {
  const key = (urls || []).join("|");
  const [state, setState] = useState({ key: "", list: [] });
  useEffect(() => {
    let alive = true;
    Promise.all(
      (urls || []).map(
        (src) =>
          new Promise((resolve) => {
            const im = new Image();
            im.onload = () => resolve({ src, w: im.naturalWidth, h: im.naturalHeight });
            im.onerror = () => resolve(null);
            im.src = src;
          }),
      ),
    ).then((results) => {
      if (alive) setState({ key, list: results.filter(Boolean) });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state.key === key ? state.list : [];
}

// De-dupes a skills list ignoring case/underscores ("Firebase" == "Fire_base").
export function uniqueSkills(list) {
  const seen = new Set();
  return list.filter((s) => {
    const k = s.toLowerCase().replace(/[^a-z0-9+#]/g, "");
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// "www.linkedin.com/in/x" → "https://www.linkedin.com/in/x"
export function toUrl(u) {
  if (!u) return "";
  return /^(https?:|mailto:)/.test(u) ? u : `https://${u}`;
}

export const isRealLink = (l) => Boolean(l) && l !== "#";
