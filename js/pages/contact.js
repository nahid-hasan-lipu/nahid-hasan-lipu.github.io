import { THREE, addBaseLighting, attachMouseParallax, initPageScene, setupReveal, makeSkyGradientTexture, addGlowLayers } from "../core.js";
import { profile } from "../data.js";
import { renderNav, initProgressBar, icons } from "../nav.js";

renderNav("contact");
initProgressBar();

const tiles = [
  { href: `mailto:${profile.email}`, icon: icons.mail, label: profile.email },
  ...(profile.phone ? [{ href: `tel:${profile.phone.replace(/[^+\d]/g, "")}`, icon: icons.phone, label: profile.phone }] : []),
  { href: profile.linkedin, icon: icons.linkedin, label: "LinkedIn" },
  { href: profile.github, icon: icons.github, label: "GitHub" },
];

document.getElementById("contact-tiles").innerHTML = tiles
  .map(
    (t) => `
    <a class="contact-tile" href="${t.href}" target="_blank" rel="noopener">
      <span class="tile-icon">${t.icon}</span>
      <span class="tile-label">${t.label}</span>
    </a>`
  )
  .join("");

setupReveal();

// A single pulsing beacon with signal particles drifting inward toward
// it — the simplest, calmest scene on the site, fitting for a contact page.
initPageScene({ bgColor: 0x170a0d, fogNear: 6, fogFar: 26 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xffb3c0, groundColor: 0x170a0d, accent: 0xff6b81 });

  scene.background = makeSkyGradientTexture([
    [0, "#0a0407"],
    [0.5, "#1a0a10"],
    [0.8, "#2e0f16"],
    [1, "#170a0d"],
  ]);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x2a1013, emissive: 0xff6b81, emissiveIntensity: 0.55, roughness: 0.35 })
  );
  scene.add(beacon);
  const beaconGlow = addGlowLayers(scene, { position: new THREE.Vector3(0, 0, 0), color: 0xff6b81, baseRadius: 1, layers: 4 });

  const ringGeo = new THREE.RingGeometry(1.3, 1.35, 64);
  const rings = [0, 1, 2].map((i) => {
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xff6b81, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    return { ring, offset: i * 1.6 };
  });

  const count = 160;
  const positions = new Float32Array(count * 3);
  const radii = new Float32Array(count);
  const angles = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    radii[i] = 4 + Math.random() * 8;
    angles[i] = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angles[i]) * radii[i];
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = Math.sin(angles[i]) * radii[i] - 6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const signals = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffb3c0, size: 0.06, transparent: true, opacity: 0.7 }));
  scene.add(signals);

  // Small satellites orbiting the beacon — one per way to reach me
  const satellites = tiles.map((_, i) => {
    const sat = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xffe3e8, emissive: 0xff6b81, emissiveIntensity: 0.6 })
    );
    scene.add(sat);
    return { sat, radius: 2.3 + i * 0.4, speed: 0.35 + i * 0.08, phase: i * 1.4, tilt: (i / tiles.length) * Math.PI };
  });

  camera.position.set(0, 1.2, 7);
  const basePosition = new THREE.Vector3(0, 1.2, 7);
  const parallax = attachMouseParallax(camera, basePosition, 0.8);

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.4) * 0.06;
    beacon.scale.setScalar(pulse);
    beaconGlow.scale.setScalar(pulse);

    rings.forEach(({ ring, offset }) => {
      const local = (t * 0.5 + offset) % 4.8;
      const scale = 1 + local;
      ring.scale.setScalar(scale);
      ring.material.opacity = Math.max(0, 0.5 - local / 4.8);
    });

    const posAttr = geo.getAttribute("position");
    for (let i = 0; i < count; i += 1) {
      radii[i] -= 0.01;
      if (radii[i] < 1.4) radii[i] = 11;
      posAttr.setX(i, Math.cos(angles[i]) * radii[i]);
      posAttr.setZ(i, Math.sin(angles[i]) * radii[i] - 6);
    }
    posAttr.needsUpdate = true;

    satellites.forEach(({ sat, radius, speed, phase, tilt }) => {
      const angle = t * speed + phase;
      sat.position.set(Math.cos(angle) * radius, Math.sin(tilt) * Math.sin(angle) * radius * 0.4, Math.sin(angle) * radius * Math.cos(tilt));
    });

    parallax();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
