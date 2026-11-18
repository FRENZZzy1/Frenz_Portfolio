import { skills } from "../data";
import { uniqueSkills } from "../hooks";
import { Star } from "./ui";

// Two crossing, counter-scrolling bands of skills. Purely decorative —
// the same skills are listed as real text in the About section.
function Row({ items, outline }) {
  const group = (
    <div className="flex shrink-0 items-center">
      {items.map((s) => (
        <span key={s} className="flex items-center">
          <span className={`px-6 font-display text-4xl font-extrabold uppercase tracking-tight sm:px-9 sm:text-6xl ${outline ? "text-outline" : ""}`}>{s}</span>
          <Star className="h-5 w-5 sm:h-8 sm:w-8" />
        </span>
      ))}
    </div>
  );
  return (
    <>
      {group}
      {group}
    </>
  );
}

export default function Marquee() {
  const items = uniqueSkills(skills);
  return (
    <section aria-hidden="true" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="marquee -mx-6 -rotate-2 bg-volt py-3 text-bg shadow-[0_20px_60px_-20px_rgba(204,255,51,0.35)]">
        <div className="marquee-track" style={{ "--dur": "45s" }}>
          <Row items={items} />
        </div>
      </div>
      <div className="marquee -mx-6 -mt-6 rotate-[1.5deg] border-y border-line bg-surface py-3 text-ink">
        <div className="marquee-track rev" style={{ "--dur": "55s" }}>
          <Row items={[...items].reverse()} outline />
        </div>
      </div>
    </section>
  );
}
