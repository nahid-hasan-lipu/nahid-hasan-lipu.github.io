import { THREE, addBaseLighting, attachMouseParallax, initPageScene, setupReveal } from "../core.js";
import { skillGroups } from "../data.js";
import { renderNav, initProgressBar } from "../nav.js";

renderNav("skills");
initProgressBar();

document.getElementById("skill-groups").innerHTML = skillGroups
  .map(
    (g) => `
    <div class="skill-group-card">
      <h3>${g.category}</h3>
      <div class="chip-row">${g.items.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
    </div>`
  )
  .join("");

setupReveal();

// A center sphere with one orbiting ring of small crystals per skill
// group — distinct from Home's single orbit-of-nodes (this has *rings*
// per category, all spinning at different tilts) and from every other
// page's motion pattern.
initPageScene({ bgColor: 0x120a1f, fogNear: 6, fogFar: 30 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xd8b9ff, groundColor: 0x120a1f, accent: 0xa78bfa });

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(1, 2),
    new THREE.MeshStandardMaterial({ color: 0x1e1430, emissive: 0xa78bfa, emissiveIntensity: 0.4, roughness: 0.4, metalness: 0.3 })
  );
  scene.add(core);

  const rings = skillGroups.map((group, i) => {
    const ringGroup = new THREE.Group();
    ringGroup.rotation.x = (Math.PI / 6) * i;
    ringGroup.rotation.z = (Math.PI / 9) * i;
    scene.add(ringGroup);

    const radius = 2.6 + i * 0.9;
    const crystalCount = group.items.length;
    for (let c = 0; c < crystalCount; c += 1) {
      const angle = (c / crystalCount) * Math.PI * 2;
      const crystal = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.22, 0),
        new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.5, roughness: 0.3 })
      );
      crystal.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      ringGroup.add(crystal);
    }
    return { group: ringGroup, speed: 0.12 + i * 0.05 };
  });

  camera.position.set(0, 1.4, 8.5);
  const basePosition = new THREE.Vector3(0, 1.4, 8.5);
  const parallax = attachMouseParallax(camera, basePosition, 1);

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    core.rotation.y = t * 0.2;
    core.rotation.x = t * 0.1;
    rings.forEach(({ group, speed }, i) => {
      group.rotation.y = t * speed * (i % 2 === 0 ? 1 : -1);
    });
    parallax();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
