import * as THREE from "https://esm.sh/three@0.174.0";

const vert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag1 = `
uniform float time;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
  );
  return res * res;
}

const mat2 m2 = mat2(-3.5473, 2.8406, -0.3167, -1.9736);

float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.0742 * noise(p); p = m2 * p * 1.8466;
  f += 0.14427359999999997 * noise(p); p = m2 * p * 2.0664;
  f += 0.022107860719999997 * noise(p); p = m2 * p * 2.0292;
  f += 0.0085066668579816 * noise(p); p = m2 * p * 2.3876;
  return f / 0.8;
}

float pattern(in vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(3.6027, 13.8261)));
  r += time * 0.15;
  return fbm(p + 1.760 * r);
}

void main() {
  vec2 uv = vUv;
  uv *= 4.5;
  float displacement = pattern(uv);
  float displacementb = pattern(uv * 1.141477824124);
  float displacementc = pattern(uv * 1.133511522144);
  float intensity = displacement * 1.4 + displacementb * 0.45 + displacementc * 0.35;
  intensity = intensity / (1.0 + intensity);
  vec3 color = vec3(0.03, 0.12, 0.03) + vec3(0.02, intensity * 1.6, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

const frag2 = `
uniform float time;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
  );
  return res * res;
}

const mat2 m2 = mat2(0.8, -0.6, 0.6, 0.8);

float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.5000 * noise(p); p = m2 * p * 2.02;
  f += 0.2500 * noise(p); p = m2 * p * 2.03;
  f += 0.1250 * noise(p); p = m2 * p * 2.01;
  f += 0.0625 * noise(p);
  return f / 0.769;
}

float pattern(in vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2)));
  r += time * 0.15;
  return fbm(p + 1.760 * r);
}

void main() {
  vec2 uv = vUv;
  uv *= 4.5;
  float displacement = pattern(uv);
  float intensity = displacement * 1.8;
  intensity = intensity / (1.0 + intensity);
  vec3 color = vec3(0.03, 0.1, 0.03) + vec3(0.02, intensity * 1.7, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

const frag3 = `
uniform float time;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
  );
  return res * res;
}

const mat2 m2 = mat2(1.5648, -1.7512, 0.0132, -0.2190);

float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.1032 * noise(p); p = m2 * p * 1.5407;
  f += 0.10824 * noise(p); p = m2 * p * 2.2254;
  f += 0.06768491911999999 * noise(p); p = m2 * p * 1.5816;
  f += 0.0028734605415600004 * noise(p); p = m2 * p * 2.1082;
  return f / 0.8;
}

float pattern(in vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(3.5740, 10.9091)));
  r += time * 0.15;
  return fbm(p + 1.760 * r);
}

void main() {
  vec2 uv = vUv;
  uv.x = (1.0 - uv.x);
  uv *= 4.5;
  float displacement = pattern(uv);
  float displacementb = pattern(uv * 1.398811103344);
  float displacementc = pattern(uv * 1.0162420271200001);
  float intensity = displacement * 1.4 + displacementb * 0.45 + displacementc * 0.35;
  intensity = intensity / (1.0 + intensity);
  vec3 color = vec3(0.03, 0.12, 0.03) + vec3(0.02, intensity * 1.6, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

const frag4 = `
uniform float time;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
  );
  return res * res;
}

const mat2 m2 = mat2(-0.5961, -1.2103, 1.6134, -1.2860);

float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.6729 * noise(p); p = m2 * p * 1.9203;
  f += 0.0119889 * noise(p); p = m2 * p * 1.9524;
  f += 0.046984552576000004 * noise(p); p = m2 * p * 2.0959;
  f += 0.021578978005200002 * noise(p); p = m2 * p * 2.0997;
  return f / 0.8;
}

float pattern(in vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(11.8297, 12.3730)));
  r += time * 0.15;
  return fbm(p + 1.760 * r);
}

