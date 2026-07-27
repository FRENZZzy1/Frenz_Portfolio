import { about, skills } from "../data";

export default function About() {
  return (
    <section id="about" className="border-b border-line">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 sm:grid-cols-[1fr_1.4fr] sm:py-28">
        <div>
          <p className="font-mono text-xs tracking-widest text-amber">01 — ABOUT</p>
          <h2 className="mt-3 font-display text-3xl">Who's building this</h2>
        </div>

        <div>
          <p className="whitespace-pre-line text-ink-muted">{about}</p>

          <p className="mt-8 font-mono text-xs tracking-widest text-ink-muted">
            STACK
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-sm border border-line bg-surface px-3 py-1 font-mono text-xs text-ink-muted"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
