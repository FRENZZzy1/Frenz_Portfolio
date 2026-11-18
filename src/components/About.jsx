import { useRef } from "react";
import { about, skills, stats } from "../data";
import { uniqueSkills, useScrollVar } from "../hooks";
import { Counter, Reveal, SectionHeading } from "./ui";

export default function About() {
  const bioRef = useRef(null);
  // Drives --p (0→1) so the paragraph "lights up" word by word as you scroll.
  useScrollVar(bioRef, { start: 0.85, end: 0.4 });

  const paragraphs = about.trim().split(/\n\s*\n/);
  const total = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  let wi = 0;

  return (
    <section id="about" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="01" label="About" title="Who's building this" />

        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div ref={bioRef} className="scroll-words space-y-7 text-xl font-medium leading-[1.5] sm:text-2xl" style={{ "--n": total }}>
            {paragraphs.map((para, pi) => (
              <p key={pi}>
                {para.split(/\s+/).filter(Boolean).map((word) => (
                  <span key={wi} className="scroll-word" style={{ "--i": wi++ }}>
                    {word}{" "}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <div className="space-y-10 lg:pt-3">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 90}>
                  <div className="h-full rounded-2xl border border-line bg-surface/70 p-5 backdrop-blur transition-colors hover:border-volt/60">
                    <p className="font-display text-4xl font-extrabold leading-none text-volt sm:text-[2.75rem]">
                      <Counter to={s.value} decimals={s.decimals ?? 0} />
                    </p>
                    <p className="mt-3 font-mono text-xs tracking-widest text-ink">{s.label.toUpperCase()}</p>
                    {s.note && <p className="mt-1 font-mono text-[11px] text-ink-muted">{s.note}</p>}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <p className="font-mono text-xs tracking-[0.25em] text-ink-muted">STACK</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {uniqueSkills(skills).map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line bg-surface px-4 py-1.5 font-mono text-xs text-ink-muted transition-all hover:-translate-y-0.5 hover:border-volt hover:text-volt"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
