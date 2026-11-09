import { useEffect, useRef, useState } from "react";
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL, hero } from "content";
import { announceRelayout } from "utils";

export function Hero() {
  const split = (word) =>
    word.split("").map((ch, i) => (
      <span className="ch" key={i}>
        {ch}
      </span>
    ));
  return (
    <section className="chapter hero" id="intro">
      <div className="copy hero-copy">
        <p className="kicker">{hero.kicker}</p>
        <h1 aria-label={`${hero.firstName} ${hero.lastName}`}>
          <span className="line" aria-hidden="true">
            {split(hero.firstName)}
          </span>
          <span className="line" aria-hidden="true">
            {split(hero.lastName)}
          </span>
        </h1>
        <div className="hero-row">
          <p className="lead">{hero.lead}</p>
          <div className="scroll-hint">
            <i />
            Scroll to move through the work
          </div>
        </div>
      </div>
    </section>
  );
}

function StreamDemo({ question, answer, reduce }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const words = answer.split(" ");

  useEffect(() => {
    const el = ref.current;
    let timer = 0;
    const start = () => {
      if (reduce) {
        setCount(words.length);
        return;
      }
      timer = window.setInterval(() => {
        setCount((c) => {
          if (c + 1 >= words.length) window.clearInterval(timer);
          return Math.min(words.length, c + 1);
        });
      }, 70);
    };
    if (!("IntersectionObserver" in window)) {
      start();
      return () => window.clearInterval(timer);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [reduce, words.length]);

  return (
    <div className="stream-demo rv" ref={ref}>
      <div className="q">{question}</div>
      <div className="a">
        <span>{words.slice(0, count).join(" ")}</span>
        <span className="caret" aria-hidden="true" />
      </div>
    </div>
  );
}

export function WorkChapter({ chapter, reduce }) {
  const { id, kicker, title, body, stat, note, demo } = chapter;
  return (
    <section className="chapter" id={id}>
      <div className="copy">
        <p className="kicker rv">{kicker}</p>
        <h2 className="rv">{title}</h2>
        <p className="body rv">{body}</p>
        {stat && (
          <div className="stat rv">
            <span className="n" data-count={stat.value} data-suffix={stat.suffix}>
              {stat.value}
              {stat.suffix}
            </span>
            <span className="l">{stat.label}</span>
          </div>
        )}
        {note && <p className="note rv">{note}</p>}
        {demo && <StreamDemo question={demo.question} answer={demo.answer} reduce={reduce} />}
      </div>
    </section>
  );
}

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 1v10M1 6h10" />
  </svg>
);

// Career list. Opening a company shows its full resume entry and
// lights up that employer's knot in the helix (via onFocusKnot).
export function Experience({ companies, onFocusKnot }) {
  const [openId, setOpenId] = useState(null);
  const openKnot = companies.find((c) => c.id === openId)?.knot ?? -1;

  const toggle = (c) => {
    const next = openId === c.id ? null : c.id;
    setOpenId(next);
    onFocusKnot(next ? c.knot : -1);
    announceRelayout();
  };

  return (
    <section className="chapter" id="before">
      <div className="copy">
        <p className="kicker rv">2019 to 2026</p>
        <h2 className="rv">Seven years before the AI layer.</h2>
        <p className="hint-sm rv">Select a company to see the work. Its knot in the helix lights up.</p>
        <ol className="timeline rv">
          {companies.map((c) => {
            const open = openId === c.id;
            return (
              <li key={c.id} className={open ? "open" : ""}>
                <button
                  type="button"
                  className="row-btn"
                  aria-expanded={open}
                  aria-controls={`d-${c.id}`}
                  onClick={() => toggle(c)}
                  onPointerEnter={() => onFocusKnot(c.knot)}
                  onFocus={() => onFocusKnot(c.knot)}
                  onPointerLeave={() => onFocusKnot(openKnot)}
                  onBlur={() => onFocusKnot(openKnot)}
                >
                  <span className="co">{c.name}</span>
                  <span className="yr">{c.years}</span>
                  <span className="plus" aria-hidden="true">
                    <PlusIcon />
                  </span>
                  <span className="what">{c.summary}</span>
                </button>
                <div className="detail" id={`d-${c.id}`}>
                  <div>
                    <div className="detail-in">
                      <p className="meta">{c.meta}</p>
                      <ul>
                        {c.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                      {c.awards && <p className="awards">{c.awards}</p>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function Contact() {
  const [label, setLabel] = useState("Copy email");
  const emailRef = useRef(null);

  const copy = () => {
    const selectIt = () => {
      const range = document.createRange();
      range.selectNodeContents(emailRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      setLabel("Selected, press Copy");
    };
    if (!navigator.clipboard) {
      selectIt();
      return;
    }
    navigator.clipboard.writeText(EMAIL).then(() => {
      setLabel("Copied");
      window.setTimeout(() => setLabel("Copy email"), 1800);
    }, selectIt);
  };

  return (
    <section className="chapter contact" id="contact">
      <div className="copy">
        <p className="kicker rv">Bengaluru, working remotely</p>
        <h2 className="rv">Let's build the next one.</h2>
        <div className="email-row rv">
          <a className="email" href={`mailto:${EMAIL}`} ref={emailRef}>
            {EMAIL}
          </a>
          <button className="btn btn-solid magnetic" type="button" onClick={copy}>
            {label}
          </button>
        </div>
        <div className="links rv">
          <a className="btn btn-ghost magnetic" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="btn btn-ghost magnetic" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="btn btn-ghost magnetic" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </div>
      </div>
    </section>
  );
}
