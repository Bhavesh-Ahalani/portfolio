// Builds the particle shapes, one per chapter, in chapter order:
// intro sphere, router, 270-tool lattice, stream ribbon, page wireframe,
// video lens, career helix, contact core.
//
// Every shape is a Float32Array of N points (x, y, z), so the field can morph
// between any two shapes by blending point i of one into point i of the next.

// Small seeded random generator (mulberry32) so shapes look the same on every load.
function makeRandom(seed) {
  let s = seed;
  return function rnd() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildShapes(N) {
  const rnd = makeRandom(7);
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const rotY = (a, x, z) => [x * Math.cos(a) + z * Math.sin(a), -x * Math.sin(a) + z * Math.cos(a)];
  const rotX = (a, y, z) => [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
  const onSphere = (r) => {
    const u = rnd() * 2 - 1;
    const t = rnd() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)];
  };
  const build = (fn) => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const p = fn(i);
      arr[i * 3] = p[0];
      arr[i * 3 + 1] = p[1];
      arr[i * 3 + 2] = p[2];
    }
    return arr;
  };

  // Which employer each helix particle belongs to (0 TCS ... 4 Kapsy), -1 elsewhere.
  const knots = new Float32Array(N).fill(-1);

  const sphere = build(() => {
    if (rnd() < 0.72) return onSphere(2.3 * (1 + gauss() * 0.015));
    return onSphere(2.1 * Math.cbrt(rnd()));
  });

  const router = build(() => {
    const c = rnd();
    const ys = [1.55, 0, -1.55];
    if (c < 0.22) {
      const t = rnd();
      return [-3 + 2.5 * t, gauss() * 0.07, gauss() * 0.07];
    }
    if (c < 0.36) {
      const p = onSphere(0.34 * Math.cbrt(rnd() * 0.4 + 0.6));
      return [p[0] - 0.5, p[1], p[2]];
    }
    const ty = ys[Math.floor(rnd() * 3)];
    if (c < 0.84) {
      const t = rnd();
      const e = t * t * (3 - 2 * t);
      return [-0.5 + 3 * t, ty * e + gauss() * 0.05, gauss() * 0.05];
    }
    const q = onSphere(0.26 * Math.cbrt(rnd()));
    return [2.75 + q[0], ty + q[1], q[2]];
  });

  // 18 x 15 = 270 clusters, one per agent tool.
  const lattice = build((i) => {
    const j = i % 270;
    let x = ((j % 18) - 8.5) * 0.27 + gauss() * 0.03;
    const y = (Math.floor(j / 18) - 7) * 0.27 + gauss() * 0.03;
    const z = -0.11 * x * x + gauss() * 0.03;
    const r = rotY(-0.45, x, z);
    return [r[0], y, r[1]];
  });

  const ribbon = build(() => {
    const u = rnd() * 6 - 3;
    const v = rnd() - 0.5;
    return [u, 0.7 * Math.sin(u * 1.1) + v * 0.18 + gauss() * 0.03, v * 1.3 * Math.cos(u * 0.8) + gauss() * 0.03];
  });

  // A landing page drawn in points: nav, hero, two heading lines, three cards, footer.
  const rects = [
    [-1.5, 1.7, 3, 0.12],
    [-1.5, 0.5, 3, 1],
    [-1.5, 0.18, 2.2, 0.1],
    [-1.5, -0.02, 1.5, 0.1],
    [-1.5, -1.3, 0.9, 1.05],
    [-0.45, -1.3, 0.9, 1.05],
    [0.6, -1.3, 0.9, 1.05],
    [-1.5, -1.85, 3, 0.1],
  ];
  const areas = rects.map((r) => r[2] * r[3]);
  const totalArea = areas.reduce((a, b) => a + b, 0);
  const page = build(() => {
    let pick = rnd() * totalArea;
    let k = 0;
    while (k < rects.length - 1 && pick > areas[k]) pick -= areas[k++];
    const r = rects[k];
    const x = r[0] + rnd() * r[2];
    let y = r[1] + rnd() * r[3];
    let z = gauss() * 0.025;
    [y, z] = rotX(0.12, y, z);
    const b = rotY(-0.5, x, z);
    return [b[0], y, b[1]];
  });

  const lens = build(() => {
    let p;
    if (rnd() < 0.86) {
      const th = rnd() * Math.PI * 2;
      const ph = rnd() * Math.PI * 2;
      const R = 1.9;
      const r = 0.3;
      p = [(R + r * Math.cos(ph)) * Math.cos(th), (R + r * Math.cos(ph)) * Math.sin(th), r * Math.sin(ph)];
    } else {
      const a = rnd() * Math.PI * 2;
      const rr = 1.35 * Math.sqrt(rnd());
      p = [rr * Math.cos(a), rr * Math.sin(a), gauss() * 0.04];
    }
    const a = rotX(-1, p[1], p[2]);
    const b = rotY(0.45, p[0], a[1]);
    return [b[0], a[0], b[1]];
  });

  // Double helix with five knots, one per employer.
  const helix = build((i) => {
    if (rnd() < 0.78) {
      const t = rnd();
      const ang = t * Math.PI * 5 + (rnd() < 0.5 ? 0 : Math.PI);
      knots[i] = Math.min(4, Math.floor(t * 5));
      return [-2.7 + 5.4 * t, 0.55 * Math.cos(ang) + gauss() * 0.03, 0.55 * Math.sin(ang) + gauss() * 0.03];
    }
    const k = Math.floor(rnd() * 5);
    const q = onSphere(0.22 * Math.cbrt(rnd()));
    knots[i] = k;
    return [-2.7 + (5.4 * (k + 0.5)) / 5 + q[0], q[1], q[2]];
  });

  const core = build(() => {
    if (rnd() < 0.5) return onSphere(0.6 * Math.cbrt(rnd()));
    const a = rnd() * Math.PI * 2;
    const r = 2.6 + gauss() * 0.09;
    const t = rotX(1.15, gauss() * 0.04, r * Math.sin(a));
    return [r * Math.cos(a), t[0], t[1]];
  });

  // Per-particle look: size, a random seed for drift, and a colour from the palette.
  const sizes = new Float32Array(N);
  const seeds = new Float32Array(N);
  const colors = new Float32Array(N * 3);
  const palette = [
    [0.69, 0.74, 1],
    [0.95, 0.81, 0.9],
    [0.9, 0.93, 1],
    [0.6, 0.86, 0.92],
  ];
  for (let i = 0; i < N; i++) {
    sizes[i] = 0.55 + Math.pow(rnd(), 3) * 1.6;
    seeds[i] = rnd();
    const c = rnd();
    const pc = c < 0.45 ? palette[0] : c < 0.7 ? palette[1] : c < 0.92 ? palette[2] : palette[3];
    colors.set(pc, i * 3);
  }

  return {
    shapes: [sphere, router, lattice, ribbon, page, lens, helix, core],
    knots,
    sizes,
    seeds,
    colors,
  };
}

// Where each shape sits on wide screens ([x, y] in world units), so it clears the copy on the left.
export const WIDE_OFFSETS = [[1.7, 0.2], [2.0, 0], [2.4, 0], [2.3, 0], [2.4, 0], [2.4, 0], [2.4, 0], [0, 0]];
// How much the travelling wave runs through each shape (the stream ribbon flows most).
export const FLOWS = [0, 0.35, 0, 1, 0, 0, 0.25, 0];
export const HELIX_INDEX = 6;
