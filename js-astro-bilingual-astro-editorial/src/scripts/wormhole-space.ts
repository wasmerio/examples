import * as THREE from "three";

const ASSETS = "/media/";

/** Modern Three.js adaptation of Wormhole Extreme's Stage, Nebula, Stars, Planets and Wormhole. */
export function mountWormholeSpace(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-space-stage]");
  const content = document.querySelector<HTMLElement>(".space-content");
  const button = document.querySelector<HTMLButtonElement>("[data-hyper-button]");
  if (!canvas || !content || !button) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x010208, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 4000);
  camera.position.z = 200;
  const pointer = new THREE.Vector2();
  const cameraOffset = new THREE.Vector3();
  const loader = new THREE.TextureLoader();
  const load = (name: string) => loader.load(`${ASSETS}${name}`);

  const nebulaTexture = load("wormhole-water.webp");
  nebulaTexture.wrapS = nebulaTexture.wrapT = THREE.RepeatWrapping;
  nebulaTexture.repeat.set(3, 8);
  const nebula = new THREE.Mesh(
    new THREE.CylinderGeometry(1000, 1000, 3000, 64, 1, true),
    new THREE.MeshBasicMaterial({ map: nebulaTexture, side: THREE.BackSide, transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  nebula.rotation.x = Math.PI / 2;
  nebula.position.z = -1300;
  scene.add(nebula);
  const nebulaLight = new THREE.PointLight(0x5f7dff, 2, 1800);
  nebulaLight.position.set(0, 0, -500);
  scene.add(nebulaLight);

  const stars = new THREE.Group();
  const starMaterial = new THREE.PointsMaterial({ map: load("wormhole-star.webp"), size: 9, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const positions = new Float32Array(600 * 3);
  const colors = new Float32Array(600 * 3);
  const palette = [new THREE.Color(0x8eb5ff), new THREE.Color(0xffd39a), new THREE.Color(0xffffff), new THREE.Color(0xa98cff)];
  for (let i = 0; i < 600; i += 1) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 1800;
    positions[i3 + 1] = (Math.random() - 0.5) * 1200;
    positions[i3 + 2] = -Math.random() * 3000;
    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  stars.add(new THREE.Points(starGeometry, starMaterial));
  scene.add(stars);

  const planets = new THREE.Group();
  const planetCandidates = ["wormhole-planet1.webp", "wormhole-planet2.webp", "wormhole-planet3.webp", "wormhole-planet4.webp", "wormhole-planet5.webp"];
  [[-360, 130, -650, 105], [400, -150, -1250, 145]].forEach(([x, y, z, radius], index) => {
    const planet = new THREE.Mesh(new THREE.SphereGeometry(radius, 40, 28), new THREE.MeshPhongMaterial({ map: load(planetCandidates[index]), shininess: 12 }));
    planet.position.set(x, y, z);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.06, 32, 20), new THREE.MeshBasicMaterial({ color: 0x6da7ff, transparent: true, opacity: 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending }));
    atmosphere.position.copy(planet.position);
    planets.add(planet, atmosphere);
  });
  scene.add(planets);

  const wormhole = new THREE.Mesh(
    new THREE.CylinderGeometry(80, 300, 1000, 64, 1, true),
    new THREE.MeshBasicMaterial({ map: nebulaTexture, side: THREE.BackSide, transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  wormhole.rotation.x = Math.PI / 2;
  wormhole.position.copy(camera.position);
  const wormholeLight = new THREE.PointLight(0xff5cdb, 4, 1200);
  let hyper = false;
  let elapsedHyper = 0;

  const hyperStart = () => {
    if (hyper) return;
    hyper = true;
    elapsedHyper = 0;
    content.classList.add("is-hidden");
    scene.add(wormhole);
    scene.add(wormholeLight);
    scene.remove(planets);
    stars.position.z -= 5000;
    starMaterial.size = 22;
    nebulaLight.color.set(0xff3fbd);
    nebulaTexture.repeat.set(8, 16);
  };
  const hyperStop = () => {
    hyper = false;
    content.classList.remove("is-hidden");
    scene.remove(wormhole, wormholeLight);
    scene.add(planets);
    nebulaLight.color.set(0x5f7dff);
    nebulaTexture.repeat.set(3, 8);
    stars.position.z = 0;
    starMaterial.size = 9;
    nebula.position.z = -1300;
  };
  button.addEventListener("click", () => {
    hyperStart();
    window.setTimeout(hyperStop, 2500);
  });

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  };
  const onPointer = (event: PointerEvent) => pointer.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
  let last = performance.now();
  const animate = (now: number) => {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    const speed = hyper ? 95 : 3;
    if (hyper) elapsedHyper += delta;
    stars.position.z += speed * delta;
    nebula.position.z += speed * delta * 0.25;
    nebulaTexture.offset.y -= delta * (hyper ? 2.8 : 0.08);
    planets.rotation.y += delta * 0.08;
    if (hyper) {
      wormhole.position.copy(camera.position);
      wormhole.scale.setScalar(1 + Math.min(2.5, elapsedHyper * 1.8));
      wormholeTextureOffset(wormhole, delta * 3);
    }
    cameraOffset.x += (pointer.x * 28 - cameraOffset.x) * delta * 3;
    cameraOffset.y += (-pointer.y * 18 - cameraOffset.y) * delta * 3;
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.lookAt(cameraOffset.x * 0.08, cameraOffset.y * 0.08, -900);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  requestAnimationFrame(animate);
}

function wormholeTextureOffset(mesh: THREE.Mesh, amount: number): void {
  const material = mesh.material as THREE.MeshBasicMaterial;
  if (material.map) material.map.offset.y -= amount;
}
