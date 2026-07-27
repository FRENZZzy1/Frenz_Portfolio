import { useEffect, useState } from "react";
import { profile } from "../data";

export default function OpeningLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // 1. Progress increment animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment speed for a natural terminal loading feel
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 2. Trigger fade out when progress completes
    if (progress >= 100) {
      const fadeTimeout = setTimeout(() => {
        setFading(true);
      }, 300);

      const doneTimeout = setTimeout(() => {
        onComplete();
      }, 800); // Duration matches the CSS fade transition

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(doneTimeout);
      };
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg p-6 transition-opacity duration-500 ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Blueprint Dot Grid Background */}
      <div className="blueprint-grid absolute inset-0 opacity-30" />

      {/* Terminal Loading Container */}
      <div className="relative z-10 w-full max-w-sm rounded-sm border border-line bg-surface p-6 shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse" />
            <span className="font-mono text-xs text-amber">
              SYS.INIT // {profile.name.toUpperCase().replace(/\s+/g, "_")}
            </span>
          </div>
          <span className="font-mono text-xs text-ink-muted">{progress}%</span>
        </div>

        {/* Status Text Stream */}
        <div className="my-5 min-h-[2.5rem] font-mono text-xs text-ink-muted">
          {progress < 30 && <p className="animate-pulse">&gt; Loading core components...</p>}
          {progress >= 30 && progress < 70 && <p className="animate-pulse">&gt; Initializing portfolio stack...</p>}
          {progress >= 70 && progress < 100 && <p className="animate-pulse">&gt; Mounting visual assets...</p>}
          {progress >= 100 && <p className="text-teal font-medium">&gt; System ready ✓</p>}
        </div>

        {/* Progress Bar Container */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2 border border-line">
          <div
            className="h-full bg-amber transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}