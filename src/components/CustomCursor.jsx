import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "../hooks";

// A trailing ring that swells over links and shows a label over elements with
// data-cursor-label, plus a faint ambient glow that follows the pointer.
// Only active for mouse/trackpad users; the native cursor is left visible.
export default function CustomCursor() {
  const ring = useRef(null);
  const label = useRef(null);
  const glow = useRef(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const pos = { x: -200, y: -200 };
    const cur = { x: -200, y: -200 };
    const g = { x: -200, y: -200 };
    let raf = 0;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      ring.current.dataset.on = "1";
    };
    const onOver = (e) => {
      const t = e.target.closest?.("[data-cursor-label], a, button, input, textarea, [role='button']");
      const text = t?.getAttribute("data-cursor-label");
      if (text) {
        ring.current.dataset.state = "label";
        label.current.textContent = text;
      } else if (t) {
        ring.current.dataset.state = "link";
        label.current.textContent = "";
      } else {
        ring.current.dataset.state = "";
        label.current.textContent = "";
      }
    };
    const onLeave = () => (ring.current.dataset.on = "");
    const tick = () => {
      cur.x += (pos.x - cur.x) * 0.2;
      cur.y += (pos.y - cur.y) * 0.2;
      g.x += (pos.x - g.x) * 0.06;
      g.y += (pos.y - g.y) * 0.06;
      ring.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      glow.current.style.transform = `translate3d(${g.x - 260}px, ${g.y - 260}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-0 h-[520px] w-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(204,255,51,0.06), transparent 60%)" }}
      />
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <i ref={label} />
      </div>
    </>
  );
}
