// Shared helpers used by every page's 3D scene — keeps each page's own
// scene file focused on what makes that page visually distinct.
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export { THREE };

// Fixed paths for each page's profile photo. To change a photo, replace
// the file at this path (directly on github.com, or ask Claude) — the
// pages just read whatever's here, with a graceful fallback if it's ever
// missing.
export const PHOTO_SLOTS = [
  { key: "home", label: "Home page", path: "assets/images/profile-home.jpg" },
  { key: "personal", label: "Personal Info page", path: "assets/images/profile-personal.jpg" },
  { key: "contact", label: "Contact page", path: "assets/images/profile-contact.jpg" },
];

// Uses %22 (encoded double quote) for the SVG's own attribute delimiters
// instead of a literal ' — this string gets embedded inside a
// single-quoted JS string inside a double-quoted HTML attribute below, so
// a raw apostrophe here would terminate that string early and break the
// page's JS (confirmed: it did, "Unexpected identifier 'http'").
const AVATAR_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Crect width=%22200%22 height=%22200%22 rx=%22100%22 fill=%22%23161b26%22/%3E%3Ctext x=%22100%22 y=%22120%22 font-size=%2264%22 font-family=%22system-ui,sans-serif%22 font-weight=%22700%22 fill=%22%235b8cff%22 text-anchor=%22middle%22%3ENL%3C/text%3E%3C/svg%3E";

// A circular avatar <img> that falls back to an initials placeholder if
// the photo hasn't been uploaded yet (or fails to load) — the page never
// shows a broken-image icon.
export function avatarImgTag(path, { size = 140, className = "avatar-photo" } = {}) {
  return `<img class="${className}" src="${path}" alt="Nahid Hasan Lipu" width="${size}" height="${size}" loading="lazy" onerror="this.onerror=null;this.src='${AVATAR_FALLBACK}';this.classList.add('avatar-photo--fallback')" />`;
}

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

export function createBaseScene({ bgColor, fogNear = 8, fogFar = 40, transparent = false }) {
  const container = document.getElementById("canvas-container");
  const scene = new THREE.Scene();
  if (!transparent) {
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, fogNear, fogFar);
  }

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: transparent, powerPreference: "high-performance" });
  if (transparent) renderer.setClearColor(0x000000, 0);
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

// Keeps the card nearest the viewport centre full-size and fully opaque,
// and shrinks/fades every other card by how far it is from centre — so the
// card above and below the active one stay visibly "peeking" into frame
// instead of being fully off-screen, signalling there's more to scroll to.
export function initCardFocus() {
  const cards = Array.from(document.querySelectorAll(".content-card"));
  if (!cards.length) return;

  function update() {
    const viewportCenter = window.innerHeight / 2;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const dist = Math.abs(cardCenter - viewportCenter) / window.innerHeight;
      const scale = Math.max(0.8, 1 - dist * 0.45);
      const opacity = Math.max(0.32, 1 - dist * 1.15);
      card.style.transform = `scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
    });
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// A soft vertical-gradient "sky" baked into a canvas texture — used as
// scene.background so environments read as an actual sky/void instead of a
// single flat fill color.
export function makeSkyGradientTexture(stops) {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Cheap, reliable "glow" without a post-processing pipeline: a stack of
// additive-blended transparent spheres, each larger and fainter than the
// last, around an emissive core — reads far more like a real light source
// than a single flat translucent sphere.
export function addGlowLayers(scene, { position = new THREE.Vector3(0, 0, 0), color, baseRadius = 1, layers = 3 } = {}) {
  const group = new THREE.Group();
  group.position.copy(position);
  for (let i = 1; i <= layers; i += 1) {
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(baseRadius * (1 + i * 0.35), 20, 20),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16 / i, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    group.add(glow);
  }
  scene.add(group);
  return group;
}

// Loads a real photo as the scene background — used where a genuine
// photograph reads better than a procedurally-drawn gradient.
export function loadPhotoBackground(scene, path) {
  const texture = new THREE.TextureLoader().load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  scene.background = texture;
  return texture;
}

// A canvas-noise texture — mottled, irregular shading instead of a flat
// color, used for planet surfaces, bark, and ground so they don't read as
// perfectly uniform "prototype" primitives.
export function makeNoiseTexture(baseColor, spotColor, { size = 128, spots = 60 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = spotColor;
  for (let i = 0; i < spots; i += 1) {
    ctx.globalAlpha = 0.08 + Math.random() * 0.18;
    const r = 4 + Math.random() * (size / 6);
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Builds a smooth camera path through `beatCount` waypoints (one per
// scroll "beat") and returns an update function that maps the page's
// current scroll position onto that path each frame. Shared by every
// scroll-driven 3D page (Projects, Home, Education, Skills, Personal Info)
// so each page only has to define where its waypoints sit and what's
// visible at each one — not re-derive the scroll math.
export function createBeatPath(beatCount, pointFn) {
  const points = [];
  for (let i = 0; i < beatCount; i += 1) points.push(pointFn(i));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4);
}

export function createScrollCameraUpdater(camera, curve, beatCount, { lookAhead = 0.04, focusPoints = [] } = {}) {
  return function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    const beatFloat = t * (beatCount - 1);

    camera.position.copy(curve.getPointAt(t));
    const lookTarget = curve.getPointAt(THREE.MathUtils.clamp(t + lookAhead, 0, 1));

    focusPoints.forEach((fp) => {
      const dist = Math.abs(beatFloat - fp.beatIndex);
      if (dist < 1) {
        const pull = 1 - dist;
        lookTarget.x += fp.side * (fp.strength ?? 0.5) * pull;
      }
    });

    camera.lookAt(lookTarget);
    return { t, beatFloat };
  };
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
