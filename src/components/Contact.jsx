import { useEffect, useState } from "react";
import { profile } from "../data";
import { isRealLink, toUrl, useInView } from "../hooks";
import { Arrow, KineticText, Magnetic, Reveal } from "./ui";

// Local time in the Philippines (matches the location in data.js).
const manilaTime = () =>
  new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });

function LocalTime() {
  const [t, setT] = useState(manilaTime);
  useEffect(() => {
    const id = setInterval(() => setT(manilaTime()), 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="font-mono text-xs text-ink-muted">
      {profile.location} · <span className="text-ink">{t}</span> PHT
    </p>
  );
}

export default function Contact() {
  const [headRef, headIn] = useInView({ threshold: 0.3 });
  // Tracks whether we just copied the email, so the button can say "Copied" for a moment.
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (e.g. permissions) — fail quietly.
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden pt-24 sm:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        <p className="flex items-center gap-4 font-mono text-xs tracking-[0.25em] text-volt">
          <span>06</span>
          <span className="h-px w-16 bg-volt" />
          <span>CONTACT</span>
        </p>

        <h2
          ref={headRef}
          className="mt-6 font-display font-extrabold uppercase leading-[0.9] tracking-tighter text-[clamp(2rem,8.6vw,7.5rem)]"
          aria-label="Let's build something great"
        >
          <KineticText text="Let's build something great." play={headIn} outline={[2]} stagger={26} />
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Reveal>
            <p className="max-w-lg text-lg text-ink-muted">
              Open to opportunities, collaborations, or just a chat about what you're building.
            </p>
            <div className="mt-8">
              <Magnetic strength={0.2}>
                <button
                  onClick={handleCopy}
                  aria-label={`Copy email address ${profile.email}`}
                  className="group relative grid rounded-full bg-volt px-7 py-5 font-display text-lg font-bold text-bg sm:px-10 sm:text-3xl"
                >
                  <span className={`col-start-1 row-start-1 transition-all duration-300 ${copied ? "-translate-y-3 opacity-0" : ""}`}>{profile.email}</span>
                  <span className={`col-start-1 row-start-1 text-center transition-all duration-300 ${copied ? "" : "translate-y-3 opacity-0"}`}>Copied to clipboard ✓</span>
                </button>
              </Magnetic>
              <p className="mt-4 font-mono text-xs text-ink-muted">
                Click to copy · or{" "}
                <a href={`mailto:${profile.email}`} className="text-ink underline decoration-volt underline-offset-4 hover:text-volt">
                  open your mail app
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal delay={150} className="flex flex-col gap-3 lg:items-end">
            {[
              { label: "GitHub", href: toUrl(profile.github) },
              { label: "LinkedIn", href: toUrl(profile.linkedin) },
              ...(isRealLink(profile.resumeUrl) ? [{ label: "Résumé", href: profile.resumeUrl }] : []),
            ].map((l) => (
              <Magnetic key={l.label} strength={0.25}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-64 items-center justify-between rounded-full border border-line bg-surface/60 px-6 py-4 font-display text-xl font-bold backdrop-blur transition-colors hover:border-volt hover:bg-volt hover:text-bg"
                >
                  {l.label}
                  <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                </a>
              </Magnetic>
            ))}
            <div className="mt-2 lg:text-right">
              <LocalTime />
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="mt-24 border-t border-line px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 font-mono text-xs text-ink-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with React + Vite + Tailwind.
          </p>
          <Magnetic strength={0.3}>
            <a href="#top" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-ink transition-colors hover:border-volt hover:text-volt">
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </Magnetic>
        </div>
      </footer>
    </section>
  );
}
