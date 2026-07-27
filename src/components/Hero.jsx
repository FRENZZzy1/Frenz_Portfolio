import { profile } from "../data";

// Small crosshair mark used in the corners of the hero — a nod to
// blueprint/drafting registration marks.
function RegistrationMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfilePhoto() {
  // Shows the photo from data.js if set; otherwise falls back to initials
  // in a circle. Also falls back automatically if the image path 404s.
  return (
    <div className="relative h-28 w-28 shrink-0 rounded-full border-2 border-amber bg-surface p-1 sm:h-36 sm:w-36">
      {profile.photo ? (
        <img
          src={profile.photo}
          alt={profile.name}
          className="h-full w-full rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="flex h-full w-full items-center justify-center rounded-full bg-surface-2 font-display text-3xl text-ink-muted"
        style={{ display: profile.photo ? "none" : "flex" }}
      >
        {initials(profile.name)}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div className="blueprint-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />

      <RegistrationMark className="absolute left-4 top-4 h-6 w-6 text-line sm:left-8 sm:top-8" />
      <RegistrationMark className="absolute bottom-4 right-4 h-6 w-6 text-line sm:bottom-8 sm:right-8" />

      <div className="relative mx-auto max-w-5xl px-6 py-28 sm:py-36">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <ProfilePhoto />

          <div>
            <p className="font-mono text-xs tracking-widest text-amber">
              OPEN TO OPPORTUNITIES
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-4 font-mono text-sm text-ink-muted sm:text-base">
              {profile.role} · {profile.location}
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-lg text-ink-muted">
          {profile.tagline}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-sm border border-amber bg-amber px-5 py-2.5 font-mono text-sm text-bg transition-transform hover:-translate-y-0.5"
          >
            View work
          </a>
          <a
            href="#contact"
            className="rounded-sm border border-line px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-teal hover:text-teal"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
