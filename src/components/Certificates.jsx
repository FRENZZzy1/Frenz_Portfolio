import { useState } from "react";
import { certificates } from "../data";
import Lightbox from "./Lightbox";

export default function Certificates() {
  const [activeIndex, setActiveIndex] = useState(null);
  const images = certificates.map((c) => c.image);

  return (
    <section id="certificates" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="font-mono text-xs tracking-widest text-amber">04 — CERTIFICATES</p>
        <h2 className="mt-3 font-display text-3xl">Courses & credentials</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <article key={cert.id} className="border border-line bg-surface p-4">
              <button onClick={() => setActiveIndex(i)} className="block w-full overflow-hidden rounded-sm border border-line">
                <img src={cert.image} alt={cert.title} className="h-40 w-full object-cover transition-transform hover:scale-105" />
              </button>
              <h3 className="mt-4 font-display text-lg">{cert.title}</h3>
              <p className="mt-1 font-mono text-xs text-ink-muted">{cert.issuer} · {cert.date}</p>
              {cert.link && cert.link !== "#" && (
                <a href={cert.link} className="mt-3 inline-block font-mono text-xs text-amber hover:text-teal">
                  View credential →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <Lightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChangeIndex={setActiveIndex}
        />
      )}
    </section>
  );
}
