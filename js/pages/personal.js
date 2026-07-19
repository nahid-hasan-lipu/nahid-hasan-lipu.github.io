import { THREE, addBaseLighting, createBeatPath, createScrollCameraUpdater, initPageScene, initCardFocus, makeSkyGradientTexture, makeNoiseTexture } from "../core.js";
import { personalInfo } from "../data.js";
import { renderNav, initProgressBar, initScrollArrows } from "../nav.js";

renderNav("personal");
initProgressBar();

const tiles = [
  { label: "Nationality", value: personalInfo.nationality },
  { label: "NZ Work Rights", value: personalInfo.workRights },
  { label: "Location", value: personalInfo.location },
  { label: "Languages", value: personalInfo.languages.join(", ") },
  { label: "Interests", value: personalInfo.interests.join(", ") },
];

const ACCENT = 0xffb454;
const SPACING = 16;
const beatCount = 1 + tiles.length;

document.getElementById("forest-beats").innerHTML = tiles
  .map((t, i) => {
    const side = i % 2 === 0 ? "right" : "left";
    return `
    <section class="beat" id="clearing-${i}">
      <div class="content-card content-card--${side}" data-reveal>
        <p class="eyebrow">${t.label}</p>
        <h2>${t.value}</h2>
      </div>
    </section>`;
  })
  .join("");

initCardFocus();
initScrollArrows(beatCount);

const barkTexture = makeNoiseTexture("#241708", "#4a3116", { size: 64, spots: 30 });
const foliageTexture = makeNoiseTexture("#0f2814", "#2f5a26", { size: 96, spots: 70 });

// Organic canopy — a cluster of overlapping, irregularly offset blobs
// instead of three clean stacked cones, so the silhouette doesn't read as
// a geometric primitive.
function buildTree(scale = 1) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1 * scale, 0.22 * scale, 1.7 * scale, 7),
    new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.95 })
  );
  trunk.position.y = 0.85 * scale;
  group.add(trunk);

  const foliageMat = new THREE.MeshStandardMaterial({ map: foliageTexture, roughness: 0.85 });
  const blobCount = 5;
  for (let i = 0; i < blobCount; i += 1) {
    const blobScale = (0.75 + Math.random() * 0.55) * scale;
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(blobScale, 0), foliageMat);
    blob.position.set(
      (Math.random() - 0.5) * 0.9 * scale,
      (1.7 + Math.random() * 1.3) * scale,
      (Math.random() - 0.5) * 0.9 * scale
    );
    blob.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(blob);
  }
  return group;
}

function buildBird() {
  const group = new THREE.Group();
  const wingMat = new THREE.MeshBasicMaterial({ color: 0x1a140c, side: THREE.DoubleSide });
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

initPageScene({ bgColor: 0x0d1a10, fogNear: 6, fogFar: 30 }, ({ scene, camera, renderer }) => {
  addBaseLighting(scene, camera, { skyColor: 0xbfe8a8, groundColor: 0x0d1a10, accent: ACCENT });

  scene.background = makeSkyGradientTexture([
    [0, "#050d07"],
    [0.5, "#0d1c10"],
    [0.8, "#1c2a14"],
    [1, "#3a3418"],
  ]);

  const totalLength = (beatCount - 1) * SPACING;

  const groundTexture = makeNoiseTexture("#101f0c", "#233a18", { size: 128, spots: 90 });
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(8, (totalLength + 60) / 8);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, totalLength + 60),
    new THREE.MeshStandardMaterial({ map: groundTexture, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -1.6, -totalLength / 2 + 10);
  scene.add(ground);

  // Dense background trees for forest depth
  for (let i = -2; i < beatCount + 2; i += 1) {
    for (let s = 0; s < 3; s += 1) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const tree = buildTree(0.7 + Math.random() * 0.8);
      tree.position.set(side * (4 + Math.random() * 10), -1.6, -i * SPACING + (Math.random() - 0.5) * SPACING);
      scene.add(tree);
    }
  }

  // Marker tree with a glow ring at each info beat
  const markerTrees = tiles.map((t, i) => {
    const beatIndex = i + 1;
    const side = i % 2 === 0 ? -1 : 1;
    const z = -beatIndex * SPACING;
    const tree = buildTree(1.3);
    tree.position.set(side * 3.2, -1.6, z);
    scene.add(tree);

    const glow = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.7, 32),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(side * 3.2, -1.55, z);
    scene.add(glow);

    return { tree, glow, beatIndex };
  });

  // Birds — always flying, independent of scroll
  const birds = [0, 1, 2, 3].map((i) => {
    const bird = buildBird();
    scene.add(bird);
    return { bird, radius: 6 + i * 2.5, speed: 0.25 + i * 0.05, height: 3 + i * 0.8, zOffset: -i * SPACING * 2, phase: i * 1.7 };
  });

  // Fireflies drifting through the undergrowth
  const fireflyCount = 120;
  const fireflyPos = new Float32Array(fireflyCount * 3);
  for (let i = 0; i < fireflyCount; i += 1) {
    fireflyPos[i * 3] = (Math.random() - 0.5) * 16;
    fireflyPos[i * 3 + 1] = Math.random() * 3 - 1;
    fireflyPos[i * 3 + 2] = -Math.random() * (totalLength + 20);
  }
  const fireflyGeo = new THREE.BufferGeometry();
  fireflyGeo.setAttribute("position", new THREE.BufferAttribute(fireflyPos, 3));
  const fireflies = new THREE.Points(
    fireflyGeo,
    new THREE.PointsMaterial({ color: 0xffe08a, size: 0.07, transparent: true, opacity: 0.75, sizeAttenuation: true })
  );
  scene.add(fireflies);

  const curve = createBeatPath(beatCount, (i) => new THREE.Vector3(Math.sin(i * 0.7) * 1.6, 0.4, -i * SPACING));
  const updateCamera = createScrollCameraUpdater(camera, curve, beatCount, { lookAhead: 0.05 });

  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    markerTrees.forEach(({ glow }) => {
      glow.material.opacity = 0.4 + Math.sin(t * 1.5) * 0.2;
      glow.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08);
    });

    birds.forEach(({ bird, radius, speed, height, zOffset, phase }) => {
      const angle = t * speed + phase;
      bird.position.set(Math.cos(angle) * radius, height + Math.sin(t * 2 + phase) * 0.3, Math.sin(angle) * radius + zOffset - t * 0.6);
      bird.rotation.y = -angle + Math.PI / 2;
      bird.children.forEach((wing, wi) => {
        wing.rotation.z = Math.sin(t * 10 + phase) * 0.5 * (wi === 0 ? 1 : -1);
      });
    });

    const fPos = fireflyGeo.getAttribute("position");
    for (let i = 0; i < fireflyCount; i += 1) {
      fPos.setY(i, fPos.getY(i) + Math.sin(t * 2 + i) * 0.002);
    }
    fPos.needsUpdate = true;

    updateCamera();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
});
