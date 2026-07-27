import { useState } from "react";
import { profile } from "../data";

export default function Contact() {
  // Tracks whether we just copied the email, so the button can say "Copied"
  // for a moment before reverting.
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
    <section id="contact">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="font-mono text-xs tracking-widest text-amber">06 — CONTACT</p>
        <h2 className="mt-3 font-display text-3xl">Let's talk</h2>
        <p className="mt-4 max-w-lg text-ink-muted">
          Open to opportunities, collaborations, or just a chat about what you're building.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={handleCopy}
            className="rounded-sm border border-amber bg-amber px-5 py-2.5 font-mono text-sm text-bg transition-transform hover:-translate-y-0.5"
          >
            {copied ? "Copied ✓" : profile.email}
          </button>
          <a
            href={profile.github}
            className="font-mono text-sm text-ink-muted transition-colors hover:text-teal"
          >
            GitHub →
          </a>
          <a
            href={profile.linkedin}
            className="font-mono text-sm text-ink-muted transition-colors hover:text-teal"
          >
            LinkedIn →
          </a>
        </div>
      </div>

      <footer className="border-t border-line px-6 py-8">
        <p className="mx-auto max-w-5xl font-mono text-xs text-ink-muted">
          © {new Date().getFullYear()} {profile.name}. Built with React + Vite + Tailwind.
        </p>
      </footer>
    </section>
  );
}
