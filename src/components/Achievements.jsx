import { useState } from "react";
import { achievements } from "../data";
import Lightbox from "./Lightbox";
import { useInView } from "../hooks";
import { SectionHeading } from "./ui";

export default function Achievements() {
  // Only achievements that have a photo can be opened in the lightbox.
  const withImages = achievements.filter((item) => item.image);
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="achievements" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading index="05" label="Achievements" title="Notable wins" />

        <div className="space-y-24 sm:space-y-36">
          {achievements.map((item, i) => (
            <Row
              key={item.id}
              item={item}
              flip={i % 2 === 1}
              n={i + 1}
              onOpen={() => setActiveIndex(withImages.findIndex((w) => w.id === item.id))}
            />
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <Lightbox images={withImages.map((i) => i.image)} index={activeIndex} onClose={() => setActiveIndex(null)} onChangeIndex={setActiveIndex} />
      )}
    </section>
  );
}

function Row({ item, flip, n, onOpen }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <article ref={ref} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      {item.image && (
        <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
          <button
            onClick={onOpen}
            data-cursor-label="View"
            aria-label={`View photo: ${item.title}`}
            className={`clip-reveal ${inView ? "in" : ""} block aspect-[4/3] w-full overflow-hidden`}
          >
            <img src={item.image} alt={item.title} className="h-full w-full object-cover object-[50%_30%]" />
          </button>
        </div>
      )}

      <div className={`${item.image ? "lg:col-span-5" : "lg:col-span-12"} ${flip ? "lg:order-1" : ""}`}>
        <div
          className="transition-all duration-1000 ease-out"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(36px)", transitionDelay: "300ms" }}
        >
          <div className="flex items-end justify-between gap-4">
            <span className="text-outline font-display text-7xl font-extrabold leading-none sm:text-8xl">{item.date}</span>
            <span className="pb-2 font-mono text-xs text-ink-muted">A/{String(n).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{item.title}</h3>
          <p className="mt-4 leading-relaxed text-ink-muted">{item.description}</p>
        </div>
      </div>
    </article>
  );
}
