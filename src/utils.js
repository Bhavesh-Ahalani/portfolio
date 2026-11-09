export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const getChapters = () => Array.from(document.querySelectorAll(".chapter"));

// Vertical centre of each chapter in page coordinates.
export const measureCenters = (sections) =>
  sections.map((s) => {
    const r = s.getBoundingClientRect();
    return r.top + window.scrollY + r.height / 2;
  });

// Turns the scroll position into "chapter number plus fraction":
// 0 at the intro's centre, 1.5 halfway between the 2nd and 3rd chapters, and so on.
export function scrollProgress(centers) {
  if (!centers.length) return 0;
  const vc = window.scrollY + window.innerHeight / 2;
  if (vc <= centers[0]) return 0;
  for (let i = 0; i < centers.length - 1; i++) {
    if (vc < centers[i + 1]) return i + (vc - centers[i]) / (centers[i + 1] - centers[i]);
  }
  return centers.length - 1;
}

export function scrollToChapter(index) {
  const s = getChapters()[index];
  if (!s) return;
  const top = s.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

// Tell the field and ScrollTrigger to re-measure after something changes height.
export function announceRelayout(delay = 480) {
  window.setTimeout(() => window.dispatchEvent(new Event("relayout")), delay);
}
