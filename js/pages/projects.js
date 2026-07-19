import { THREE, addBaseLighting, createParticleField, initPageScene, setupReveal } from "../core.js";
import { projects } from "../data.js";
import { renderNav, initProgressBar, icons } from "../nav.js";

renderNav("projects");
initProgressBar();

const ACCENT = 0x4dd0e1;
const SPACING = 16;

function renderProjectBeats() {
  const container = document.getElementById("project-beats");
  projects.forEach((project, index) => {
    const side = index % 2 === 0 ? "right" : "left";
    const section = document.createElement("section");
    section.className = "beat";
    section.id = project.id;

    const techChips = project.tech.map((t) => `<span class="chip">${t}</span>`).join("");
    const powerbiBadge = project.powerbi ? `<span class="chip chip--accent">+ Power BI dashboard</span>` : "";

    section.innerHTML = `
      <div class="content-card content-card--${side}" data-reveal>
        <p class="eyebrow">${project.number} · ${project.tag}</p>
        <h2>${project.title}</h2>
        <p class="summary">${project.summary}</p>
        <p class="stat">${project.stat}</p>
        <div class="chip-row">${techChips}${powerbiBadge}</div>
        <a class="btn btn--primary" href="${project.repo}" target="_blank" rel="noopener">${icons.github}<span>View full case study on GitHub</span></a>
      </div>
    `;
    container.appendChild(section);
  });
}

renderProjectBeats();
setupReveal();

function makeNumberTexture(number) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(77, 208, 225, 0.55)";
  ctx.font = "700 180px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, 128, 140);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildPanel(project, index, z) {
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
    new THREE.MeshStandardMaterial({ color: 0x0e1a1e, roughness: 0.4, metalness: 0.2, side: THREE.DoubleSide })
  );
  group.add(backing);

  const numberPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 2.4),
    new THREE.MeshBasicMaterial({ map: makeNumberTexture(project.number), transparent: true, opacity: 0.9 })
  );
  numberPlane.position.z = 0.01;
  group.add(numberPlane);

  return group;
}

initPageScene({ bgColor: 0x0a1014, fogNear: 14, fogFar: 55 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0x8fdfff, groundColor: 0x0a1014, accent: ACCENT });

  const beatCount = 1 + projects.length; // intro + one per project
  const totalLength = (beatCount - 1) * SPACING;

  const grid = new THREE.GridHelper(totalLength + 60, Math.round((totalLength + 60) / 3), ACCENT, 0x122024);
  grid.position.set(0, -1.6, -totalLength / 2);
  scene.add(grid);

  createParticleField(scene, { count: 380, spread: totalLength + 20, color: 0x8fdfff });

  const curvePoints = [];
  for (let i = 0; i < beatCount; i += 1) {
    curvePoints.push(new THREE.Vector3(Math.sin(i * 0.8) * 1.2, 1.6 + Math.sin(i * 0.6) * 0.6, -i * SPACING));
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.4);

  const panels = [];
  projects.forEach((project, i) => {
    const beatIndex = 1 + i;
    const z = -beatIndex * SPACING;
    const panel = buildPanel(project, i, z);
    scene.add(panel);
    panels.push({ group: panel, beatIndex, side: i % 2 === 0 ? -1 : 1 });
  });

  const clock = new THREE.Clock();

  function updateCamera() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    const beatFloat = t * (beatCount - 1);

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
