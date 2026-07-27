import { experience } from "../data";

export default function Experience() {
  return (
    <section id="experience" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="font-mono text-xs tracking-widest text-amber">03 — EXPERIENCE</p>
        <h2 className="mt-3 font-display text-3xl">Where I've worked</h2>

        <ol className="relative mt-10 space-y-10 border-l border-line pl-8">
          {experience.map((job) => (
            <li key={job.id} className="relative">
              {/* Tick mark on the timeline */}
              <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-amber bg-bg" />

              <p className="font-mono text-xs text-ink-muted">{job.period}</p>
              <h3 className="mt-1 font-display text-xl">{job.role}</h3>
              <p className="font-mono text-sm text-teal">{job.org}</p>

              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-muted">
                {job.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
