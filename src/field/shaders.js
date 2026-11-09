// GPU programs for the particles.
// The vertex shader runs once per particle: it adds drift, the travelling wave,
// cursor repulsion and the employer highlight. The fragment shader draws each
// particle as a soft round dot.

export const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aColor;
  attribute float aKnot;

  uniform float uTime;
  uniform float uPixel;
  uniform float uFlow;
  uniform vec2 uMouse;
  uniform float uMouseK;
  uniform float uFocus;
  uniform float uFocusAmt;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    float s = aSeed * 6.2831;

    // Gentle drift so the field never sits still.
    wp.xyz += 0.035 * vec3(sin(uTime * 0.7 + s), cos(uTime * 0.6 + s * 2.0), sin(uTime * 0.5 + s * 3.0));
    // Travelling wave, strongest on the streaming ribbon.
    wp.y += uFlow * 0.22 * sin(wp.x * 1.8 - uTime * 2.4 + aSeed * 0.6);

    // Push particles away from the cursor.
    vec2 d = wp.xy - uMouse;
    float L = length(d);
    float f = (1.0 - smoothstep(0.0, 1.4, L)) * uMouseK;
    wp.xy += (d / (L + 1e-4)) * f * 0.6;

    // Light up the selected employer's stretch of the helix.
    float on = uFocusAmt * (1.0 - step(0.5, abs(aKnot - uFocus)));

    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixel * (26.0 / -mv.z) * (1.0 + on * 0.6);

    vColor = aColor + f * 0.4 + on * vec3(0.12, 0.08, 0.18);
    vAlpha = 0.62 + 0.38 * sin(uTime * 1.1 + s);
    vAlpha = mix(vAlpha * (1.0 - 0.65 * uFocusAmt), 0.75, on);
  }
`;

export const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vAlpha * 0.85);
  }
`;
