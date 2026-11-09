# Portfolio

Live at <https://bhavesh-ahalani.github.io/portfolio>.

A scroll-driven portfolio. A WebGL particle field (Three.js) sits behind the page and reshapes
into each project as you scroll: a router, 270 tool clusters, a streaming ribbon, a page
wireframe, a video lens, and a career helix whose knots light up when you open a company.
GSAP's ScrollTrigger handles the text reveals and number counters.

## Updating content

All copy lives in [src/content.js](src/content.js). The resume PDF is
[public/assets/Bhavesh_Resume.pdf](public/assets/Bhavesh_Resume.pdf). Adding or removing a
chapter also means adding or removing its shape in [src/field/shapes.js](src/field/shapes.js),
because chapter order and shape order must match.

## Where things are

| Path | What it does |
| --- | --- |
| `src/components/ParticleField.jsx` | Three.js scene: blends shapes by scroll, cursor repulsion, employer highlight |
| `src/field/shapes.js` | Builds the particle shapes, one per chapter |
| `src/field/shaders.js` | GPU code: drift, wave, cursor push, soft round dots |
| `src/components/Sections.jsx` | Hero, project chapters, experience list, contact |
| `src/components/Chrome.jsx` | Loader, top bar, chapter index, custom cursor |
| `src/index.css` | All styles and design tokens |

## Commands

```bash
npm start        # dev server on localhost:3000
npm test         # tests
npm run deploy   # build and publish to GitHub Pages
```

Visitors with reduced motion turned on get calmer motion and no intro sequence. Without WebGL,
the page falls back to a static gradient.
