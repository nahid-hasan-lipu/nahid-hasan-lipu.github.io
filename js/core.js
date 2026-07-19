// Shared helpers used by every page's 3D scene — keeps each page's own
// scene file focused on what makes that page visually distinct.
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export { THREE };

export function supportsWebGL() {
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

export function createBaseScene({ bgColor, fogNear = 8, fogFar = 40 }) {
  const container = document.getElementById("canvas-container");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgColor);
  scene.fog = new THREE.Fog(bgColor, fogNear, fogFar);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, container };
}

export function addBaseLighting(scene, camera, { skyColor = 0x8fb3ff, groundColor = 0x0a0d12, accent } = {}) {
  scene.add(new THREE.HemisphereLight(skyColor, groundColor, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);
  if (accent !== undefined) {
    const camLight = new THREE.PointLight(accent, 0.7, 20);
    camLight.position.set(0, 0, 1);
    camera.add(camLight);
    scene.add(camera);
  }
}

export function createParticleField(scene, { count = 300, spread = 20, color = 0xaac4ff, size = 0.05 } = {}) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.55, sizeAttenuation: true })
  );
  scene.add(points);
  return points;
}

// Subtle camera drift toward the mouse position — used on every page that
// isn't scroll-driven, so idle scenes still feel interactive.
export function attachMouseParallax(camera, basePosition, strength = 0.8) {
  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
  return function applyParallax() {
    camera.position.x = basePosition.x + mouse.x * strength;
    camera.position.y = basePosition.y - mouse.y * strength * 0.5;
    camera.lookAt(basePosition.x * 0, basePosition.y, basePosition.z - 10);
  };
}

export function setupReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => observer.observe(t));
}

export function initPageScene(bgOptions, buildFn) {
  if (!supportsWebGL()) {
    document.body.classList.add("no-webgl");
    return;
  }
  try {
    buildFn(createBaseScene(bgOptions));
  } catch (err) {
    console.error("3D scene failed to initialize, falling back to flat background.", err);
    document.body.classList.add("no-webgl");
  }
}
