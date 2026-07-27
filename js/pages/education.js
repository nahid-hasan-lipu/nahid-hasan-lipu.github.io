import { THREE, addBaseLighting, createBeatPath, createScrollCameraUpdater, initPageScene, initCardFocus, makeSkyGradientTexture, addGlowLayers } from "../core.js";
import { education } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("education");
initProgressBar();

// Most recent first, matching data.js order.
const journey = [...education];
const beatCount = 1 + journey.length;

document.getElementById("road-beats").innerHTML = journey
  .map(
    (e, i) => `
    <section class="beat" id="stage-${i}">
      <div class="content-card content-card--${i % 2 === 0 ? "right" : "left"}" data-reveal>
        <p class="eyebrow">${e.period}</p>
        <h2>${e.degree}</h2>
        <p class="summary">${e.institution}</p>
        <p class="stat">${e.detail}</p>
      </div>
    </section>`
  )
  .join("");

initCardFocus();
initScrollArrows(beatCount);

function makeRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#141f1c";
  ctx.fillRect(0, 0, 128, 512);
  // asphalt grain
  for (let i = 0; i < 900; i += 1) {
    ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.08)";
    ctx.fillRect(Math.random() * 128, Math.random() * 512, 1.5, 1.5);
  }
  // worn edge shading
  const edgeShade = ctx.createLinearGradient(0, 0, 128, 0);
  edgeShade.addColorStop(0, "rgba(0,0,0,0.35)");
  edgeShade.addColorStop(0.12, "rgba(0,0,0,0)");
  edgeShade.addColorStop(0.88, "rgba(0,0,0,0)");
  edgeShade.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = edgeShade;
  ctx.fillRect(0, 0, 128, 512);
  // edge lines
  ctx.fillStyle = "#3ddc97";
  ctx.fillRect(6, 0, 4, 512);
  ctx.fillRect(118, 0, 4, 512);
  // dashed center line
  ctx.fillStyle = "#e8fff4";
  for (let y = 0; y < 512; y += 64) {
    ctx.fillRect(60, y, 8, 34);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 24);
  return texture;
}

const SPACING = 16;

initPageScene({ bgColor: 0x081414, fogNear: 10, fogFar: 48 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0x8fffd8, groundColor: 0x081414, accent: 0x3ddc97 });

  // Dusk sky — deep teal overhead fading to a warm horizon glow
  scene.background = makeSkyGradientTexture([
    [0, "#040a09"],
    [0.45, "#0a1e1a"],
    [0.75, "#163a2e"],
    [1, "#3a5a3a"],
  ]);

  const totalLength = (beatCount - 1) * SPACING;
  const roadTexture = makeRoadTexture();

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(6, totalLength + 60),
    new THREE.MeshStandardMaterial({ map: roadTexture, roughness: 0.7 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -1.4, -totalLength / 2 + 10);
  scene.add(road);

  // Hills flanking the road — irregular, rotated icosahedra rather than
  // clean cones, so the terrain silhouette isn't perfectly geometric
  const hillMat = new THREE.MeshStandardMaterial({ color: 0x0d2a24, roughness: 0.95, flatShading: true });
  for (let i = -2; i < beatCount + 2; i += 1) {
    [-1, 1].forEach((side) => {
      const hill = new THREE.Mesh(new THREE.IcosahedronGeometry(3.5 + Math.random() * 3, 0), hillMat);
      hill.scale.y = 0.6 + Math.random() * 0.4;
      hill.rotation.y = Math.random() * Math.PI;
      hill.position.set(side * (9 + Math.random() * 6), -4 + Math.random(), -i * SPACING + (Math.random() - 0.5) * 6);
      scene.add(hill);
    });
  }

  // Lamp-post marker at each education stage, with a real glow instead of
  // a flat emissive sphere
  const postMat = new THREE.MeshStandardMaterial({ color: 0x123a32, roughness: 0.5, metalness: 0.3 });
  for (let i = 0; i < journey.length; i += 1) {
    const beatIndex = i + 1;
    const z = -beatIndex * SPACING;
    [-1, 1].forEach((side) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 8), postMat);
      post.position.set(side * 3.4, -0.1, z);
      scene.add(post);
      addGlowLayers(scene, { position: new THREE.Vector3(side * 3.4, 1.2, z), color: 0x3ddc97, baseRadius: 0.22, layers: 3 });
    });
  }

  const curve = createBeatPath(beatCount, (i) => new THREE.Vector3(Math.sin(i * 0.5) * 1.4, 0.6, -i * SPACING));
  const updateCamera = createScrollCameraUpdater(camera, curve, beatCount, { lookAhead: 0.05 });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    roadTexture.offset.y = (t * 0.05) % 1;

    updateCamera();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
