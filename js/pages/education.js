import { THREE, addBaseLighting, createParticleField, initPageScene, setupReveal } from "../core.js";
import { education } from "../data.js";
import { renderNav, initProgressBar } from "../nav.js";

renderNav("education");
initProgressBar();

document.getElementById("timeline").innerHTML = education
  .map(
    (e) => `
    <div class="timeline-item">
      <div class="period">${e.period}</div>
      <h3>${e.degree}</h3>
      <div class="institution">${e.institution}</div>
      <div class="detail">${e.detail}</div>
    </div>`
  )
  .join("");

setupReveal();

// An ascending staircase of glowing platforms, one per stage of education
// (oldest at the back/bottom, most recent at the front/top) — the camera
// drifts slowly along it on its own, a different motion pattern from the
// orbiting Home scene or the idle badge on Personal Info.
initPageScene({ bgColor: 0x081414, fogNear: 6, fogFar: 34 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0x8fffd8, groundColor: 0x081414, accent: 0x3ddc97 });
  createParticleField(scene, { count: 200, spread: 24, color: 0x8fffd8 });

  const stageCount = education.length;
  const platforms = [];
  for (let i = 0; i < stageCount; i += 1) {
    // education[] is newest-first; the staircase should rise from the
    // oldest stage (SSC) to the newest (Master's), so invert the index.
    const stepIndex = stageCount - 1 - i;
    const y = stepIndex * 1.5;
    const z = -stepIndex * 5;
    const x = stepIndex % 2 === 0 ? -1.2 : 1.2;

    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.15, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x0e2420, roughness: 0.5, metalness: 0.2 })
    );
    platform.position.set(x, y, z);
    scene.add(platform);

    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(2.65, 0.03, 2.25),
      new THREE.MeshBasicMaterial({ color: 0x3ddc97, transparent: true, opacity: 0.85 })
    );
    edge.position.set(x, y + 0.09, z);
    scene.add(edge);

    platforms.push({ x, y, z });
  }

  // Reverse so the camera path runs oldest (close) -> newest (far), an
  // ascending journey rather than a descending one.
  const curvePoints = [...platforms].reverse().map((p) => new THREE.Vector3(p.x * 0.4, p.y + 2, p.z + 4));
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.4);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    const drift = (Math.sin(t * 0.05) + 1) / 2;
    const pos = curve.getPointAt(drift);
    camera.position.set(pos.x + mouse.x * 0.8, pos.y - mouse.y * 0.4, pos.z);
    const lookAhead = curve.getPointAt(Math.min(drift + 0.05, 1));
    camera.lookAt(lookAhead.x, lookAhead.y - 1, lookAhead.z - 6);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
