import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { renderSite, getBeatCount, projects } from "./render.js";

const ACCENT = 0x5b8cff;
const BG_COLOR = 0x0a0d12;
const SPACING = 16; // world units between beats along Z

renderSite();
setupReveal();
initScrollProgress();

function setupReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.25 }
  );
  targets.forEach((t) => observer.observe(t));
}

function initScrollProgress() {
  const bar = document.getElementById("progress-bar");
  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    },
    { passive: true }
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

if (supportsWebGL()) {
  try {
    initScene();
  } catch (err) {
    console.error("3D scene failed to initialize, falling back to flat background.", err);
    document.body.classList.add("no-webgl");
  }
} else {
  document.body.classList.add("no-webgl");
}

function makeNumberTexture(number) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = "rgba(91, 140, 255, 0.55)";
  ctx.font = "700 180px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, 128, 140);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildPanel(project, index, z) {
  // Opposite side from the matching HTML content-card (render.js uses
  // even index = right-aligned card) so the 3D panel and the readable
  // text never land in the same screen region when the camera turns to face it.
  const side = index % 2 === 0 ? -1 : 1;
  const group = new THREE.Group();
  group.position.set(side * 9, 1.4, z);
  group.rotation.y = side > 0 ? -0.35 : 0.35;
  group.userData = { baseY: 1.4, phase: index };

  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(3.55, 2.32),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 })
  );
  frame.position.z = -0.03;
  group.add(frame);

  const backing = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 2.2),
    new THREE.MeshStandardMaterial({
      color: 0x141a24,
      roughness: 0.4,
      metalness: 0.2,
      side: THREE.DoubleSide,
    })
  );
  group.add(backing);

  const numberPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 2.4),
    new THREE.MeshBasicMaterial({
      map: makeNumberTexture(project.number),
      transparent: true,
      opacity: 0.9,
    })
  );
  numberPlane.position.z = 0.01;
  group.add(numberPlane);

  return group;
}

function buildAtmosphere(type, z) {
  const group = new THREE.Group();
  group.position.set(0, 1.6, z);

  let mesh;
  if (type === "hero") {
    mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 0),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true })
    );
  } else if (type === "about") {
    mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.12, 12, 48),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true })
    );
  } else if (type === "skills") {
    for (let i = 0; i < 6; i += 1) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.45, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x1c2433, emissive: ACCENT, emissiveIntensity: 0.15 })
      );
      const angle = (i / 6) * Math.PI * 2;
      cube.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 1.1, 0);
      group.add(cube);
    }
    mesh = null;
  } else {
    mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 24, 24),
      new THREE.MeshBasicMaterial({ color: ACCENT })
    );
  }
  if (mesh) group.add(mesh);
  group.userData = { baseY: 1.6, phase: Math.random() * 10, spin: true };
  return group;
}

function initScene() {
  const beatCount = getBeatCount();
  const totalLength = (beatCount - 1) * SPACING;

  const container = document.getElementById("canvas-container");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG_COLOR);
  scene.fog = new THREE.Fog(BG_COLOR, 14, 55);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.HemisphereLight(0x8fb3ff, 0x0a0d12, 0.65));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);
  const camLight = new THREE.PointLight(0xffffff, 0.6, 20);
  camera.add(camLight);
  camLight.position.set(0, 0, 1);
  scene.add(camera);

  // Floor grid
  const grid = new THREE.GridHelper(totalLength + 60, Math.round((totalLength + 60) / 3), ACCENT, 0x1c2433);
  grid.position.set(0, -1.6, -totalLength / 2);
  scene.add(grid);

  // Ambient particles
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 34;
    positions[i * 3 + 1] = Math.random() * 10 - 2;
    positions[i * 3 + 2] = -Math.random() * (totalLength + 20);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({ color: 0xaac4ff, size: 0.05, transparent: true, opacity: 0.5, sizeAttenuation: true })
  );
  scene.add(particles);

  // Camera path (centerline) — one control point per beat
  const curvePoints = [];
  for (let i = 0; i < beatCount; i += 1) {
    curvePoints.push(
      new THREE.Vector3(Math.sin(i * 0.8) * 1.2, 1.6 + Math.sin(i * 0.6) * 0.6, -i * SPACING)
    );
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.4);

  // Project panels: beats 2..(2+projects.length-1)
  const panels = [];
  projects.forEach((project, i) => {
    const beatIndex = 2 + i;
    const z = -beatIndex * SPACING;
    const panel = buildPanel(project, i, z);
    scene.add(panel);
    panels.push({ group: panel, beatIndex, side: i % 2 === 0 ? -1 : 1 });
  });

  // Atmospheric objects for non-project beats
  const atmosphere = [
    buildAtmosphere("hero", 0),
    buildAtmosphere("about", -1 * SPACING),
    buildAtmosphere("skills", -(2 + projects.length) * SPACING),
    buildAtmosphere("contact", -(3 + projects.length) * SPACING),
  ];
  atmosphere.forEach((a) => scene.add(a));

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();

  function updateCamera() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    const beatFloat = t * (beatCount - 1);

    const position = curve.getPointAt(t);
    camera.position.copy(position);

    const lookAheadT = THREE.MathUtils.clamp(t + 0.04, 0, 1);
    const lookTarget = curve.getPointAt(lookAheadT);

    const nearestBeat = Math.round(beatFloat);
    const panelHere = panels.find((p) => p.beatIndex === nearestBeat);
    if (panelHere) {
      const pull = 1 - Math.min(Math.abs(beatFloat - nearestBeat), 1);
      lookTarget.x += panelHere.side * 0.5 * pull;
    }
    camera.lookAt(lookTarget);
  }

  function animate() {
    const elapsed = clock.getElapsedTime();
    panels.forEach(({ group }) => {
      group.position.y = group.userData.baseY + Math.sin(elapsed * 0.6 + group.userData.phase) * 0.12;
    });
    atmosphere.forEach((a) => {
      a.rotation.y = elapsed * 0.3;
      a.rotation.x = elapsed * 0.15;
      a.position.y = a.userData.baseY + Math.sin(elapsed * 0.5 + a.userData.phase) * 0.2;
    });
    particles.rotation.y = elapsed * 0.01;

    updateCamera();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  updateCamera();
  animate();
}
