import { THREE, addBaseLighting, attachMouseParallax, initPageScene, setupReveal, makeSkyGradientTexture, addGlowLayers, avatarImgTag, PHOTO_SLOTS } from "../core.js";
import { profile } from "../data.js";
import { renderNav, initProgressBar, icons } from "../nav.js";

renderNav("home");
initProgressBar();

document.getElementById("avatar-slot").innerHTML = avatarImgTag(PHOTO_SLOTS[0].path, { size: 140 });
document.getElementById("about-text").textContent = profile.about;
document.getElementById("hero-links").innerHTML = `
  <a class="btn btn--primary" href="${profile.github}" target="_blank" rel="noopener">${icons.github}<span>GitHub</span></a>
  <a class="btn" href="${profile.linkedin}" target="_blank" rel="noopener">${icons.linkedin}<span>LinkedIn</span></a>
`;

const navCards = [
  {
    href: "personal.html",
    color: 0xffb454,
    title: "Personal Info",
    desc: "Nationality, work rights, languages, and interests.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  },
  {
    href: "education.html",
    color: 0x3ddc97,
    title: "Education",
    desc: "Master's, Bachelor's, and secondary schooling timeline.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8l10-5 10 5-10 5-10-5Z"/><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5"/></svg>`,
  },
  {
    href: "skills.html",
    color: 0xa78bfa,
    title: "Skills",
    desc: "6 skill categories, from programming to healthcare compliance.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>`,
  },
  {
    href: "certifications.html",
    color: 0xf4c95d,
    title: "Certifications",
    desc: "11 verified credentials — AWS, Kaggle, and Google Skills.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></svg>`,
  },
  {
    href: "projects.html",
    color: 0x4dd0e1,
    title: "Projects",
    desc: "9 end-to-end case studies — Python, Power BI, real data.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  },
  {
    href: "contact.html",
    color: 0xff6b81,
    title: "Contact",
    desc: "Email, phone, LinkedIn, and GitHub — let's connect.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></svg>`,
  },
];

document.getElementById("nav-grid").innerHTML = navCards
  .map(
    (c) => `
    <a class="nav-card" href="${c.href}">
      <span class="nav-card-icon">${c.icon}</span>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
    </a>`
  )
  .join("");

setupReveal();

// A single pulsing core with an orbiting satellite for each destination
// page — the same calm, single-view mechanic as the Contact page's beacon,
// just re-themed and pointed at navigation instead of contact methods.
initPageScene({ bgColor: 0x05060c, fogNear: 6, fogFar: 26 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0x8fb3ff, groundColor: 0x05060c, accent: 0x5b8cff });

  scene.background = makeSkyGradientTexture([
    [0, "#020103"],
    [0.5, "#0a0d18"],
    [0.8, "#141a2e"],
    [1, "#05060c"],
  ]);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x12162a, emissive: 0x5b8cff, emissiveIntensity: 0.55, roughness: 0.35 })
  );
  scene.add(core);
  const coreGlow = addGlowLayers(scene, { position: new THREE.Vector3(0, 0, 0), color: 0x5b8cff, baseRadius: 1, layers: 4 });

  const ringGeo = new THREE.RingGeometry(1.3, 1.35, 64);
  const rings = [0, 1, 2].map((i) => {
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x5b8cff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
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
  const signals = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x9fc4ff, size: 0.06, transparent: true, opacity: 0.7 }));
  scene.add(signals);

  // Orbiting satellites — one per destination page, coloured to match
  const satellites = navCards.map((c, i) => {
    const sat = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      new THREE.MeshStandardMaterial({ color: c.color, emissive: c.color, emissiveIntensity: 0.6 })
    );
    scene.add(sat);
    return { sat, radius: 2.6 + i * 0.55, speed: 0.28 + i * 0.06, phase: i * 1.3, tilt: (i / navCards.length) * Math.PI };
  });

  camera.position.set(0, 1.2, 8);
  const basePosition = new THREE.Vector3(0, 1.2, 8);
  const parallax = attachMouseParallax(camera, basePosition, 0.9);

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.2) * 0.06;
    core.scale.setScalar(pulse);
    coreGlow.scale.setScalar(pulse);
    core.rotation.y = t * 0.1;

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
