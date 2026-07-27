import { useState } from "react";
import { achievements } from "../data";
import Lightbox from "./Lightbox";

export default function Achievements() {
  // Only achievements that have a photo can be opened in the lightbox.
  const withImages = achievements.filter((item) => item.image);
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="achievements" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="font-mono text-xs tracking-widest text-amber">05 — ACHIEVEMENTS</p>
        <h2 className="mt-3 font-display text-3xl">Notable wins</h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {achievements.map((item) => (
            <div key={item.id} className="border border-line bg-surface p-5">
              {item.image && (
                <button
                  onClick={() => setActiveIndex(withImages.findIndex((i) => i.id === item.id))}
                  className="mb-4 block w-full overflow-hidden rounded-sm border border-line"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-44 w-full object-cover transition-transform hover:scale-105"
                  />
                </button>
              )}

              <div className="flex gap-4">
                <span className="font-mono text-xs text-amber">{item.date}</span>
                <div>
                  <h3 className="font-display text-lg">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <Lightbox
          images={withImages.map((i) => i.image)}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChangeIndex={setActiveIndex}
        />
      )}
    </section>
  );
}