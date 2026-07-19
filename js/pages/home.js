import { THREE, addBaseLighting, createParticleField, attachMouseParallax, initPageScene, setupReveal } from "../core.js";
import { profile } from "../data.js";
import { renderNav, initProgressBar, icons } from "../nav.js";

renderNav("home");
initProgressBar();

document.getElementById("about-text").textContent = profile.about;
document.getElementById("hero-links").innerHTML = `
  <a class="btn btn--primary" href="${profile.github}" target="_blank" rel="noopener">${icons.github}<span>GitHub</span></a>
  <a class="btn" href="${profile.linkedin}" target="_blank" rel="noopener">${icons.linkedin}<span>LinkedIn</span></a>
`;

const navCards = [
  {
    href: "personal.html",
    title: "Personal Info",
    desc: "Nationality, work rights, languages, and interests.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  },
  {
    href: "education.html",
    title: "Education",
    desc: "Master's, Bachelor's, and secondary schooling timeline.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8l10-5 10 5-10 5-10-5Z"/><path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5"/></svg>`,
  },
  {
    href: "skills.html",
    title: "Skills",
    desc: "Programming, analytics/ML, and BI toolkit, grouped.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>`,
  },
  {
    href: "projects.html",
    title: "Projects",
    desc: "9 end-to-end case studies — Python, Power BI, real data.",
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  },
  {
    href: "contact.html",
    title: "Contact",
    desc: "Email, LinkedIn, and GitHub — let's connect.",
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

const NODE_COLORS = [0xffb454, 0x3ddc97, 0xa78bfa, 0x4dd0e1, 0xff6b81];

initPageScene({ bgColor: 0x0a0d12, fogNear: 6, fogFar: 30 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { accent: 0x5b8cff });
  createParticleField(scene, { count: 260, spread: 26, color: 0x8fb3ff });

  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.3, 1),
    new THREE.MeshStandardMaterial({ color: 0x1c2433, emissive: 0x5b8cff, emissiveIntensity: 0.35, roughness: 0.35, metalness: 0.3, wireframe: false })
  );
  orbitGroup.add(core);
  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.34, 1),
    new THREE.MeshBasicMaterial({ color: 0x5b8cff, wireframe: true, transparent: true, opacity: 0.4 })
  );
  orbitGroup.add(coreWire);

  const nodes = NODE_COLORS.map((color, i) => {
    const radius = 3.4 + i * 0.9;
    const speed = 0.25 - i * 0.03;
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 20, 20),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, roughness: 0.4 })
    );
    orbitGroup.add(node);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius - 0.01, radius + 0.01, 64),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    ring.rotation.x = Math.PI / 2;
    orbitGroup.add(ring);
    return { node, radius, speed, phase: (i / NODE_COLORS.length) * Math.PI * 2 };
  });

  camera.position.set(0, 1.6, 9);
  const basePosition = new THREE.Vector3(0, 1.6, 9);
  const parallax = attachMouseParallax(camera, basePosition, 1.1);

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    orbitGroup.rotation.y = t * 0.08;
    coreWire.rotation.y = -t * 0.15;
    coreWire.rotation.x = t * 0.1;
    nodes.forEach(({ node, radius, speed, phase }) => {
      const angle = t * speed + phase;
      node.position.set(Math.cos(angle) * radius, Math.sin(t * 0.4 + phase) * 0.6, Math.sin(angle) * radius);
    });
    parallax();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
