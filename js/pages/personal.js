import { THREE, addBaseLighting, attachMouseParallax, initPageScene, setupReveal } from "../core.js";
import { personalInfo } from "../data.js";
import { renderNav, initProgressBar } from "../nav.js";

renderNav("personal");
initProgressBar();

const tiles = [
  { label: "Nationality", value: personalInfo.nationality },
  { label: "NZ Work Rights", value: personalInfo.workRights },
  { label: "Location", value: personalInfo.location },
  { label: "Languages", value: personalInfo.languages.join(", ") },
  { label: "Interests", value: personalInfo.interests.join(", ") },
];

document.getElementById("info-grid").innerHTML = tiles
  .map(
    (t) => `
    <div class="info-tile">
      <div class="info-label">${t.label}</div>
      <div class="info-value">${t.value}</div>
    </div>`
  )
  .join("");

setupReveal();

// Warm, slow-drifting ember particle field rising past a rotating badge —
// distinct from Home's orbiting-node structure and Education's staircase.
function createEmberField(scene, count) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
    speeds[i] = 0.3 + Math.random() * 0.5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xffb454, size: 0.06, transparent: true, opacity: 0.6, sizeAttenuation: true })
  );
  scene.add(points);
  return { points, speeds };
}

initPageScene({ bgColor: 0x150f0a, fogNear: 6, fogFar: 30 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xffcf94, groundColor: 0x150f0a, accent: 0xffb454 });

  const badge = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.15, 0.34, 140, 20),
    new THREE.MeshStandardMaterial({ color: 0x231a10, emissive: 0xffb454, emissiveIntensity: 0.4, roughness: 0.35, metalness: 0.4 })
  );
  scene.add(badge);

  const { points: embers, speeds } = createEmberField(scene, 220);

  camera.position.set(0, 1.4, 7.5);
  const basePosition = new THREE.Vector3(0, 1.4, 7.5);
  const parallax = attachMouseParallax(camera, basePosition, 0.9);

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    badge.rotation.x = t * 0.18;
    badge.rotation.y = t * 0.26;

    const posAttr = embers.geometry.getAttribute("position");
    for (let i = 0; i < speeds.length; i += 1) {
      let y = posAttr.getY(i) + speeds[i] * 0.01;
      if (y > 7) y = -7;
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;

    parallax();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
