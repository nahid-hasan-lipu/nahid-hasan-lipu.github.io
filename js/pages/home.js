import { THREE, addBaseLighting, createBeatPath, initPageScene, initCardFocus, makeSkyGradientTexture, addGlowLayers, makeNoiseTexture } from "../core.js";
import { profile } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows, icons } from "../nav.js";

renderNav("home");
initProgressBar();

document.getElementById("about-text").textContent = profile.about;
document.getElementById("hero-links").innerHTML = `
  <a class="btn btn--primary" href="${profile.github}" target="_blank" rel="noopener">${icons.github}<span>GitHub</span></a>
  <a class="btn" href="${profile.linkedin}" target="_blank" rel="noopener">${icons.linkedin}<span>LinkedIn</span></a>
`;

const planetCards = [
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

const beatCount = 1 + planetCards.length;

document.getElementById("planet-beats").innerHTML = planetCards
  .map(
    (p, i) => `
    <section class="beat" id="planet-${i}">
      <div class="content-card content-card--center" data-reveal>
        <span class="nav-card-icon" style="margin:0 auto 1rem;">${p.icon}</span>
        <p class="eyebrow">Destination ${i + 1} of ${planetCards.length}</p>
        <h2>${p.title}</h2>
        <p class="summary">${p.desc}</p>
        <a class="btn btn--primary" href="${p.href}">Explore ${p.title} →</a>
      </div>
    </section>`
  )
  .join("");

initCardFocus();
initScrollArrows(beatCount);

function makeNebulaSprite(color, size) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size, size, 1);
  return sprite;
}

// A sun the camera slowly orbits as you scroll, with one planet per
// destination page parked around it — the sun and starfield animate
// continuously on their own; the planets brighten as their beat comes
// into focus.
initPageScene({ bgColor: 0x05060c, fogNear: 16, fogFar: 46 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xffe3b0, groundColor: 0x05060c, accent: 0xffcc55 });

  scene.background = makeSkyGradientTexture([
    [0, "#020103"],
    [0.35, "#0a0518"],
    [0.65, "#150a28"],
    [1, "#05060c"],
  ]);

  // Soft nebula clouds scattered far behind the scene
  [
    { color: "rgba(120,90,255,0.5)", size: 40, pos: [-30, 10, -70] },
    { color: "rgba(255,110,150,0.4)", size: 34, pos: [35, -6, -80] },
    { color: "rgba(90,180,255,0.4)", size: 30, pos: [10, 22, -90] },
  ].forEach(({ color, size, pos }) => {
    const sprite = makeNebulaSprite(color, size);
    sprite.position.set(...pos);
    scene.add(sprite);
  });

  // Starfield — two depth layers for parallax richness
  function starLayer(count, spread, size, color, opacity) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true }));
    scene.add(pts);
    return pts;
  }
  const farStars = starLayer(700, 90, 0.09, 0xffffff, 0.65);
  const nearStars = starLayer(180, 45, 0.16, 0x9fc4ff, 0.85);

  // Sun — noise-textured surface (not a flat color) plus layered additive
  // glow instead of a single translucent sphere, so it reads as a real
  // light source rather than a flat-shaded primitive.
  const sunTexture = makeNoiseTexture("#4a2a08", "#ffd27a", { spots: 90 });
  const sun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 3),
    new THREE.MeshStandardMaterial({ map: sunTexture, emissive: 0xffcc55, emissiveMap: sunTexture, emissiveIntensity: 1.1, roughness: 0.5 })
  );
  scene.add(sun);
  const sunGlowGroup = addGlowLayers(scene, { position: new THREE.Vector3(0, 0, 0), color: 0xffcc55, baseRadius: 1.8, layers: 4 });

  const orbitRadius = 10;
  const angleSpan = Math.PI * 1.25;
  const startAngle = -angleSpan / 2;

  function angleForBeat(i) {
    return startAngle + (i / (beatCount - 1)) * angleSpan;
  }

  // Camera orbits the sun; each beat sits at one step around the arc
  const curve = createBeatPath(beatCount, (i) => {
    const angle = angleForBeat(i);
    return new THREE.Vector3(Math.cos(angle) * orbitRadius, 2.2 + Math.sin(i * 0.7) * 0.5, Math.sin(angle) * orbitRadius);
  });

  const planets = planetCards.map((p, j) => {
    const beatIndex = j + 1;
    // Offset slightly from the camera's exact angle at this beat so the
    // planet doesn't sit dead-centre between camera and sun (which made
    // it balloon in size and sit right behind the card).
    const angle = angleForBeat(beatIndex) + (j % 2 === 0 ? 0.22 : -0.22);
    const radius = 5.6;
    const group = new THREE.Group();
    group.position.set(Math.cos(angle) * radius, 1.2, Math.sin(angle) * radius);

    const planetTexture = makeNoiseTexture(`#${p.color.toString(16).padStart(6, "0")}`, "#ffffff", { spots: 40 });
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 24, 24),
      new THREE.MeshStandardMaterial({ map: planetTexture, color: p.color, emissive: p.color, emissiveIntensity: 0.35, roughness: 0.55 })
    );
    group.add(planet);
    addGlowLayers(group, { position: new THREE.Vector3(0, 0, 0), color: p.color, baseRadius: 0.5, layers: 2 });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.03, 8, 48),
      new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.35 })
    );
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    scene.add(group);
    return { group, planet, beatIndex, baseScale: 1 };
  });

  const sunTarget = new THREE.Vector3(0, 1.4, 0);
  const clock = new THREE.Clock();

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    const beatFloat = t * (beatCount - 1);

    camera.position.copy(curve.getPointAt(t));
    camera.lookAt(sunTarget);

    planets.forEach(({ group, beatIndex }) => {
      const proximity = Math.max(0, 1 - Math.abs(beatFloat - beatIndex));
      const scale = 1 + proximity * 0.35;
      group.scale.setScalar(scale);
    });
  }

  function animate() {
    const t = clock.getElapsedTime();
    sun.rotation.y = t * 0.15;
    sun.rotation.x = t * 0.08;
    sunGlowGroup.scale.setScalar(1 + Math.sin(t * 1.2) * 0.05);
    farStars.rotation.y = t * 0.004;
    nearStars.rotation.y = -t * 0.008;

    update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