void main() {
  vec2 uv = vUv;
  uv *= 4.5;
  float displacement = pattern(uv);
  float displacementb = pattern(uv * 1.11814950169);
  float displacementc = pattern(uv * 1.111268722573);
  float intensity = displacement * 1.4 + displacementb * 0.45 + displacementc * 0.35;
  intensity = intensity / (1.0 + intensity);
  vec3 color = vec3(0.03, 0.12, 0.03) + vec3(0.02, intensity * 1.6, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

const frag5 = `
uniform float time;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
  );
  return res * res;
}

const mat2 m2 = mat2(3.5836, -4.4081, -1.4529, -1.7490);

float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.6690 * noise(p); p = m2 * p * 1.7953;
  f += 0.00266805 * noise(p); p = m2 * p * 1.9513;
  f += 0.057233826572000004 * noise(p); p = m2 * p * 2.0227;
  f += 0.00043936899243299997 * noise(p); p = m2 * p * 1.9037;
  return f / 0.8;
}

float pattern(in vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(6.0963, 4.9763)));
  r += time * 0.15;
  return fbm(p + 1.760 * r);
}

void main() {
  vec2 uv = vUv;
  uv *= 4.5;
  float displacement = pattern(uv);
  float displacementb = pattern(uv * 1.02492378238);
  float displacementc = pattern(uv * 1.096117515109);
  float intensity = displacement * 1.4 + displacementb * 0.45 + displacementc * 0.35;
  intensity = intensity / (1.0 + intensity);
  vec3 color = vec3(0.03, 0.12, 0.03) + vec3(0.02, intensity * 1.6, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

const frag6 = `
uniform float time;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
  );
  return res * res;
}

const mat2 m2 = mat2(3.2139, -0.5827, -3.5692, -1.1840);

float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.1684 * noise(p); p = m2 * p * 2.4353;
  f += 0.01623951 * noise(p); p = m2 * p * 1.6300;
  f += 0.051942047513999993 * noise(p); p = m2 * p * 1.5808;
  f += 0.014759338752032803 * noise(p); p = m2 * p * 1.9311;
  return f / 0.8;
}

float pattern(in vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(7.4315, 9.7066)));
  r += time * 0.15;
  return fbm(p + 1.760 * r);
}

void main() {
  vec2 uv = vUv;
  uv.x = 1.0 - uv.x;
  uv.y = 1.0 - uv.y;
  uv *= 4.5;
  float displacement = pattern(uv);
  float displacementb = pattern(uv * 1.032591895413);
  float displacementc = pattern(uv * 1.36200947148);
  float intensity = displacement * 1.4 + displacementb * 0.45 + displacementc * 0.35;
  intensity = intensity / (1.0 + intensity);
  vec3 color = vec3(0.03, 0.12, 0.03) + vec3(0.02, intensity * 1.6, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

const frag7 = `
uniform float time;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);

  float res = mix(
    mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
    mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y
  );
  return res * res;
}

const mat2 m2 = mat2(0.9104, -0.2450, -0.5766, 0.2637);

float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.5617 * noise(p); p = m2 * p * 2.05;
  f += 0.09539847 * noise(p); p = m2 * p * 2.04;
  f += 0.09857913894399999 * noise(p); p = m2 * p * 2.03;
  f += 0.022293080488224 * noise(p); p = m2 * p * 2.02;
  return f / 0.8;
}

float pattern(in vec2 p) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2)));
  r += time * 0.15;
  return fbm(p + 1.760 * r);
}

void main() {
  vec2 uv = vUv;
  uv *= 4.5;
  float displacement = pattern(uv);
  float displacementb = pattern(uv * 1.166719995036);
  float displacementc = pattern(uv * 1.088219192624);
  float intensity = displacement * 1.4 + displacementb * 0.45 + displacementc * 0.35;
  intensity = intensity / (1.0 + intensity);
  vec3 color = vec3(0.03, 0.12, 0.03) + vec3(0.02, intensity * 1.6, 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

function createShaderPane(container, fragmentShader) {
  if (!container) return null;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    time: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(w, h);
  };

  resize();

  return {
    render: (t) => {
      uniforms.time.value = t;
      renderer.render(scene, camera);
    },
    resize,
  };
}

const panes = [
  createShaderPane(document.getElementById("item_0"), frag1),
  createShaderPane(document.getElementById("item_1"), frag2),
  createShaderPane(document.getElementById("item_2"), frag3),
  createShaderPane(document.getElementById("item_3"), frag4),
  createShaderPane(document.getElementById("item_4"), frag5),
  createShaderPane(document.getElementById("item_5"), frag6),
  createShaderPane(document.getElementById("item_6"), frag7),
].filter(Boolean);

window.addEventListener("resize", () => panes.forEach((pane) => pane.resize()));

let start = performance.now();
function loop(now) {
  const t = (now - start) / 1000;
  panes.forEach((pane) => pane.render(t));
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
