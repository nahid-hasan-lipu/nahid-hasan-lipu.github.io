import { THREE, addBaseLighting, initPageScene, initCardFocus, loadPhotoBackground, addGlowLayers } from "../core.js";
import { skillGroups } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("skills");
initProgressBar();

const ACCENT = 0xa78bfa;
const FACE_COLORS = [0xa78bfa, 0x8f6bf0, 0xc0a8ff, 0x9370f5, 0xb69aff, 0x7c5ce8];
const beatCount = 1 + skillGroups.length;

document.getElementById("hex-beats").innerHTML = skillGroups
  .map((g, i) => {
    const side = i % 2 === 0 ? "right" : "left";
    return `
    <section class="beat" id="skillgroup-${i}">
      <div class="content-card content-card--${side}" data-reveal>
        <span class="hex-badge">${i + 1}</span>
        <p class="eyebrow">Base skill ${i + 1} of ${skillGroups.length}</p>
        <h2>${g.category}</h2>
        <p class="summary">${g.description}</p>
        <div class="chip-row">${g.items.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
      </div>
    </section>`;
  })
  .join("");

initCardFocus();
initScrollArrows(beatCount);

function makeFaceTexture(number, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "700 120px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(number), 128, 138);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// A single 3D hexagonal prism that rotates as you scroll — each of its 6
// side faces takes its turn facing the camera, one per skill category,
// floating over a real photographed mountain-and-sea backdrop.
function buildHexagon() {
  const radius = 2.4;
  const depth = 1.6;
  const geometry = new THREE.CylinderGeometry(radius, radius, depth, 6, 1, false);

  // CylinderGeometry writes side-face indices first (6 quads = 36 indices
  // for a 6-sided prism), then the top cap, then the bottom cap — split
  // the single "sides" group into 6 groups so each face can take its own
  // material.
  geometry.clearGroups();
  for (let face = 0; face < 6; face += 1) {
    geometry.addGroup(face * 6, 6, face);
  }
  const sideIndexCount = 6 * 6;
  const capIndexCount = (geometry.index.count - sideIndexCount) / 2;
  geometry.addGroup(sideIndexCount, capIndexCount, 6);
  geometry.addGroup(sideIndexCount + capIndexCount, capIndexCount, 7);

  const faceMaterials = FACE_COLORS.map(
    (color, i) =>
      new THREE.MeshStandardMaterial({
        map: makeFaceTexture(i + 1, color),
        emissive: color,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.25,
      })
  );
  const capMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1430, roughness: 0.5, metalness: 0.3 });

  const hexagon = new THREE.Mesh(geometry, [...faceMaterials, capMaterial, capMaterial]);
  return hexagon;
}

initPageScene({ bgColor: 0x120a1f, fogNear: 18, fogFar: 40 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xd8b9ff, groundColor: 0x120a1f, accent: ACCENT });

  loadPhotoBackground(scene, "assets/images/mountain-sea.jpg");

  const hexagon = buildHexagon();
  scene.add(hexagon);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.045, 8, 6), new THREE.MeshBasicMaterial({ color: ACCENT }));
  rim.rotation.x = Math.PI / 2;
  scene.add(rim);

  addGlowLayers(scene, { position: new THREE.Vector3(0, 0, 0), color: ACCENT, baseRadius: 1.7, layers: 2 });

  // A little ambient dust drifting past, so the scene isn't perfectly static
  const dustCount = 140;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xe4d8ff, size: 0.045, transparent: true, opacity: 0.55 }));
  scene.add(dust);

  camera.position.set(0, 0.6, 7.5);
  const lookTarget = new THREE.Vector3(0, 0, 0);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const scrollT = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    const beatFloat = scrollT * (beatCount - 1);

    // One face turn (60°) per beat, plus a slow idle spin so it never sits
    // perfectly still.
    hexagon.rotation.y = -(beatFloat * (Math.PI / 3)) + t * 0.05;
    hexagon.rotation.x = Math.sin(t * 0.3) * 0.05;
    rim.rotation.z = t * 0.1;

    const dustPosAttr = dustGeo.getAttribute("position");
    for (let i = 0; i < dustCount; i += 1) {
      let x = dustPosAttr.getX(i) - 0.01;
      if (x < -8) x = 8;
      dustPosAttr.setX(i, x);
    }
    dustPosAttr.needsUpdate = true;

    camera.position.x = mouse.x * 0.6;
    camera.position.y = 0.6 - mouse.y * 0.3;
    camera.lookAt(lookTarget);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
