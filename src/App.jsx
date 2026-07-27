import { useState } from "react";
import OpeningLoader from "./components/OpeningLoader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects"; // If applicable
import Certificates from "./components/Certificates";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import ChatAssistant from "./components/ChatAssistant";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Show intro loader on initial page load */}
      {loading && <OpeningLoader onComplete={() => setLoading(false)} />}

      <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-700"}>
        <Nav />
        <main>
          <Hero />
          <About />
          <Experience />
          <Certificates />
          <Achievements />
          <Contact />
        </main>
        <ChatAssistant />
      </div>
    </>
  );
}