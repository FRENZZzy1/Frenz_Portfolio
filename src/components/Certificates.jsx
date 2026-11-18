import { useState } from "react";
import { certificates } from "../data";
import { isRealLink } from "../hooks";
import Lightbox from "./Lightbox";
import { Arrow, Reveal, SectionHeading, TiltCard } from "./ui";

export default function Certificates() {
  const [activeIndex, setActiveIndex] = useState(null);
  const images = certificates.map((c) => c.image);

  return (
    <section id="certificates" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="04" label="Certificates" title="Courses & credentials" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Reveal key={cert.id} delay={i * 110}>
              <TiltCard className="group h-full rounded-3xl border border-line bg-surface p-4">
                <button
                  onClick={() => setActiveIndex(i)}
                  data-cursor-label="View"
                  aria-label={`View ${cert.title} certificate`}
                  className="sheen block w-full overflow-hidden rounded-2xl border border-line"
                >
                  <img src={cert.image} alt={cert.title} className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </button>
                <div className="px-2 pb-2 pt-5">
                  <p className="font-mono text-[11px] tracking-widest text-volt">{cert.date}</p>
                  <h3 className="mt-2 font-display text-xl font-bold leading-snug">{cert.title}</h3>
                  <p className="mt-1 font-mono text-xs text-ink-muted">{cert.issuer}</p>
                  {isRealLink(cert.link) && (
                    <a href={cert.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-volt hover:underline">
                      View credential <Arrow className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <Lightbox images={images} index={activeIndex} onClose={() => setActiveIndex(null)} onChangeIndex={setActiveIndex} />
      )}
    </section>
  );
}
