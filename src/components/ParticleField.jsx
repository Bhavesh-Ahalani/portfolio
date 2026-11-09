import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildShapes, WIDE_OFFSETS, FLOWS, HELIX_INDEX } from "field/shapes";
import { vertexShader, fragmentShader } from "field/shaders";
import { getChapters, hasFinePointer, measureCenters, prefersReducedMotion, scrollProgress } from "utils";

const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// The fixed WebGL background. Scroll position picks which two shapes to blend,
// the cursor pushes particles away, and `focusKnot` lights up one employer on the helix.
export default function ParticleField({ focusKnot }) {
  const canvasRef = useRef(null);
  const focusRef = useRef(focusKnot);
  focusRef.current = focusKnot;

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduce = prefersReducedMotion();
    const fine = hasFinePointer();

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch (e) {
      // No WebGL: fall back to a static gradient and keep the page readable.
      document.body.classList.add("no-gl");
      canvas.style.display = "none";
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0d1c, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    let small = window.innerWidth < 820;
    const N = small ? 7000 : 16000;
    const { shapes, knots, sizes, seeds, colors } = buildShapes(N);

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(shapes[0]);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aKnot", new THREE.BufferAttribute(knots, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

    const uniforms = {
      uTime: { value: 0 },
      uPixel: { value: renderer.getPixelRatio() },
      uFlow: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseK: { value: 0 },
      uFocus: { value: -1 },
      uFocusAmt: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, material);
    scene.add(points);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      small = w < 820;
      points.scale.setScalar(small ? 0.55 : w < 1180 ? 0.82 : 1);
    };

    let centers = [];
    const measure = () => {
      centers = measureCenters(getChapters());
    };

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, moved: false };
    const onPointer = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.moved = true;
    };
    const onResize = () => {
      resize();
      measure();
    };

    resize();
    measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    window.addEventListener("relayout", measure);
    window.addEventListener("pointermove", onPointer, { passive: true });

    let p = scrollProgress(centers);
    const tilt = { x: 0, y: 0 };
    let mouseK = 0;
    let clock = 0;
    let last = performance.now();
    let raf = 0;
    const halfH = Math.tan(THREE.MathUtils.degToRad(22.5)) * 9;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt * (reduce ? 0.25 : 1);

      // Blend the two shapes either side of the current scroll position.
      const target = scrollProgress(centers);
      p += (target - p) * (reduce ? 1 : Math.min(1, dt * 4.5));
      const i0 = Math.floor(p);
      const i1 = Math.min(shapes.length - 1, i0 + 1);
      const t = smoothstep(0.18, 0.82, p - i0);
      const A = shapes[i0];
      const B = shapes[i1];
      for (let k = 0; k < A.length; k++) pos[k] = A[k] + (B[k] - A[k]) * t;
      geo.attributes.position.needsUpdate = true;

      const oA = small ? [0, 1.75] : WIDE_OFFSETS[i0];
      const oB = small ? [0, 1.75] : WIDE_OFFSETS[i1];
      points.position.x = oA[0] + (oB[0] - oA[0]) * t;
      points.position.y = oA[1] + (oB[1] - oA[1]) * t;
      uniforms.uFlow.value = FLOWS[i0] + (FLOWS[i1] - FLOWS[i0]) * t;

      // Employer highlight, only while the helix is on screen.
      const helixW = (i0 === HELIX_INDEX ? 1 - t : 0) + (i1 === HELIX_INDEX && i1 !== i0 ? t : 0);
      const focus = focusRef.current;
      if (focus >= 0) uniforms.uFocus.value = focus;
      const focusTarget = (focus >= 0 ? 1 : 0) * helixW;
      uniforms.uFocusAmt.value += (focusTarget - uniforms.uFocusAmt.value) * Math.min(1, dt * (reduce ? 20 : 6));

      // Tilt toward the cursor and sway slowly.
      const nx = (mouse.x / window.innerWidth) * 2 - 1;
      const ny = -((mouse.y / window.innerHeight) * 2 - 1);
      if (!reduce) {
        tilt.x += (ny * 0.18 - tilt.x) * Math.min(1, dt * 3);
        tilt.y += (nx * 0.3 - tilt.y) * Math.min(1, dt * 3);
      }
      points.rotation.x = tilt.x;
      points.rotation.y = tilt.y + (reduce ? 0 : Math.sin(clock * 0.18) * 0.35);

      mouseK += ((fine && mouse.moved && !reduce ? 1 : 0) - mouseK) * Math.min(1, dt * 3);
      uniforms.uMouseK.value = mouseK;
      uniforms.uMouse.value.set(nx * halfH * camera.aspect, ny * halfH);
      uniforms.uTime.value = clock;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
      window.removeEventListener("relayout", measure);
      window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="gl" ref={canvasRef} aria-hidden="true" />;
}
