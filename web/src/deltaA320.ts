import * as THREE from "three";
import { buildSubsystemParts } from "./subsystemGeometry";
import { ADDITIONAL_SUBSYSTEMS } from "./subsystemExpansion";
import { getLivery, type AirlineVariant } from "./airlineVariants";

export type AircraftAssembly = {
  id: string;
  label: string;
  system: string;
  group: THREE.Group;
  offset: THREE.Vector3;
  anchor: THREE.Vector3;
  materials: THREE.MeshStandardMaterial[];
  labelPriority: boolean;
};

export const A320_DIMENSIONS = { length: 37.57, span: 34.1, diameter: 3.95 };
export const DELTA_MODEL_VERSION = "Original study / 05 · utility & safety systems";

// Original, illustrative geometry. +X is the nose, +Y up, +Z the port wing.
// Dimensions describe the classic wingtip-fence A320 envelope, not a serialised airframe.
export function createDeltaA320(airline: AirlineVariant = "delta") {
  const livery = getLivery(airline);
  const root = new THREE.Group();
  root.name = `Planatomy original ${livery.name} A320 study`;
  const assemblies: AircraftAssembly[] = [];
  const textures: THREE.Texture[] = [];
  const internalContext: THREE.Object3D[] = [];
  const palette = {
    white: livery.white, navy: livery.navy, red: livery.red, silver: livery.silver,
    wing: 0xd0d9e3, dark: 0x101a29, teal: livery.accent, gold: 0xdca34d,
  };
  function material(color: number, metalness = 0.15, roughness = 0.43) {
    return new THREE.MeshStandardMaterial({ color, metalness, roughness, side: THREE.DoubleSide });
  }
  function assembly(id: string, label: string, system: string, offset: number[], anchor: number[], labelPriority = false) {
    const group = new THREE.Group(); group.name = label; group.userData.assemblyId = id;
    root.add(group);
    const item: AircraftAssembly = { id, label, system, group, offset: new THREE.Vector3(...offset),
      anchor: new THREE.Vector3(...anchor), materials: [], labelPriority };
    assemblies.push(item);
    return group;
  }
  function mesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, mat: THREE.Material, position = [0, 0, 0]) {
    const object = new THREE.Mesh(geometry, mat); object.position.set(...position as [number, number, number]);
    object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  }
  function box(parent: THREE.Object3D, size: number[], position: number[], mat: THREE.Material) {
    return mesh(parent, new THREE.BoxGeometry(...size as [number, number, number]), mat, position);
  }
  function tube(parent: THREE.Object3D, points: number[][], radius: number, mat: THREE.Material) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, "centripetal");
    return mesh(parent, new THREE.TubeGeometry(curve, 28, radius, 7, false), mat);
  }
  function cylinderX(parent: THREE.Object3D, r: number, r2: number, length: number, position: number[], mat: THREE.Material) {
    const object = mesh(parent, new THREE.CylinderGeometry(r, r2, length, 36), mat, position);
    object.rotation.z = -Math.PI / 2; return object;
  }
  function ringX(parent: THREE.Object3D, r: number, thickness: number, position: number[], mat: THREE.Material) {
    const object = mesh(parent, new THREE.TorusGeometry(r, thickness, 10, 48), mat, position);
    object.rotation.y = Math.PI / 2; return object;
  }
  function panel(parent: THREE.Object3D, points: number[][], depth: number, mat: THREE.Material, axis: "y" | "z" = "y") {
    const shape = new THREE.Shape(points.map(p => new THREE.Vector2(p[0], p[1])));
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
    if (axis === "y") geometry.rotateX(Math.PI / 2);
    return mesh(parent, geometry, mat);
  }
  function canvasMap(draw: (ctx: CanvasRenderingContext2D) => void, width = 1024, height = 256) {
    const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d"); if (ctx) draw(ctx);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4; textures.push(texture); return texture;
  }
  const fallbackWordmark = canvasMap(ctx => {
    ctx.clearRect(0, 0, 1024, 256); ctx.fillStyle = `#${livery.red.toString(16).padStart(6, "0")}`;
    ctx.beginPath(); ctx.moveTo(84, 49); ctx.lineTo(25, 174); ctx.lineTo(81, 139); ctx.closePath(); ctx.fill();
    ctx.fillStyle = `#${livery.accent.toString(16).padStart(6, "0")}`; ctx.beginPath(); ctx.moveTo(88, 49); ctx.lineTo(146, 174); ctx.lineTo(91, 139); ctx.closePath(); ctx.fill();
    ctx.fillStyle = `#${livery.navy.toString(16).padStart(6, "0")}`;
    const fontSize = livery.wordmark.length > 8 ? 86 : livery.wordmark.length > 6 ? 105 : 124;
    ctx.font = `600 ${fontSize}px Arial, sans-serif`;
    ctx.fillText(livery.wordmark, 170, 174);
  });
  const tailmark = canvasMap(ctx => {
    const red = `#${livery.red.toString(16).padStart(6, "0")}`, accent = `#${livery.accent.toString(16).padStart(6, "0")}`;
    if (livery.tailStyle === "delta") {
      ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(650, 60); ctx.lineTo(150, 775); ctx.lineTo(610, 613); ctx.closePath(); ctx.fill();
      ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(670, 60); ctx.lineTo(875, 828); ctx.lineTo(642, 617); ctx.closePath(); ctx.fill();
    } else if (livery.tailStyle === "stripes") {
      for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? accent : red; ctx.beginPath(); ctx.moveTo(95 + i * 95, 80); ctx.lineTo(450 + i * 55, 890); ctx.lineTo(555 + i * 42, 850); ctx.lineTo(205 + i * 95, 65); ctx.closePath(); ctx.fill(); }
    } else if (livery.tailStyle === "globe") {
      ctx.fillStyle = `#${livery.navy.toString(16).padStart(6, "0")}`; ctx.beginPath(); ctx.arc(520, 500, 330, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = accent; ctx.lineWidth = 34; for (const scale of [0.45, 0.72, 1]) { ctx.beginPath(); ctx.ellipse(520, 500, 330 * scale, 330, 0, 0, Math.PI * 2); ctx.stroke(); }
      ctx.strokeStyle = red; ctx.lineWidth = 24; ctx.beginPath(); ctx.arc(520, 500, 330, -.3, 1.3); ctx.stroke();
    } else if (livery.tailStyle === "bands") {
      ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(110, 90); ctx.lineTo(830, 820); ctx.lineTo(760, 900); ctx.lineTo(45, 180); ctx.closePath(); ctx.fill();
      ctx.fillStyle = accent; ctx.beginPath(); ctx.moveTo(260, 45); ctx.lineTo(920, 670); ctx.lineTo(860, 750); ctx.lineTo(190, 120); ctx.closePath(); ctx.fill();
      ctx.fillStyle = `#${livery.navy.toString(16).padStart(6, "0")}`; ctx.beginPath(); ctx.moveTo(430, 30); ctx.lineTo(950, 470); ctx.lineTo(900, 560); ctx.lineTo(365, 80); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillStyle = `#${livery.navy.toString(16).padStart(6, "0")}`; ctx.beginPath(); ctx.arc(530, 500, 350, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(430, 400, 230, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = red; ctx.beginPath(); ctx.arc(590, 580, 210, 0, Math.PI * 2); ctx.fill();
    }
  }, 1024, 1024);
  // Uploaded airline marks are preferred when present; the small procedural
  // marks above remain a deterministic fallback while a local PNG is loading.
  const uploadedLogo = new THREE.TextureLoader().load(livery.logoAsset);
  uploadedLogo.colorSpace = THREE.SRGBColorSpace;
  uploadedLogo.anisotropy = 4;
  textures.push(uploadedLogo);
  const wordmark = uploadedLogo ?? fallbackWordmark;
  function decal(parent: THREE.Object3D, map: THREE.Texture, size: number[], position: number[], side = 1) {
    const mat = material(palette.white, 0, 0.7); mat.map = map; mat.transparent = true;
    mat.depthWrite = false; mat.polygonOffset = true; mat.polygonOffsetFactor = -2;
    const object = mesh(parent, new THREE.PlaneGeometry(size[0], size[1]), mat, position);
    object.rotation.y = side > 0 ? 0 : Math.PI; object.castShadow = false; return object;
  }

  const bodyProfile = [[-18.785, 0.06], [-17.7, 0.24], [-16, 0.73], [-14.2, 1.3], [-12.4, 1.82],
    [-10.9, 1.975], [11.5, 1.975], [12.8, 1.88], [14.1, 1.78], [15.5, 1.50], [16.8, 1.10], [17.8, 0.75], [18.3, 0.48], [18.65, 0.24], [18.785, 0.03]];
  function radiusAt(x: number) {
    const i = bodyProfile.findIndex(p => p[0] >= x);
    if (i <= 0) return bodyProfile[0][1];
    const a = bodyProfile[i - 1], b = bodyProfile[i];
    return THREE.MathUtils.lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0]));
  }
  function skin(from: number, to: number, thetaFrom: number, thetaTo: number, inflation = 0) {
    const positions: number[] = [], indices: number[] = [];
    const stations = [from, ...bodyProfile.map(p => p[0]).filter(x => x > from && x < to), to];
    const segments = 64;
    stations.forEach((x, i) => {
      const r = radiusAt(x) + inflation;
      for (let j = 0; j <= segments; j++) {
        const theta = THREE.MathUtils.lerp(thetaFrom, thetaTo, j / segments);
        positions.push(x, r * Math.cos(theta), r * Math.sin(theta));
        if (i < stations.length - 1 && j < segments) {
          const a = i * (segments + 1) + j, b = a + segments + 1;
          indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    });
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
  }
  const upper = assembly("upper-shell", "01 / Fuselage crown", "Primary structure", [0, 7.2, 0], [1, 1.9, 0], true);
  mesh(upper, skin(-12.4, 13, -Math.PI / 2, Math.PI / 2), material(palette.white));
  const belly = assembly("lower-shell", "02 / Lower fuselage", "Primary structure", [0, -2.2, 0], [-3, -1.8, 0]);
  mesh(belly, skin(-12.4, 13, Math.PI / 2, Math.PI * 1.5), material(palette.navy));
  // Thin painted boundary follows the fuselage itself; it is not an external image.
  [-1, 1].forEach(side => {
    mesh(upper, skin(-12.4, 13, side * (Math.PI / 2 - 0.018), side * Math.PI / 2, 0.008), material(palette.red));
    const glass = material(0x162c46, 0.45, 0.19);
    for (let i = 0; i < 37; i++) {
      const x = 11.7 - i * 0.60;
      const window = mesh(upper, new THREE.SphereGeometry(1, 12, 10), glass, [x, 0.59, side * 1.883]);
      window.scale.set(0.175, 0.265, 0.041); window.rotation.x = side * -0.3;
    }
    for (const x of [12.1, -10.9]) {
      const door = box(upper, [0.72, 1.45, 0.045], [x, 0.72, side * 1.80], material(0xe6ebef));
      door.rotation.x = side * -0.3;
      box(door, [0.19, 0.05, 0.025], [0.2, -0.12, side * 0.032], material(palette.silver));
    }
    // Text planes sit tangential to the upper fuselage; opposite sides read normally.
    const sideSize: Record<AirlineVariant, [number, number]> = { delta: [5.9, 1.475], american: [5.5, 1.55], united: [3.5, 1.55], alaska: [2.25, 1.7] };
    const mark = decal(upper, wordmark, sideSize[airline], [7.2, 1.22, side * 1.62], side);
    mark.rotation.x = side * -0.63;
    for (const x of [0.9, -0.5]) {
      const exit = box(upper, [0.50, 0.8, 0.026], [x, 0.57, side * 1.90], material(0xdbe1e7));
      exit.rotation.x = side * -0.25;
    }
  });
  const nose = assembly("nose", "03 / Flight deck & radome", "Avionics", [5, 1.6, 0], [15.8, 0.8, 0], true);
  mesh(nose, skin(13, 18.785, -Math.PI / 2, Math.PI / 2), material(palette.white));
  mesh(nose, skin(13, 18.785, Math.PI / 2, Math.PI * 1.5), material(palette.navy));
  // Six shaped glazing panels mapped to the nose surface. Subdivision keeps
  // the pane and its layered seal above the curved skin without floating boxes.
  const glazing = new THREE.MeshPhysicalMaterial({ color: 0x173748,
    metalness: .32, roughness: .12, clearcoat: 1, clearcoatRoughness: .06,
    side: THREE.DoubleSide });
  const seal = material(0x101923, .1, .64);
  const frame = material(0x9baab6, .65, .28);
  const glint = material(0x82afc1, .45, .18);
  const panes = [
    [[16.85, .16], [15.72, .38], [15.65, .98], [16.68, .84]],
    [[15.57, .40], [14.56, .65], [14.48, 1.17], [15.51, 1.02]],
    [[14.43, .67], [13.70, .82], [13.66, 1.18], [14.35, 1.19]],
  ];
  function glazingPoint(x: number, angle: number, side: number, lift: number) {
    const radius = radiusAt(x) + lift;
    return [x, radius * Math.cos(angle), side * radius * Math.sin(angle)];
  }
  for (const side of [-1, 1]) {
    panes.forEach((corners, paneIndex) => {
      const vertices: number[] = [], indices: number[] = [];
      const divisions = 12;
      for (let row = 0; row <= divisions; row++) {
        const v = row / divisions;
        const left = corners[0].map((n, i) => THREE.MathUtils.lerp(n, corners[3][i], v));
        const right = corners[1].map((n, i) => THREE.MathUtils.lerp(n, corners[2][i], v));
        for (let col = 0; col <= divisions; col++) {
          const u = col / divisions;
          vertices.push(...glazingPoint(THREE.MathUtils.lerp(left[0], right[0], u),
            THREE.MathUtils.lerp(left[1], right[1], u), side, .028));
          if (row < divisions && col < divisions) {
            const n = row * (divisions + 1) + col;
            indices.push(n, n + 1, n + divisions + 1, n + 1, n + divisions + 2, n + divisions + 1);
          }
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setIndex(indices); geometry.computeVertexNormals();
      const pane = mesh(nose, geometry, glazing);
      pane.name = `${side > 0 ? "Port" : "Starboard"} cockpit pane ${paneIndex + 1}`;
      for (let edge = 0; edge < 4; edge++) {
        const a = corners[edge], b = corners[(edge + 1) % 4];
        const path = Array.from({ length: 13 }, (_, i) => glazingPoint(
          THREE.MathUtils.lerp(a[0], b[0], i / 12), THREE.MathUtils.lerp(a[1], b[1], i / 12), side, .036));
        tube(nose, path, .035, seal);
        tube(nose, path.map(p => [p[0], p[1] + .013, p[2] + side * .009]), .012, frame);
      }
      // A narrow reflected sky streak gives glazing a readable specular edge.
      const a = corners[0], b = corners[1];
      tube(nose, Array.from({ length: 10 }, (_, i) => glazingPoint(
        THREE.MathUtils.lerp(a[0], b[0], .13 + i * .075),
        THREE.MathUtils.lerp(a[1], b[1], .13 + i * .075) + .065, side, .039)), .009, glint);
    });
    const arm = [[16.25, 1.05], [16.48, .84], [16.04, .67]].map(([x, angle]) => glazingPoint(x, angle, side, .09));
    tube(nose, arm, .021, seal);
    tube(nose, [[15.91, .52], [16.04, .67], [16.17, .82]].map(([x, angle]) => glazingPoint(x, angle, side, .10)), .026, seal);
  }
  const aft = assembly("tail-cone", "04 / Aft fuselage & APU", "Primary structure", [-4.5, 0.3, 0], [-16, 0, 0]);
  mesh(aft, skin(-18.785, -12.4, -Math.PI / 2, Math.PI / 2), material(palette.white));
  mesh(aft, skin(-18.785, -12.4, Math.PI / 2, Math.PI * 1.5), material(palette.navy));
  cylinderX(aft, .18, .12, .7, [-18.2, -.07, 0], material(palette.dark));

  const ribs = assembly("airframe", "05 / Frames & floor beams", "Primary structure", [0, .2, 0], [-5, 1.7, 0]);
  const ribMaterial = material(0x8da5b9, .55);
  for (let x = -10.4; x < 12; x += 1.25) ringX(ribs, 1.89, .042, [x, 0, 0], ribMaterial);
  for (const z of [-1.65, 1.65]) box(ribs, [23.8, .075, .075], [.4, .35, z], ribMaterial);

  const cabin = assembly("cabin", "06 / Passenger cabin", "Cabin systems", [0, 3.0, 0], [-2, .8, 0], true);
  box(cabin, [23.0, .13, 3.50], [.65, -.43, 0], material(0x737b8a));
  box(cabin, [22.8, .014, .60], [.65, -.35, 0], material(0xaab4c1));
  const seatBlue = material(0x233d61), headrest = material(0xbfd0db);
  // Repeated seats establish a readable single aisle, not an airline seat-map claim.
  const seatBase = new THREE.BoxGeometry(.53, .16, .44);
  const seatBack = new THREE.BoxGeometry(.14, .75, .44);
  const bases = new THREE.InstancedMesh(seatBase, seatBlue, 156);
  const backs = new THREE.InstancedMesh(seatBack, seatBlue, 156);
  const rests = new THREE.InstancedMesh(new THREE.BoxGeometry(.15, .14, .37), headrest, 156);
  const seatTransform = new THREE.Object3D();
  let seatIndex = 0;
  [bases, backs, rests].forEach(seats => { seats.castShadow = true; seats.receiveShadow = true; cabin.add(seats); });
  for (let row = 0; row < 26; row++) {
    const x = 10.7 - row * .81;
    for (const z of [-1.37, -.86, -.35, .35, .86, 1.37]) {
      const seatZ = z < 0 ? z - .07 : z + .07;
      seatTransform.rotation.z = 0; seatTransform.position.set(x, -.01, seatZ); seatTransform.updateMatrix();
      bases.setMatrixAt(seatIndex, seatTransform.matrix);
      seatTransform.rotation.z = -.11; seatTransform.position.set(x - .24, .40, seatZ); seatTransform.updateMatrix();
      backs.setMatrixAt(seatIndex, seatTransform.matrix);
      seatTransform.rotation.z = 0; seatTransform.position.set(x - .28, .70, seatZ); seatTransform.updateMatrix();
      rests.setMatrixAt(seatIndex++, seatTransform.matrix);
    }
  }
  [bases, backs, rests].forEach(seats => { seats.instanceMatrix.needsUpdate = true; seats.computeBoundingBox(); seats.computeBoundingSphere(); });
  [-10.2, 12].forEach(x => {
    box(cabin, [.72, 1.5, 1.0], [x, .36, -1.13], material(0xd7e0e7));
    box(cabin, [.72, 1.5, .85], [x, .36, 1.19], material(0xd7e0e7));
  });

  // A spanwise loft gives the wing a swept planform and a rounded airfoil section.
  function wingGeometry(side: number) {
    const stations = [
      [1.50, 3.10, -4.55, -.65, .66], [5.6, .66, -4.65, -.43, .49],
      [10.8, -2.40, -5.73, -.09, .28], [17.05, -5.80, -7.24, .38, .105],
    ];
    const vertices: number[] = [], indices: number[] = [], segments = 32;
    stations.forEach(([z, front, rear, y, thickness], row) => {
      for (let j = 0; j <= segments; j++) {
        const angle = j / segments * Math.PI * 2;
        const t = (1 - Math.cos(angle)) / 2;
        vertices.push(THREE.MathUtils.lerp(front, rear, t), y + Math.sin(angle) * thickness * (.72 - .35 * t), side * z);
        if (row < stations.length - 1 && j < segments) {
          const a = row * (segments + 1) + j, b = a + segments + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    });
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices); geo.computeVertexNormals(); return geo;
  }
  for (const side of [-1, 1]) {
    const sideName = side > 0 ? "Port" : "Starboard", suffix = side > 0 ? "port" : "starboard";
    const wing = assembly(`wing-${suffix}`, `${sideName} wing`, "Primary structure", [-.6, .4, side * 5.2], [-2.4, .4, side * 10], side > 0);
    mesh(wing, wingGeometry(side), material(palette.wing, .4));
    tube(wing, [[3.1,-.61,side*1.6], [.66,-.41,side*5.6], [-2.4,-.08,side*10.8], [-5.8,.38,side*17.05]], .055, material(palette.silver, .75));
    // Original fence-shaped wingtips for the classic A320-200 outline.
    const fence = panel(wing, [[-5.8,.37],[-6.61,1.26],[-7.26,.58],[-7.24,-.37]], .055, material(palette.navy), "z");
    fence.position.z = side * 17.02;
    const nav = mesh(wing, new THREE.SphereGeometry(.075, 8, 8), material(side > 0 ? palette.red : 0x3ce3a0), [-6.4,.55,side*17.06]); nav.castShadow = false;
    // Visible flap track fairings and slat seams keep each wing from reading as a flat slab.
    [5.1, 7.7, 10.1].forEach((z, i) => {
      const fairing = mesh(wing, new THREE.SphereGeometry(1, 12, 8), material(palette.white), [-4.9-i*.31,-.6+i*.10,side*z]);
      fairing.scale.set(1.05,.18,.18);
    });
    const flaps = assembly(`controls-${suffix}`, `${sideName} flaps & aileron`, "Flight controls", [-2.2, .8, side*5.6], [-5.8,.15,side*9.5]);
    const flap = panel(flaps, [[-3.25,side*2.2],[-5.75,side*12.0],[-6.48,side*12.0],[-4.6,side*2.2]], .10, material(0xa0b1c5));
    flap.position.y = -.24;
    const aileron = panel(flaps, [[-5.45,side*12.2],[-6.92,side*16.8],[-7.25,side*16.8],[-6.13,side*12.2]], .065, material(0xa0b1c5));
    aileron.position.y = .16;

    const fuel = assembly(`fuel-${suffix}`, `${sideName} wing fuel volume`, "Fuel system", [-.4, 2.3, side*5.2], [-1,1,side*5]);
    const tankMat = material(palette.gold, .1); tankMat.transparent = true; tankMat.opacity = .72;
    const tank = panel(fuel, [[1,side*2.1],[-3.5,side*11.2],[-4.8,side*11.2],[-2.5,side*2.1]], .31, tankMat);
    tank.position.y = -.17;
    internalContext.push(tank);

    const engineX = 2.9, engineY = -1.65, engineZ = side*5.4;
    const engine = assembly(`engine-${suffix}`, `${sideName} engine nacelle`, "Propulsion", [1.6,-3.6,side*4.9], [engineX,engineY,engineZ], side > 0);
    const pylon = panel(engine, [[.8,-.30],[3.6,-.63],[4.0,-1.6],[.9,-1.6]], .26, material(palette.wing), "z");
    pylon.position.z = engineZ - .13;
    // Revolved closed profile creates a hollow inlet, lip, outer cowl and exhaust.
    const nacelleProfile = [[.78,2.00],[.91,2.07],[1.03,1.85],[1.10,1.20],[1.02,-.8],[.78,-1.75],[.56,-1.90],
      [.51,-1.70],[.69,-.8],[.72,1.25],[.78,2.00]].map(([r,x]) => new THREE.Vector2(r,x));
    const nacelle = mesh(engine, new THREE.LatheGeometry(nacelleProfile, 64), material(palette.navy,.3,.32), [engineX,engineY,engineZ]);
    nacelle.rotation.z = -Math.PI/2;
    ringX(engine,.85,.095,[engineX+2.02,engineY,engineZ],material(0xc0ccd6,.8,.23));
    ringX(engine,.59,.055,[engineX-1.83,engineY,engineZ],material(palette.silver,.8,.3));
    const fan = assembly(`fan-${suffix}`, `${sideName} fan & spinner`, "Propulsion", [5.2,-3.6,side*4.9], [engineX+1.8,engineY,engineZ]);
    cylinderX(fan,.73,.73,.12,[engineX+1.68,engineY,engineZ],material(palette.dark));
    const bladeMat = material(0x8ca4bc,.85,.28);
    for(let blade=0;blade<24;blade++) {
      const angle=blade/24*Math.PI*2;
      const group=new THREE.Group(); group.position.set(engineX+1.79,engineY,engineZ); group.rotation.x=angle; fan.add(group);
      const vane=box(group,[.075,.49,.12],[0,.46,0],bladeMat); vane.rotation.y=.45; vane.rotation.x=.17;
    }
    cylinderX(fan,.04,.23,.45,[engineX+1.95,engineY,engineZ],material(0xc1cad4,.75,.22));
    const core=assembly(`core-${suffix}`, `${sideName} engine core`, "Propulsion", [-1.0,-3.6,side*4.9], [engineX-.7,engineY,engineZ]);
    cylinderX(core,.47,.34,2.8,[engineX-.4,engineY,engineZ],material(0x586778,.8));
    for(let i=0;i<7;i++) ringX(core,.45-i*.01,.035,[engineX+.65-i*.31,engineY,engineZ],material(palette.silver,.85));
    cylinderX(core,.34,.11,.9,[engineX-2.1,engineY,engineZ],material(palette.dark,.8));
  }

  const tail = assembly("empennage", "07 / Tail & stabilizers", "Primary structure", [-4.5,4.1,0], [-15.5,6.2,0], true);
  const fin=panel(tail,[[-12.2,1.4],[-15.4,7.9],[-17.7,7.9],[-17.0,1.2]],.20,material(palette.navy),"z"); fin.position.z=-.10;
  [-1,1].forEach(side=> {
    // Hand-drawn triangular tail motif, on both faces of the original mesh.
    const tailSize: Record<AirlineVariant, [number, number]> = { delta: [2.35, 2.35], american: [2.1, 1.7], united: [1.9, 1.9], alaska: [2.45, 2.45] };
    decal(tail, wordmark, tailSize[airline], [-15.85, 4.65, side * .115], side);
    const stabilizer=panel(tail,[[-12.1,side*.7],[-16.7,side*6.22],[-18.1,side*6.22],[-16.25,side*.7]],.14,material(palette.wing));
    stabilizer.position.y=1.24;
  });
  const rudder=assembly("rudder","08 / Rudder & elevators","Flight controls",[-6.2,4.1,0],[-17.7,5,0]);
  const rudderFin=panel(rudder,[[-17.2,1.4],[-17.8,7.85],[-18.3,7.85],[-18.1,1.4]],.13,material(0x263f61),"z");rudderFin.position.z=-.065;
  [-1, 1].forEach(side => {
    const elevator = panel(rudder, [[-15.65,side*.9],[-17.60,side*6.1],[-18.15,side*6.1],[-16.30,side*.9]], .07, material(0x9fafc2));
    elevator.position.y = 1.31;
  });

  function landingGear(id: string, label: string, x: number, z: number, isNose = false) {
    const group=assembly(id,label,isNose?"Landing gear":"Main landing gear assembly",[isNose?3:0,-4.3,z*.9],[x,-2.7,z],isNose);
    const silver=material(0xbac5ce,.8,.25), tire=material(0x18202a,.05,.87);
    const strut=mesh(group,new THREE.CylinderGeometry(.10,.13,1.6,12),silver,[x,-2.3,z]);strut.rotation.z=isNose?-.09:.09;
    tube(group,[[x-.68,-1.1,z],[x,-2.75,z]],.067,silver);
    box(group,[isNose?.70:1.3,.10,.56],[x,-1.39,z],material(palette.white));
    const wheelRadius=isNose?.31:.49;
    [-1,1].forEach(side=> {
      const wheel=mesh(group,new THREE.CylinderGeometry(wheelRadius,wheelRadius,.25,24),tire,[x,-3.04,z+side*.23]);wheel.rotation.x=Math.PI/2;
      const hub=mesh(group,new THREE.CylinderGeometry(wheelRadius*.48,wheelRadius*.48,.26,16),silver,[x,-3.04,z+side*.23]);hub.rotation.x=Math.PI/2;
    });
  }
  landingGear("nose-gear","09 / Nose landing gear",13.4,0,true);
  landingGear("main-gear-port","Port main landing gear",-1.2,2.6);
  landingGear("main-gear-starboard","Starboard main landing gear",-1.2,-2.6);

  const avionics=assembly("avionics","10 / Avionics bay","Avionics",[4.0,-2.9,0],[10.6,-1,0]);
  const rack=material(0x587889,.5);
  for(let i=0;i<5;i++) {
    box(avionics,[.55,.48,1.2],[9.1+i*.66,-.8,0],rack);
    for(let light=0;light<3;light++)box(avionics,[.035,.065,.075],[9.39+i*.66,-.72+light*.1,.3],material(0x76dac6));
  }
  const electrical=assembly("electrical","11 / Electrical distribution","Electrical power",[0,-3.9,2.3],[5,-1.2,0]);
  box(electrical,[2.7,.55,1.15],[5,-1.1,0],material(0x627991));
  tube(electrical,[[8,-.8,.5],[5,-1.2,.5],[1,-1.2,.8]],.05,material(palette.gold));
  const hydraulics=assembly("hydraulics","12 / Hydraulic circuits","Hydraulics",[0,-4.6,-2.4],[-1,-1,0]);
  [0x44b7b1,0x5173c0,0xd5af4f].forEach((color,i)=>{
    cylinderX(hydraulics,.20,.20,1.1,[-1,-.94,-.52+i*.52],material(color,.5));
    tube(hydraulics,[[3,-1.1,-.52+i*.52],[-1,-1.1,-.52+i*.52],[-5,-1.05,-.52+i*.52]],.046,material(color));
  });
  const air=assembly("air","13 / Environmental control","Air and environmental",[0,-3.6,0],[-7,-1,0]);
  [-1,1].forEach(side=>{
    box(air,[2.4,.52,.67],[-6.5,-1,side*.6],material(palette.teal,.45));
    tube(air,[[-9,-.8,side*.7],[-7,-1,side*.7],[-5,-.9,side*.7],[-3,-.8,side*1.1]],.13,material(0x78a6b4,.5));
  });
  // Dedicated study groups keep remote equipment attached to its aircraft station.
  assembly("apu", "14 / Auxiliary power unit", "Propulsion", [-6.2, -1.7, 0], [-16.3, 0, 0], true);
  assembly("cockpit-equipment", "15 / Flight-deck equipment", "Avionics", [5, 3.5, 0], [14.4, .5, 0]);
  assembly("cargo-equipment", "16 / Cargo & fire protection", "Cabin systems", [0, -3.2, -3], [-3, -.9, 0]);
  assembly("tail-controls", "17 / Tail control drives", "Flight controls", [-5, 2.1, 2.5], [-14.8, 1, 0]);
  assembly("service-bay", "18 / Ground service connections", "Air and environmental", [2, -3, 3], [7, -1.2, 0]);
  assembly("external-antennas", "19 / Radio antennas", "Avionics", [0, 7.2, 0], [5, 2.2, 0]);
  for (const subsystem of ADDITIONAL_SUBSYSTEMS) {
    assembly(subsystem.id, subsystem.label, subsystem.system, subsystem.offset, subsystem.origin);
  }
  const parts = buildSubsystemParts(assemblies);
  for (const item of assemblies) {
    const materials=new Set<THREE.MeshStandardMaterial>();
    item.group.traverse(object=>{
      if(object instanceof THREE.Mesh) {
        let ancestor: THREE.Object3D | null = object;
        while (ancestor && ancestor !== item.group) {
          if (ancestor.userData.partId) return;
          ancestor = ancestor.parent;
        }
        const list=Array.isArray(object.material)?object.material:[object.material];
        list.forEach(mat=>{ if(mat instanceof THREE.MeshStandardMaterial) materials.add(mat); });
      }
    });
    item.materials=[...materials];
  }
  function dispose() {
    const geometries=new Set<THREE.BufferGeometry>(), materials=new Set<THREE.Material>();
    root.traverse(object=>{
      if(object instanceof THREE.Mesh) {
        if (object instanceof THREE.InstancedMesh) object.dispose();
        geometries.add(object.geometry);
        (Array.isArray(object.material)?object.material:[object.material]).forEach(mat=>materials.add(mat));
      }
    });
    geometries.forEach(geometry=>geometry.dispose()); materials.forEach(mat=>mat.dispose()); textures.forEach(texture=>texture.dispose());
  }
  // Bay equipment uses spaced educational layouts, so some detailed meshes are
  // larger than the real skin cavity. Treat these as interior cutaway content:
  // they are exposed for exploded studies, never drawn through the closed skin.
  const exteriorPartAssemblies = new Set(["nose-gear", "main-gear-port", "main-gear-starboard", "external-antennas"]);
  function setInteriorVisible(visible: boolean, showContext = true) {
    for (const part of parts) {
      part.group.visible = visible || exteriorPartAssemblies.has(part.definition.assemblyId);
    }
    internalContext.forEach(object => { object.visible = visible && showContext; });
  }
  return { root, assemblies, parts, setInteriorVisible, dispose };
}
