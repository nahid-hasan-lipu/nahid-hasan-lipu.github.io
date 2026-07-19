import { THREE, addBaseLighting, createParticleField, initPageScene, initCardFocus, makeSkyGradientTexture, addGlowLayers } from "../core.js";
import { personalInfo } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("personal");
initProgressBar();

const ACCENT = 0xffb454;
const SPACING = 16;

const tiles = [
  { number: "01", label: "Nationality", value: personalInfo.nationality },
  { number: "02", label: "NZ Work Rights", value: personalInfo.workRights },
  { number: "03", label: "Location", value: personalInfo.location },
  { number: "04", label: "Languages", value: personalInfo.languages.join(", ") },
  { number: "05", label: "Interests", value: personalInfo.interests.join(", ") },
];

const beatCount = 1 + tiles.length;

document.getElementById("info-beats").innerHTML = tiles
  .map((t, i) => {
    const side = i % 2 === 0 ? "right" : "left";
    return `
    <section class="beat" id="detail-${i}">
      <div class="content-card content-card--${side}" data-reveal>
        <p class="eyebrow">${t.number} · Personal Info</p>
        <h2>${t.label}</h2>
        <p class="summary">${t.value}</p>
      </div>
    </section>`;
  })
  .join("");

initCardFocus();
initScrollArrows(beatCount);

function makeNumberTexture(number) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(255, 180, 84, 0.55)";
  ctx.font = "700 180px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, 128, 140);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildPanel(tile, index, z) {
  const side = index % 2 === 0 ? -1 : 1; // opposite of the matching content-card side
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
    new THREE.MeshStandardMaterial({ color: 0x1c130a, roughness: 0.4, metalness: 0.2, side: THREE.DoubleSide })
  );
  group.add(backing);

  const numberPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 2.4),
    new THREE.MeshBasicMaterial({ map: makeNumberTexture(tile.number), transparent: true, opacity: 0.9 })
  );
  numberPlane.position.z = 0.01;
  group.add(numberPlane);

  addGlowLayers(group, { position: new THREE.Vector3(0, 0, 0), color: ACCENT, baseRadius: 1.3, layers: 2 });

  return group;
}

initPageScene({ bgColor: 0x150f0a, fogNear: 14, fogFar: 55 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xffcf94, groundColor: 0x150f0a, accent: ACCENT });

  scene.background = makeSkyGradientTexture([
    [0, "#0a0603"],
    [0.45, "#1c130a"],
    [0.75, "#2a1c0e"],
    [1, "#3a2810"],
  ]);

  const beatCount2 = 1 + tiles.length; // intro + one per detail
  const totalLength = (beatCount2 - 1) * SPACING;

  const grid = new THREE.GridHelper(totalLength + 60, Math.round((totalLength + 60) / 3), ACCENT, 0x24170a);
  grid.position.set(0, -1.6, -totalLength / 2);
  scene.add(grid);

  createParticleField(scene, { count: 380, spread: totalLength + 20, color: 0xffd9a0 });

  const curvePoints = [];
  for (let i = 0; i < beatCount2; i += 1) {
    curvePoints.push(new THREE.Vector3(Math.sin(i * 0.8) * 1.2, 1.6 + Math.sin(i * 0.6) * 0.6, -i * SPACING));
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.4);

  const panels = [];
  tiles.forEach((tile, i) => {
    const beatIndex = 1 + i;
    const z = -beatIndex * SPACING;
    const panel = buildPanel(tile, i, z);
    scene.add(panel);
    panels.push({ group: panel, beatIndex, side: i % 2 === 0 ? -1 : 1 });
  });

  const clock = new THREE.Clock();

  function updateCamera() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    const beatFloat = t * (beatCount2 - 1);

    camera.position.copy(curve.getPointAt(t));

    const lookTarget = curve.getPointAt(THREE.MathUtils.clamp(t + 0.04, 0, 1));
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
    updateCamera();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  updateCamera();
  animate();
});
