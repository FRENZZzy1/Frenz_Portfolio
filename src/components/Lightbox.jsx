import { useEffect } from "react";

// A simple full-screen image viewer. Pass it the list of images, which
// index is currently active, and setters to change/close it.
export default function Lightbox({ images, index, onClose, onChangeIndex }) {
  // Close on Escape, navigate with arrow keys, and lock page scroll while open.
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChangeIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onChangeIndex((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [index, images.length, onClose, onChangeIndex]);

  const go = (d) => onChangeIndex((index + d + images.length) % images.length);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[110] flex items-center justify-center bg-bg/95 p-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-volt hover:text-volt"
        aria-label="Close gallery"
      >
        close ✕
      </button>

      <div className="flex max-h-full max-w-6xl flex-col items-center gap-5" onClick={(e) => e.stopPropagation()}>
        <img
          key={images[index]}
          src={images[index]}
          alt={`Gallery image ${index + 1} of ${images.length}`}
          className="animate-pop-in max-h-[80vh] rounded-2xl border border-line object-contain shadow-2xl shadow-black"
        />

        {images.length > 1 && (
          <div className="flex items-center gap-4 font-mono text-xs text-ink-muted">
            <button onClick={() => go(-1)} className="rounded-full border border-line px-4 py-2 transition-colors hover:border-volt hover:text-volt">
              ← prev
            </button>
            <span className="tabular-nums">
              {index + 1} / {images.length}
            </span>
            <button onClick={() => go(1)} className="rounded-full border border-line px-4 py-2 transition-colors hover:border-volt hover:text-volt">
              next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
