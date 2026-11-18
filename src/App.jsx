import { useCallback, useState } from "react";
import OpeningLoader from "./components/OpeningLoader";
import CustomCursor from "./components/CustomCursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import ChatAssistant from "./components/ChatAssistant";

export default function App() {
  const [loading, setLoading] = useState(true);
  // `revealed` flips as the loader's panels start opening, so the hero's
  // entrance animation plays *while* the page is being uncovered.
  const [revealed, setRevealed] = useState(false);
  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleDone = useCallback(() => setLoading(false), []);

  return (
    <>
      <a
        href="#about"
        className="sr-only z-[130] rounded-full bg-volt px-4 py-2 font-mono text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <div className="aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <CustomCursor />
      {loading && <OpeningLoader onReveal={handleReveal} onComplete={handleDone} />}

      <Nav />
      <main>
        <Hero ready={revealed} />
        <Marquee />
        <About />
        <Projects />
        <Experience />
        <Certificates />
        <Achievements />
        <Contact />
      </main>
      <ChatAssistant />
    </>
  );
}
