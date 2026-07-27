import { useEffect } from "react";

// A simple full-screen image viewer. Pass it the list of images, which
// index is currently active, and setters to change/close it.
export default function Lightbox({ images, index, onClose, onChangeIndex }) {
  // Close on Escape, navigate with arrow keys — runs once while the
  // lightbox is open (see the empty-ish dependency array below).
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChangeIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onChangeIndex((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose, onChangeIndex]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/95 p-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 font-mono text-sm text-ink-muted hover:text-amber"
        aria-label="Close gallery"
      >
        close ✕
      </button>

      <div className="flex max-h-full max-w-5xl flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt={`Gallery image ${index + 1} of ${images.length}`}
          className="max-h-[85vh] rounded-sm border border-line object-contain"
        />

        {images.length > 1 && (
          <div className="flex items-center gap-6 font-mono text-sm text-ink-muted">
            <button onClick={() => onChangeIndex((index - 1 + images.length) % images.length)} className="hover:text-amber">
              ← prev
            </button>
            <span>{index + 1} / {images.length}</span>
            <button onClick={() => onChangeIndex((index + 1) % images.length)} className="hover:text-amber">
              next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
