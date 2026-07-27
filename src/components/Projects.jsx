import { useState } from "react";
import { projects } from "../data";
import Lightbox from "./Lightbox";

function ProjectCard({ project, onOpenGallery }) {
  return (
    <article className="group relative border border-line bg-surface p-6 transition-colors hover:border-teal/60">
      {/* Perforated tear-off edge — the card reads like a sheet ripped from a spec pad */}
      <div
        className="absolute -top-px left-0 right-0 h-px bg-[radial-gradient(circle,_var(--color-bg)_1.5px,_var(--color-line)_1.5px)] bg-[length:10px_3px]"
        aria-hidden="true"
      />

      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs text-ink-muted">{project.id}</span>
        <span className="font-mono text-xs text-ink-muted">SPEC</span>
      </div>

      {project.gallery?.length > 0 && (
        <button
          onClick={() => onOpenGallery(project.gallery)}
          className="mt-4 block w-full overflow-hidden rounded-sm border border-line"
        >
          <img
            src={project.gallery[0]}
            alt={`${project.title} preview`}
            className="h-36 w-full object-cover transition-transform group-hover:scale-105"
          />
        </button>
      )}

      <h3 className="mt-4 font-display text-2xl">{project.title}</h3>
      <p className="mt-3 text-sm text-ink-muted">{project.blurb}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech} className="rounded-sm bg-surface-2 px-2 py-1 font-mono text-[11px] text-ink-muted">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-5 font-mono text-xs">
        <a href={project.link} className="text-amber transition-colors hover:text-teal">
          View →
        </a>
        <a href={project.repo} className="text-ink-muted transition-colors hover:text-teal">
          Repo →
        </a>
        {project.gallery?.length > 1 && (
          <button
            onClick={() => onOpenGallery(project.gallery)}
            className="text-ink-muted transition-colors hover:text-teal"
          >
            Gallery ({project.gallery.length}) →
          </button>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  // activeGallery holds the image list currently open in the lightbox
  // (null when it's closed); activeIndex tracks which image is showing.
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function openGallery(images) {
    setActiveGallery(images);
    setActiveIndex(0);
  }

  return (
    <section id="projects" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="font-mono text-xs tracking-widest text-amber">02 — PROJECTS</p>
        <h2 className="mt-3 font-display text-3xl">Things I've built</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpenGallery={openGallery} />
          ))}
        </div>
      </div>

      {activeGallery && (
        <Lightbox
          images={activeGallery}
          index={activeIndex}
          onClose={() => setActiveGallery(null)}
          onChangeIndex={setActiveIndex}
        />
      )}
    </section>
  );
}
