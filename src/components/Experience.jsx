import { useRef } from "react";
import { experience } from "../data";
import { useScrollVar } from "../hooks";
import { Reveal, SectionHeading, TiltCard } from "./ui";

export default function Experience() {
  const listRef = useRef(null);
  // The gradient line "draws" down the timeline as you scroll.
  useScrollVar(listRef, { start: 0.7, end: 0.5 });

  return (
    <section id="experience" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="03" label="Experience" title="Where I've worked" />

        <ol ref={listRef} className="relative ml-2 space-y-14 pl-9 sm:ml-6 sm:pl-16" style={{ "--p": 0 }}>
          <span aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-line" />
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-volt via-plasma to-coral"
            style={{ transform: "scaleY(var(--p))" }}
          />

          {experience.map((job) => {
            const current = /present/i.test(job.period);
            return (
              <li key={job.id} className="relative">
                {/* timeline node */}
                <span
                  aria-hidden="true"
                  className="absolute top-8 -left-[calc(2.25rem+7px)] grid h-3.5 w-3.5 place-items-center rounded-full bg-bg sm:-left-[calc(4rem+7px)]"
                >
                  <span className={`h-3.5 w-3.5 rounded-full border-2 border-volt ${current ? "pulse-dot bg-volt" : "bg-bg"}`} />
                </span>

                <Reveal>
                  <TiltCard max={2} className="rounded-3xl border border-line bg-surface/80 p-7 backdrop-blur sm:p-10">
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-muted">
                      <span>{job.period.toUpperCase()}</span>
                      {current && <span className="rounded-full bg-volt/15 px-2.5 py-0.5 text-volt">NOW</span>}
                    </div>
                    <h3 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">{job.role}</h3>
                    <p className="mt-2 font-mono text-sm text-plasma sm:text-base">@ {job.org}</p>

                    <ul className="mt-8 space-y-3">
                      {job.points.map((point, i) => (
                        <li key={i} className="flex gap-3 text-ink-muted">
                          <span className="mt-0.5 font-mono text-volt">→</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
