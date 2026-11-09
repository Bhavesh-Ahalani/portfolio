import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { companies, kapsyChapters } from "content";
import { hasFinePointer, prefersReducedMotion } from "utils";
import ParticleField from "components/ParticleField";
import { ChapterNav, Cursor, Loader, TopBar } from "components/Chrome";
import { Contact, Experience, Hero, WorkChapter } from "components/Sections";

gsap.registerPlugin(ScrollTrigger);

const LABELS = ["Intro", ...kapsyChapters.map((c) => c.label), "Before", "Contact"];
const EXPERIENCE_INDEX = LABELS.indexOf("Before");
const CONTACT_INDEX = LABELS.indexOf("Contact");

function App() {
  const [focusKnot, setFocusKnot] = useState(-1);
  const [reduce] = useState(prefersReducedMotion);
  const [fine] = useState(hasFinePointer);

  // Scroll choreography: hero entrance, per-chapter reveals and number counters.
  useEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(".hero h1 .ch", { yPercent: 110, rotate: 6, duration: 1.4, ease: "expo.out", stagger: 0.035, delay: 1.65 });
      gsap.from(".hero .kicker, .hero-row", { opacity: 0, y: 20, duration: 1.2, ease: "expo.out", delay: 2.1, stagger: 0.1 });

      gsap.utils.toArray(".chapter:not(.hero)").forEach((section) => {
        gsap.from(section.querySelectorAll(".rv"), {
          y: 32,
          opacity: 0.12,
          filter: "blur(8px)",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 65%" },
        });
      });

      gsap.utils.toArray("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const counter = { v: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              v: target,
              duration: 1.6,
              ease: "expo.out",
              onUpdate: () => {
                el.textContent = `${Math.round(counter.v)}${suffix}`;
              },
            }),
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("relayout", refresh);
    return () => {
      window.removeEventListener("relayout", refresh);
      ctx.revert();
    };
  }, [reduce]);

  return (
    <>
      <Loader gsap={gsap} reduce={reduce} />
      <ParticleField focusKnot={focusKnot} />
      <div className="veil" aria-hidden="true" />
      <TopBar experienceIndex={EXPERIENCE_INDEX} contactIndex={CONTACT_INDEX} />
      <ChapterNav labels={LABELS} />
      <Cursor enabled={fine} reduce={reduce} />

      <main>
        <Hero />
        {kapsyChapters.map((chapter) => (
          <WorkChapter key={chapter.id} chapter={chapter} reduce={reduce} />
        ))}
        <Experience companies={companies} onFocusKnot={setFocusKnot} />
        <Contact />
      </main>

      <footer className="site-footer">
        <span>Bhavesh Ahalani</span>
        <span>Kapsy, Optum, Soroco, Cognizant, TCS</span>
      </footer>
    </>
  );
}

export default App;
