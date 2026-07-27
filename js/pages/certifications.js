import { THREE, addBaseLighting, createBeatPath, createScrollCameraUpdater, initPageScene, initCardFocus, makeSkyGradientTexture, addGlowLayers, makeNoiseTexture } from "../core.js";
import { certifications } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("certifications");
initProgressBar();

const ACCENT = 0xf4c95d;
const SPACING = 16;
const beatCount = 1 + certifications.length;

document.getElementById("cert-beats").innerHTML = certifications
  .map((c, i) => {
    const side = i % 2 === 0 ? "right" : "left";
    const thumb = c.thumb
      ? `<div class="cert-thumb-wrap"><img class="cert-thumb" src="${c.thumb}" alt="${c.title} certificate" loading="lazy" /></div>`
      : `<div class="cert-thumb-wrap"><div class="cert-thumb-placeholder">${c.issuer}</div></div>`;
    return `
    <section class="beat" id="${c.id}">
      <div class="content-card content-card--${side}" data-reveal>
        <p class="eyebrow">Credential ${i + 1} of ${certifications.length} · ${c.meta}</p>
        ${thumb}
        <h2>${c.title}</h2>
        <p class="cert-issuer">${c.issuer}</p>
        <p class="cert-date">${c.date}</p>
        <div class="btn-row" style="margin-top: 1.2rem;">
          <a class="btn btn--primary" href="${c.verify}" target="_blank" rel="noopener">${c.verifyLabel}</a>
        </div>
      </div>
    </section>`;
  })
  .join("");

initCardFocus();
initScrollArrows(beatCount);

// A small circular "medallion" texture for credentials with no certificate
// image to display in 3D (Google Skills badges, which have no downloadable
// certificate file — only their public verification page).
function makeMedallionTexture(letter) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#1c1608";
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(244, 201, 93, 0.8)";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = "#f4c95d";
  ctx.font = "700 120px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, 128, 138);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const textureLoader = new THREE.TextureLoader();

function buildPanel(cert, index, z) {
  const side = index % 2 === 0 ? -1 : 1; // opposite of the matching content-card side
  const group = new THREE.Group();
  group.position.set(side * 9, 1.4, z);
  group.rotation.y = side > 0 ? -0.35 : 0.35;
  group.userData = { baseY: 1.4, phase: index };

  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(3.65, 2.42),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.9 })
  );
  frame.position.z = -0.03;
  group.add(frame);

  const map = cert.thumb ? textureLoader.load(cert.thumb) : makeMedallionTexture(cert.issuer[0]);
  if (cert.thumb) map.colorSpace = THREE.SRGBColorSpace;

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 2.2),
    new THREE.MeshStandardMaterial({ map, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide })
  );
  group.add(face);

  addGlowLayers(group, { position: new THREE.Vector3(0, 0, 0), color: ACCENT, baseRadius: 1.3, layers: 2 });

  return group;
}

initPageScene({ bgColor: 0x150f04, fogNear: 14, fogFar: 55 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xffe1a3, groundColor: 0x150f04, accent: ACCENT });

  scene.background = makeSkyGradientTexture([
    [0, "#0a0602"],
    [0.45, "#201607"],
    [0.75, "#2e1f0a"],
    [1, "#3d2a0d"],
  ]);

  const beatCountLocal = 1 + certifications.length;
  const totalLength = (beatCountLocal - 1) * SPACING;

  const floorTexture = makeNoiseTexture("#1c1608", "#4a3410", { size: 96, spots: 70 });
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, (totalLength + 60) / 10);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, totalLength + 60),
    new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -1.6, -totalLength / 2 + 10);
  scene.add(floor);

  // Sparse drifting motes instead of a dense particle field — reads as
  // dust in a warmly lit hall rather than a starfield.
  const moteCount = 220;
  const motePos = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i += 1) {
    motePos[i * 3] = (Math.random() - 0.5) * 16;
    motePos[i * 3 + 1] = Math.random() * 5 - 1;
    motePos[i * 3 + 2] = -Math.random() * (totalLength + 20);
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({ color: 0xffe1a3, size: 0.05, transparent: true, opacity: 0.5, sizeAttenuation: true })
  );
  scene.add(motes);

  const curve = createBeatPath(beatCountLocal, (i) => new THREE.Vector3(Math.sin(i * 0.8) * 1.2, 1.6 + Math.sin(i * 0.6) * 0.6, -i * SPACING));

  const panels = [];
  certifications.forEach((cert, i) => {
    const beatIndex = 1 + i;
    const z = -beatIndex * SPACING;
    const panel = buildPanel(cert, i, z);
    scene.add(panel);
    panels.push({ group: panel, beatIndex, side: i % 2 === 0 ? -1 : 1 });
  });

  const updateCamera = createScrollCameraUpdater(camera, curve, beatCountLocal, {
    lookAhead: 0.04,
    focusPoints: panels.map((p) => ({ beatIndex: p.beatIndex, side: p.side, strength: 0.5 })),
  });

  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();
    panels.forEach(({ group }) => {
      group.position.y = group.userData.baseY + Math.sin(elapsed * 0.6 + group.userData.phase) * 0.12;
    });

    const posAttr = moteGeo.getAttribute("position");
    for (let i = 0; i < moteCount; i += 1) {
      posAttr.setY(i, posAttr.getY(i) + Math.sin(elapsed * 1.2 + i) * 0.0015);
    }
    posAttr.needsUpdate = true;

    updateCamera();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  updateCamera();
  animate();
});
