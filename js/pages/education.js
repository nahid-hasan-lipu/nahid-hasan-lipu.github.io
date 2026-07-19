import { THREE, addBaseLighting, createBeatPath, createScrollCameraUpdater, initPageScene, setupReveal } from "../core.js";
import { education } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("education");
initProgressBar();

// Oldest first — a journey arriving at "now".
const journey = [...education].reverse();
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

setupReveal();
initScrollArrows(beatCount);

function makeRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0e1f1c";
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

  const totalLength = (beatCount - 1) * SPACING;
  const roadTexture = makeRoadTexture();

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(6, totalLength + 60),
    new THREE.MeshStandardMaterial({ map: roadTexture, roughness: 0.7 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -1.4, -totalLength / 2 + 10);
  scene.add(road);

  // Low-poly hills flanking the road
  const hillMat = new THREE.MeshStandardMaterial({ color: 0x0d2a24, roughness: 0.9 });
  for (let i = -2; i < beatCount + 2; i += 1) {
    [-1, 1].forEach((side) => {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(4 + Math.random() * 3, 5 + Math.random() * 4, 6), hillMat);
      hill.position.set(side * (9 + Math.random() * 6), -2, -i * SPACING + (Math.random() - 0.5) * 6);
      scene.add(hill);
    });
  }

  // Lamp-post marker at each education stage
  const postMat = new THREE.MeshStandardMaterial({ color: 0x123a32, roughness: 0.5, metalness: 0.3 });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0x3ddc97 });
  for (let i = 0; i < journey.length; i += 1) {
    const beatIndex = i + 1;
    const z = -beatIndex * SPACING;
    [-1, 1].forEach((side) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 8), postMat);
      post.position.set(side * 3.4, -0.1, z);
      scene.add(post);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), lampMat);
      lamp.position.set(side * 3.4, 1.2, z);
      scene.add(lamp);
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
