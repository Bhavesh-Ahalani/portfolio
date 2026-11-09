import { useEffect, useState } from "react";
import { RESUME_URL } from "content";
import { getChapters, measureCenters, scrollProgress, scrollToChapter } from "utils";

// Loading counter that wipes away, then hides itself.
// A CSS fallback in index.css hides it too if scripts fail.
export function Loader({ gsap, reduce }) {
  const [gone, setGone] = useState(reduce);

  useEffect(() => {
    if (reduce) return undefined;
    const counter = { v: 0 };
    const label = document.getElementById("loaderCount");
    const tween = gsap.to(counter, {
      v: 100,
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => {
        if (label) label.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
      onComplete: () => {
        gsap.to("#loader", {
          clipPath: "inset(0 0 100% 0)",
          duration: 1,
          ease: "expo.inOut",
          onComplete: () => setGone(true),
        });
      },
    });
    return () => tween.kill();
  }, [gsap, reduce]);

  if (gone) return null;
  return (
    <div className="loader" id="loader" aria-hidden="true">
      <div className="loader-label">Loading weights</div>
      <div className="loader-count" id="loaderCount">
        000
      </div>
    </div>
  );
}

export function TopBar({ experienceIndex, contactIndex }) {
  const go = (i) => (e) => {
    e.preventDefault();
    scrollToChapter(i);
  };
  return (
    <header className="top">
      <a className="mark" href="#intro" onClick={go(0)} aria-label="Back to top">
        BA
      </a>
      <nav aria-label="Primary">
        <a className="hide-sm" href="#before" onClick={go(experienceIndex)}>
          Experience
        </a>
        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
          Resume
        </a>
        <a href="#contact" onClick={go(contactIndex)}>
          Contact
        </a>
      </nav>
    </header>
  );
}

// Side index of chapters; the active one grows and shows its name.
export function ChapterNav({ labels }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let centers = [];
    const measure = () => {
      centers = measureCenters(getChapters());
    };
    const onScroll = () => setActive(Math.round(scrollProgress(centers)));
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("relayout", measure);
    window.addEventListener("load", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("relayout", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  return (
    <nav className="chapters" aria-label="Chapters">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          className={i === active ? "on" : ""}
          aria-label={`Go to ${label}`}
          aria-current={i === active ? "step" : undefined}
          onClick={() => scrollToChapter(i)}
        >
          <span className="lbl">{label}</span>
          <span className="tick" />
        </button>
      ))}
    </nav>
  );
}

// Dot + trailing ring cursor on mouse devices, with magnetic buttons.
export function Cursor({ enabled, reduce }) {
  useEffect(() => {
    if (!enabled) return undefined;
    const cursor = document.getElementById("cursor");
    const ring = cursor.querySelector(".ring");
    const dot = cursor.querySelector(".dot");
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...mouse };
    let raf = 0;

    document.body.classList.add("has-cursor");

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const magnet = !reduce && e.target.closest && e.target.closest(".magnetic");
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        magnet.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      }
    };
    const onOver = (e) => {
      if (e.target.closest && e.target.closest("a, button")) cursor.classList.add("hover");
    };
    const onOut = (e) => {
      if (e.target.closest && e.target.closest("a, button")) cursor.classList.remove("hover");
      const magnet = e.target.closest && e.target.closest(".magnetic");
      if (magnet && !magnet.contains(e.relatedTarget)) {
        magnet.style.transition = "transform .5s cubic-bezier(.23,1,.32,1)";
        magnet.style.transform = "";
        window.setTimeout(() => {
          magnet.style.transition = "";
        }, 500);
      }
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      trail.x += (mouse.x - trail.x) * 0.18;
      trail.y += (mouse.y - trail.y) * 0.18;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      ring.style.left = `${trail.x}px`;
      ring.style.top = `${trail.y}px`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, [enabled, reduce]);

  if (!enabled) return null;
  return (
    <div className="cursor" id="cursor" aria-hidden="true">
      <div className="ring" />
      <div className="dot" />
    </div>
  );
}
