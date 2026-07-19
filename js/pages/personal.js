import { THREE, initPageScene, setupReveal } from "../core.js";
import { personalInfo } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("personal");
initProgressBar();

document.getElementById("photo-bg").style.backgroundImage = "url('assets/images/tree-canopy.jpg')";

const tiles = [
  { label: "Nationality", value: personalInfo.nationality, x: "20%", y: "24%" },
  { label: "NZ Work Rights", value: personalInfo.workRights, x: "56%", y: "12%" },
  { label: "Location", value: personalInfo.location, x: "85%", y: "40%" },
  { label: "Languages", value: personalInfo.languages.join(", "), x: "15%", y: "78%" },
  { label: "Interests", value: personalInfo.interests.join(", "), x: "74%", y: "82%" },
];

const beatCount = 1 + tiles.length;

document.getElementById("forest-beats").innerHTML = tiles
  .map(
    (t, i) => `
    <section class="beat" id="clearing-${i}">
      <div class="content-card branch-card" style="--branch-x:${t.x}; --branch-y:${t.y};" data-branch-index="${i}">
        <p class="eyebrow">${t.label}</p>
        <h2>${t.value}</h2>
      </div>
    </section>`
  )
  .join("");

setupReveal(); // only the intro card has [data-reveal]; branch cards manage their own visibility below
initScrollArrows(beatCount);

const branchCards = Array.from(document.querySelectorAll(".branch-card"));

function currentBeat() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const t = max > 0 ? window.scrollY / max : 0;
  return Math.round(t * (beatCount - 1));
}

function updateActiveCard() {
  const beat = currentBeat();
  branchCards.forEach((card, i) => {
    card.classList.toggle("is-active", beat === i + 1);
  });

  // Subtle parallax pan/zoom on the real photo backdrop as you scroll
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const t = max > 0 ? window.scrollY / max : 0;
  const bg = document.getElementById("photo-bg");
  bg.style.transform = `scale(1.04) translateY(${(t - 0.5) * -20}px)`;
}
window.addEventListener("scroll", updateActiveCard, { passive: true });
updateActiveCard();

function buildBird() {
  const group = new THREE.Group();
  const wingMat = new THREE.MeshBasicMaterial({ color: 0x141008, side: THREE.DoubleSide });
  const wingShape = new THREE.BufferGeometry();
  const verts = new Float32Array([0, 0, 0, 0.35, 0.12, 0, 0.7, 0, 0]);
  wingShape.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  wingShape.setIndex([0, 1, 2]);
  const left = new THREE.Mesh(wingShape, wingMat);
  const right = new THREE.Mesh(wingShape, wingMat);
  right.scale.x = -1;
  group.add(left, right);
  return group;
}

// A transparent overlay — only birds and drifting fireflies render here,
// the real tree photo shows through behind them.
initPageScene({ bgColor: 0x000000, transparent: true }, ({ scene, camera, renderer }) => {
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const birds = [0, 1, 2, 3].map((i) => {
    const bird = buildBird();
    scene.add(bird);
    return { bird, radius: 6 + i * 2.2, speed: 0.22 + i * 0.05, height: 1 + i * 0.9, phase: i * 1.7 };
  });

  const fireflyCount = 90;
  const fireflyPos = new Float32Array(fireflyCount * 3);
  for (let i = 0; i < fireflyCount; i += 1) {
    fireflyPos[i * 3] = (Math.random() - 0.5) * 14;
    fireflyPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
    fireflyPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
  }
  const fireflyGeo = new THREE.BufferGeometry();
  fireflyGeo.setAttribute("position", new THREE.BufferAttribute(fireflyPos, 3));
  const fireflies = new THREE.Points(
    fireflyGeo,
    new THREE.PointsMaterial({ color: 0xffe08a, size: 0.06, transparent: true, opacity: 0.75, sizeAttenuation: true })
  );
  scene.add(fireflies);

  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    birds.forEach(({ bird, radius, speed, height, phase }) => {
      const angle = t * speed + phase;
      bird.position.set(Math.cos(angle) * radius * 0.4, height + Math.sin(t * 2 + phase) * 0.3, Math.sin(angle) * radius - 6);
      bird.rotation.y = -angle + Math.PI / 2;
      bird.children.forEach((wing, wi) => {
        wing.rotation.z = Math.sin(t * 10 + phase) * 0.5 * (wi === 0 ? 1 : -1);
      });
    });

    const posAttr = fireflyGeo.getAttribute("position");
    for (let i = 0; i < fireflyCount; i += 1) {
      posAttr.setY(i, posAttr.getY(i) + Math.sin(t * 2 + i) * 0.002);
    }
    posAttr.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
