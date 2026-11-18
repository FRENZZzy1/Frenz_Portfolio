import { useEffect, useRef, useState } from "react";
import { projects } from "../data";
import { isRealLink, useLoadedImages } from "../hooks";
import Lightbox from "./Lightbox";
import { Arrow, SectionHeading, TiltCard } from "./ui";

// Where each phone sits in the fan, depending on how many screenshots exist.
function fanSlots(n) {
  if (n === 1) return [{ x: 0, r: 0, z: 1 }];
  if (n === 2) return [{ x: -24, r: -7, z: 1 }, { x: 24, r: 7, z: 2 }];
  return [{ x: -38, r: -10, z: 1 }, { x: 0, r: 0, z: 3 }, { x: 38, r: 10, z: 2 }];
}

function ProjectVisual({ images, title, onOpen }) {
  if (images.length === 0) return <div className="shimmer min-h-[18rem] rounded-2xl md:min-h-full" aria-hidden="true" />;

  const portrait = images[0].h > images[0].w;

  return (
    <button
      onClick={onOpen}
      data-cursor-label="Gallery"
      aria-label={`Open ${title} gallery`}
      className="group/visual relative block min-h-[18rem] w-full overflow-hidden rounded-2xl border border-line bg-surface-2 text-left"
    >
      {portrait ? (
        // Phone screenshots → fan of devices that spreads on hover
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_60%,rgba(162,139,255,0.22),transparent_65%)]">
          <div className="relative h-[82%] w-full">
            {images.slice(0, 3).map((img, i) => {
              const slot = fanSlots(Math.min(3, images.length))[i];
              return (
                <img
                  key={img.src}
                  src={img.src}
                  alt={`${title} screenshot ${i + 1}`}
                  className="absolute left-1/2 top-0 h-full w-auto rounded-[1.1rem] border-[3px] border-bg shadow-2xl shadow-black/60 transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                  style={{
                    zIndex: slot.z,
                    transform: `translateX(calc(-50% + ${slot.x}%)) rotate(${slot.r}deg)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      ) : (
        // Wide screenshots → browser window sized to the screenshot's own proportions
        <div className="flex h-full items-center p-4 sm:p-6">
          <div className="w-full">
            <div className="flex items-center gap-1.5 rounded-t-xl border border-b-0 border-line bg-surface px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-coral/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffc94a]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-volt/80" />
              <span className="ml-3 h-4 flex-1 rounded-full bg-surface-2" />
            </div>
            <div
              className="sheen relative overflow-hidden rounded-b-xl border border-line"
              style={{ aspectRatio: `${images[0].w} / ${images[0].h}` }}
            >
              <img
                src={images[0].src}
                alt={`${title} preview`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/visual:scale-[1.04]"
              />
            </div>
          </div>
        </div>
      )}
      <span className="absolute bottom-4 right-4 z-10 rounded-full bg-bg/80 px-3 py-1.5 font-mono text-[11px] text-ink backdrop-blur">
        {images.length} {images.length === 1 ? "screenshot" : "screenshots"}
      </span>
    </button>
  );
}

function ProjectCard({ project, index, total, onOpenGallery }) {
  const images = useLoadedImages(project.gallery);

  return (
    <TiltCard max={0} className="rounded-[1.75rem] border border-line bg-surface">
      <article className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_1.05fr] md:gap-12">
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <span className="text-outline font-display text-7xl font-extrabold leading-none sm:text-8xl">{project.id}</span>
            <span className="font-mono text-xs text-ink-muted">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-8 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{project.title}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{project.blurb}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-[11px] text-ink-muted">
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-3 pt-8 font-mono text-xs">
            {isRealLink(project.link) && (
              <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-medium text-bg transition-transform hover:-translate-y-0.5">
                Live demo <Arrow />
              </a>
            )}
            {isRealLink(project.repo) && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-ink transition-colors hover:border-volt hover:text-volt">
                Source code <Arrow />
              </a>
            )}
          </div>
        </div>

        <ProjectVisual images={images} title={project.title} onOpen={() => onOpenGallery(images.map((i) => i.src))} />
      </article>
    </TiltCard>
  );
}

export default function Projects() {
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const stackRef = useRef(null);

  // As the next card slides over a stuck card, shrink + dim the one underneath.
  useEffect(() => {
    const cont = stackRef.current;
    if (!cont) return;
    const items = [...cont.querySelectorAll("[data-stack]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      items.forEach((el, i) => {
        const inner = el.firstElementChild;
        const next = items[i + 1];
        const style = getComputedStyle(el);
        if (!next || style.position !== "sticky") {
          inner.style.setProperty("--s", 1);
          inner.style.setProperty("--dim", 0);
          return;
        }
        const top = parseFloat(style.top) || 0;
        const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - top) / el.offsetHeight));
        inner.style.setProperty("--s", (1 - p * 0.06).toFixed(4));
        inner.style.setProperty("--dim", (p * 0.55).toFixed(3));
      });
    };
    const onScroll = () => !raf && (raf = requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function openGallery(images) {
    if (!images.length) return;
    setActiveGallery(images);
    setActiveIndex(0);
  }

  return (
    <section id="projects" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="02" label="Projects" title="Things I've built" />

        <div ref={stackRef}>
          {projects.map((project, i) => (
            <div key={project.id} data-stack className="stack-card mb-10 md:mb-[10vh]" style={{ "--k": i }}>
              <div className="stack-inner relative">
                <ProjectCard project={project} index={i} total={projects.length} onOpenGallery={openGallery} />
                {/* dimmer that fades in as the next card covers this one */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 rounded-[1.75rem] bg-bg"
                  style={{ opacity: "var(--dim, 0)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeGallery && (
        <Lightbox images={activeGallery} index={activeIndex} onClose={() => setActiveGallery(null)} onChangeIndex={setActiveIndex} />
      )}
    </section>
  );
}
