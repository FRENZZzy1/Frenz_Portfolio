import { useState } from "react";
import { profile } from "../data";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#certificates", label: "Certificates" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  // useState gives this component memory: `open` starts as false,
  // and setOpen is the only way to change it. Changing it re-renders the component.
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg tracking-tight">
          {profile.name}
        </a>

        {/* Desktop links */}
        <nav className="hidden gap-5 font-mono text-sm text-ink-muted lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-amber">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle button — clicking it flips `open` */}
        <button
          className="font-mono text-sm text-ink-muted lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? "close" : "menu"}
        </button>
      </div>

      {/* Only rendered when `open` is true */}
      {open && (
        <nav id="mobile-nav" className="flex flex-col gap-1 border-t border-line px-6 py-4 font-mono text-sm lg:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-ink-muted hover:text-amber"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
