import { THREE, addBaseLighting, createBeatPath, createScrollCameraUpdater, initPageScene, setupReveal } from "../core.js";
import { skillGroups } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("skills");
initProgressBar();

const ACCENT = 0xa78bfa;
const SPACING = 16;
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

setupReveal();
initScrollArrows(beatCount);

function makeHexGridTexture() {
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#160e26";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(167, 139, 250, 0.5)";
  ctx.lineWidth = 1.5;
  const r = 22;
  const hexH = r * Math.sqrt(3);
  for (let row = -1; row < size / hexH + 1; row += 1) {
    for (let col = -1; col < size / (r * 1.5) + 1; col += 1) {
      const x = col * r * 1.5;
      const y = row * hexH + (col % 2 === 0 ? 0 : hexH / 2);
      ctx.beginPath();
      for (let s = 0; s < 6; s += 1) {
        const angle = (Math.PI / 3) * s;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 30);
  return texture;
}

function buildHexPanel(index, z, side) {
  const group = new THREE.Group();
  group.position.set(side * 8.5, 1.4, z);
  group.rotation.y = side > 0 ? -0.35 : 0.35;
  group.userData = { baseY: 1.4, phase: index };

  const hexPrism = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 0.35, 6),
    new THREE.MeshStandardMaterial({ color: 0x1c1430, emissive: ACCENT, emissiveIntensity: 0.45, roughness: 0.35, metalness: 0.3 })
  );
  hexPrism.rotation.x = Math.PI / 2;
  group.add(hexPrism);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.04, 8, 6),
    new THREE.MeshBasicMaterial({ color: ACCENT })
  );
  group.add(rim);

  return group;
}

initPageScene({ bgColor: 0x120a1f, fogNear: 12, fogFar: 50 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xd8b9ff, groundColor: 0x120a1f, accent: ACCENT });

  const totalLength = (beatCount - 1) * SPACING;

  const floorTexture = makeHexGridTexture();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, totalLength + 60),
    new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.6 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.8, -totalLength / 2 + 10);
  scene.add(floor);

  const panels = skillGroups.map((g, i) => {
    const beatIndex = i + 1;
    const side = i % 2 === 0 ? -1 : 1; // opposite of the matching content-card side
    const z = -beatIndex * SPACING;
    const panel = buildHexPanel(i, z, side);
    scene.add(panel);
    return { group: panel };
  });

  const curve = createBeatPath(beatCount, (i) => new THREE.Vector3(Math.sin(i * 0.8) * 1.2, 1.6, -i * SPACING));
  const updateCamera = createScrollCameraUpdater(camera, curve, beatCount, { lookAhead: 0.05 });

  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();
    panels.forEach(({ group }) => {
      group.rotation.z = Math.sin(elapsed * 0.4 + group.userData.phase) * 0.15;
      group.position.y = group.userData.baseY + Math.sin(elapsed * 0.6 + group.userData.phase) * 0.12;
    });
    updateCamera();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
