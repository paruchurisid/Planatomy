import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { AircraftAssembly } from "./deltaA320";
import { SUBSYSTEM_PARTS, type SubsystemPartDefinition } from "./subsystemParts";

export type AircraftPart = {
  definition: SubsystemPartDefinition;
  group: THREE.Group;
  basePosition: THREE.Vector3;
  materials: THREE.MeshStandardMaterial[];
};

type XYZ = [number, number, number];
const REPLACE_ASSEMBLIES = new Set([
  "core-port", "core-starboard", "avionics", "electrical", "hydraulics", "air",
  "nose-gear", "main-gear-port", "main-gear-starboard",
]);

function compactPartMeshes(group: THREE.Group) {
  const byMaterial = new Map<THREE.Material, THREE.Mesh[]>();
  for (const object of group.children) {
    if (!(object instanceof THREE.Mesh) || Array.isArray(object.material)) continue;
    const list = byMaterial.get(object.material) ?? [];
    list.push(object); byMaterial.set(object.material, list);
  }
  for (const [material, objects] of byMaterial) {
    if (objects.length < 2) continue;
    const transformed = objects.map(object => {
      object.updateMatrix(); return object.geometry.clone().applyMatrix4(object.matrix);
    });
    const geometry = mergeGeometries(transformed);
    transformed.forEach(candidate => candidate.dispose());
    if (!geometry) continue;
    const combined = new THREE.Mesh(geometry, material);
    combined.castShadow = true; combined.receiveShadow = true;
    objects.forEach(object => { group.remove(object); object.geometry.dispose(); });
    group.add(combined);
  }
}

// The former solid placeholders would hide the detailed parts. Resource references
// in retained assemblies are checked before disposing anything removed here.
function replacePlaceholderGeometry(assemblies: AircraftAssembly[]) {
  const keptGeometry = new Set<THREE.BufferGeometry>(), keptMaterials = new Set<THREE.Material>();
  const removedGeometry = new Set<THREE.BufferGeometry>(), removedMaterials = new Set<THREE.Material>();
  for (const assembly of assemblies) {
    const removing = REPLACE_ASSEMBLIES.has(assembly.id);
    assembly.group.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      (removing ? removedGeometry : keptGeometry).add(object.geometry);
      const target = removing ? removedMaterials : keptMaterials;
      (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => target.add(material));
      if (removing && object instanceof THREE.InstancedMesh) object.dispose();
    });
    if (removing) assembly.group.clear();
  }
  removedGeometry.forEach(geometry => { if (!keptGeometry.has(geometry)) geometry.dispose(); });
  removedMaterials.forEach(material => { if (!keptMaterials.has(material)) material.dispose(); });
}

export function buildSubsystemParts(assemblies: AircraftAssembly[]): AircraftPart[] {
  // Validate before changing an existing scene: a missing parent must not silently
  // leave an atlas entry pointing at absent geometry.
  const parents = new Map(assemblies.map(assembly => [assembly.id, assembly]));
  for (const definition of SUBSYSTEM_PARTS) {
    const parent = parents.get(definition.assemblyId);
    if (!parent) throw new Error(`Missing assembly for ${definition.id}: ${definition.assemblyId}`);
    if (parent.system !== definition.system) throw new Error(`System mismatch for ${definition.id}`);
  }
  replacePlaceholderGeometry(assemblies);
  return SUBSYSTEM_PARTS.map(definition => {
    const group = new THREE.Group();
    group.name = definition.name;
    group.userData.partId = definition.id;
    group.userData.assemblyId = definition.assemblyId;
    const basePosition = new THREE.Vector3(...definition.position);
    group.position.copy(basePosition);
    const materials = new Map<string, THREE.MeshStandardMaterial>();
    let color = 0x427e90;
    if (definition.system === "Propulsion") color = 0x586a80;
    if (definition.system === "Fuel system") color = 0xc99139;
    if (definition.system === "Electrical power") color = 0x5f7393;
    if (definition.system === "Avionics") color = 0x496778;
    if (definition.id.endsWith("-green")) color = 0x339c87;
    if (definition.id.endsWith("-blue")) color = 0x557bb7;
    if (definition.id.endsWith("-yellow")) color = 0xd8b047;

    // Materials belong to a single selectable part so highlighting one unit does
    // not alter its neighbours. They are disposed by the aircraft scene owner.
    function mat(kind: "body" | "metal" | "dark" | "gold" | "light" | "white" = "body") {
      if (materials.has(kind)) return materials.get(kind)!;
      const shades = { body: color, metal: 0xc1cbd3, dark: 0x182837, gold: 0xc79b54, light: 0x7ed9d0, white: 0xe6edf3 };
      const material = new THREE.MeshStandardMaterial({ color: shades[kind],
        metalness: kind === "metal" || kind === "gold" ? .72 : .28,
        roughness: kind === "dark" ? .73 : .4 });
      if (kind === "light") { material.emissive.setHex(0x397f78); material.emissiveIntensity = .30; }
      materials.set(kind, material); return material;
    }
    function mesh(geometry: THREE.BufferGeometry, material: THREE.MeshStandardMaterial, pos: XYZ = [0, 0, 0]) {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(...pos); object.castShadow = true; object.receiveShadow = true;
      group.add(object); return object;
    }
    function box(size: XYZ, pos: XYZ = [0, 0, 0], kind: Parameters<typeof mat>[0] = "body") {
      return mesh(new THREE.BoxGeometry(...size), mat(kind), pos);
    }
    function cylinder(radius: number, length: number, pos: XYZ = [0, 0, 0], kind: Parameters<typeof mat>[0] = "metal", axis: "x" | "y" | "z" = "x", radius2 = radius) {
      const object = mesh(new THREE.CylinderGeometry(radius, radius2, length, 20), mat(kind), pos);
      if (axis === "x") object.rotation.z = -Math.PI / 2;
      if (axis === "z") object.rotation.x = Math.PI / 2;
      return object;
    }
    function ring(radius: number, thickness: number, pos: XYZ = [0, 0, 0], kind: Parameters<typeof mat>[0] = "metal", axis: "x" | "y" | "z" = "x") {
      const object = mesh(new THREE.TorusGeometry(radius, thickness, 7, 24), mat(kind), pos);
      if (axis === "x") object.rotation.y = Math.PI / 2;
      if (axis === "y") object.rotation.x = Math.PI / 2;
      return object;
    }
    function rod(from: XYZ, to: XYZ, radius = .025, kind: Parameters<typeof mat>[0] = "metal") {
      const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to), delta = b.clone().sub(a);
      const object = mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 10), mat(kind));
      object.position.copy(a.add(b).multiplyScalar(.5));
      object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()); return object;
    }
    function port(pos: XYZ, axis: "x" | "y" | "z" = "x", radius = .055) {
      cylinder(radius, .10, pos, "gold", axis);
    }
    function feet(width = .55, depth = .42) {
      [-1, 1].forEach(side => box([.12, .055, depth + .10], [side * width / 2, -.24, 0], "metal"));
    }
    function actuator(length = .68, radius = .10) {
      cylinder(radius, length * .62, [-length * .12, 0, 0], "body");
      cylinder(radius * .45, length * .65, [length * .24, 0, 0]);
      ring(radius * .76, .023, [-length * .46, 0, 0], "metal", "z");
      ring(radius * .65, .021, [length * .58, 0, 0], "metal", "z");
      port([-.15, radius + .035, 0], "y", .032); port([.05, radius + .035, 0], "y", .032);
      box([.21, .10, .12], [-.12, radius + .06, .08], "dark");
    }
    function pump() {
      cylinder(.16, .40, [-.10, 0, 0], "body");
      for (let i = 0; i < 5; i++) ring(.165, .012, [-.25 + i * .072, 0, 0]);
      cylinder(.19, .17, [.19, 0, 0], "metal");
      box([.20, .12, .18], [-.10, .18, 0], "dark");
      port([.22, .23, 0], "y"); port([.36, 0, 0]); feet(.42, .24);
    }
    function vessel(radius = .18, length = .67) {
      cylinder(radius, length, [0, 0, 0], "body");
      [-1, 1].forEach(side => {
        cylinder(radius * .84, .10, [side * length / 2, 0, 0], "metal");
        ring(radius + .005, .021, [side * length * .28, 0, 0]);
      });
      port([length / 2 + .1, 0, 0]); port([0, radius + .06, 0], "y", .04);
      box([length * .55, .028, .075], [0, 0, radius + .008], "light");
    }
    function valve() {
      cylinder(.095, .51, [0, -.07, 0], "metal");
      cylinder(.15, .12, [-.25, -.07, 0], "gold"); cylinder(.15, .12, [.25, -.07, 0], "gold");
      box([.26, .22, .25], [0, .08, 0]); cylinder(.035, .15, [0, .26, 0], "metal", "y");
      box([.28, .03, .045], [.065, .34, 0], "dark");
      port([0, .11, .17], "z", .04);
    }
    function radiator(width = .74) {
      box([width, .34, .34], [0, 0, 0], "dark");
      for (let i = 0; i < 10; i++) box([.024, .43, .46], [-width / 2 + i * width / 9, 0, 0], "metal");
      [-1, 1].forEach(side => {
        box([.08, .43, .49], [side * (width / 2 + .04), 0, 0]);
        port([side * (width / 2 + .14), .08 * side, 0]);
      });
      feet(width, .45);
    }
    function blower(radius = .22) {
      cylinder(radius, .22, [0, 0, 0], "dark");
      ring(radius, .035, [.13, 0, 0]); ring(radius, .035, [-.13, 0, 0]);
      cylinder(radius * .24, .30, [0, 0, 0]);
      for (let i = 0; i < 10; i++) {
        const angle = i * Math.PI / 5;
        const vane = box([.035, radius * .64, .046], [.145, Math.cos(angle) * radius * .60, Math.sin(angle) * radius * .60]);
        vane.rotation.x = angle; vane.rotation.y = .30;
      }
      box([.18, .16, .19], [0, -.21, 0]); port([-.22, 0, 0]);
    }
    function electronics(w = .69, h = .46, d = .52) {
      box([w, h, d]);
      box([.025, h * .91, d * .94], [w / 2 + .02, 0, 0], "metal");
      for (let i = 0; i < 6; i++) box([w * .66, .012, .016], [-.04, -.12 + i * .047, d / 2 + .008], "dark");
      const faceX = w / 2 + .06;
      rod([faceX, -.13, -.12], [faceX + .06, -.13, -.12], .016);
      rod([faceX + .06, -.13, -.12], [faceX + .06, .13, -.12], .016);
      rod([faceX + .06, .13, -.12], [faceX, .13, -.12], .016);
      for (const y of [-.1, .08]) cylinder(.05, .05, [faceX, y, .12], "dark");
      box([.024, .035, .035], [faceX, .15, .12], "light"); feet(w, d);
    }
    function gearbox() {
      box([.49, .31, .35]);
      for (let i = 0; i < 5; i++) box([.035, .35, .39], [-.19 + i * .095, 0, 0], "metal");
      cylinder(.11, .11, [.10, 0, .23], "dark", "z");
      cylinder(.09, .17, [-.31, 0, 0], "metal"); cylinder(.065, .16, [.30, 0, 0], "gold");
      feet(.36, .33);
    }
    function rotor(stages: number, radius: number, length: number) {
      cylinder(radius * .34, length + .16, [0, 0, 0], "dark");
      for (let stage = 0; stage < stages; stage++) {
        const x = (stage / Math.max(stages - 1, 1) - .5) * length;
        cylinder(radius * .58, .045, [x, 0, 0]);
        ring(radius, .022, [x, 0, 0], stage % 2 ? "gold" : "metal");
        for (let i = 0; i < 12; i++) {
          const angle = i / 12 * Math.PI * 2;
          const vane = box([.055, radius * .58, .052], [x, Math.cos(angle) * radius * .68, Math.sin(angle) * radius * .68], "metal");
          vane.rotation.x = angle; vane.rotation.y = .32;
        }
      }
    }
    function wheel(radius: number) {
      ring(radius * .755, radius * .245, [0, 0, 0], "dark", "z");
      cylinder(radius * .52, .25, [0, 0, 0], "metal", "z");
      cylinder(radius * .27, .30, [0, 0, 0], "body", "z");
      for (let i = 0; i < 6; i++) {
        const angle = i / 6 * Math.PI * 2;
        cylinder(.023, .275, [Math.cos(angle) * radius * .37, Math.sin(angle) * radius * .37, 0], "gold", "z");
      }
      cylinder(.055, .39, [0, 0, 0], "metal", "z");
    }
    function strut(nose: boolean) {
      cylinder(nose ? .095 : .135, .83, [0, .36, 0], "body", "y");
      cylinder(nose ? .065 : .086, .83, [0, -.39, 0], "metal", "y");
      ring(nose ? .103 : .143, .025, [0, -.055, 0], "gold", "y");
      cylinder(.09, nose ? .70 : .80, [0, -.8, 0], "metal", "z");
      rod([-.65, .97, 0], [0, -.48, 0], nose ? .043 : .058);
      rod([0, -.02, .13], [.21, -.27, .13], .031);
      rod([.21, -.27, .13], [0, -.51, .13], .031);
      cylinder(.13, .38, [0, .82, 0], "metal", "z");
      box([nose ? .52 : .78, .09, .46], [0, .87, 0], "white");
    }

    const id = definition.id;
    if (definition.geometry) {
      switch (definition.geometry) {
        case "ram-turbine":
          cylinder(.105, .38, [0, 0, 0], "body");
          cylinder(.03, .18, [.27, 0, 0], "metal", "x", .10);
          for (const side of [-1, 1]) {
            const blade = box([.055, .48, .12], [.08, side * .29, 0], "metal");
            blade.rotation.y = side * .24;
          }
          rod([-.1, -.05, 0], [-.25, -.57, 0], .055);
          cylinder(.10, .23, [-.25, -.58, 0], "body", "z");
          box([.3, .07, .33], [-.25, -.69, 0], "metal");
          break;
        case "latch":
          box([.48, .065, .35], [0, -.15, 0], "metal");
          cylinder(.055, .39, [-.12, 0, 0], "gold", "z");
          box([.32, .075, .09], [.02, .02, 0], "body");
          box([.065, .21, .09], [.15, .08, 0], "body");
          box([.19, .06, .09], [.08, .17, 0], "body");
          cylinder(.035, .32, [.025, .105, 0], "metal", "z");
          for (const x of [-.18, .18]) for (const z of [-.12, .12]) cylinder(.019, .09, [x, -.12, z], "gold", "y");
          break;
        case "manifold":
          box([.64, .18, .24], [0, 0, 0], "metal");
          for (const x of [-.23, 0, .23]) {
            cylinder(.052, .14, [x, .15, 0], "gold", "y");
            ring(.054, .012, [x, .225, 0], "dark", "y");
          }
          port([-.38, 0, 0]); port([.38, 0, 0]);
          feet(.46, .22);
          break;
        case "probe":
          box([.3, .045, .24], [-.15, -.16, 0], "metal");
          rod([-.15, -.13, 0], [0, .07, 0], .045);
          cylinder(.035, .48, [.18, .07, 0], "metal");
          ring(.035, .009, [.425, .07, 0], "dark");
          for (const z of [-.08, .08]) cylinder(.014, .035, [-.23, -.125, z], "gold", "y");
          port([-.15, -.22, 0], "y", .025);
          break;
        case "slide-pack":
          box([.68, .39, .46], [0, 0, 0], "white");
          box([.63, .025, .41], [0, .21, 0], "body");
          for (const x of [-.21, .21]) {
            box([.055, .43, .49], [x, 0, 0], "dark");
            box([.08, .10, .025], [x, 0, .26], "gold");
          }
          box([.2, .13, .012], [0, .02, .239], "body");
          rod([-.08, .26, 0], [.08, .26, 0], .018);
          break;
        case "seat":
          box([.55, .10, .48], [0, 0, 0], "dark");
          box([.10, .62, .48], [-.25, .30, 0], "body");
          box([.13, .20, .30], [-.25, .71, 0], "dark");
          for (const z of [-.29, .29]) {
            rod([-.22, -.32, z], [.24, -.32, z], .035);
            rod([-.16, -.3, z], [-.16, -.04, z], .03);
            box([.43, .055, .07], [0, .22, z], "dark");
            rod([-.15, 0, z], [-.15, .22, z], .02);
          }
          for (const z of [-.1, .1]) box([.015, .46, .035], [-.188, .3, z], "gold");
          break;
        case "console":
          box([.7, .18, .45], [0, 0, 0], "dark");
          box([.65, .02, .40], [0, .105, 0], "body");
          for (let i = 0; i < 5; i++) for (const z of [-.13, 0, .13]) {
            cylinder(.018, .045, [-.25 + i * .125, .14, z], "metal", "y");
            box([.035, .008, .015], [-.25 + i * .125, .119, z + .04], "light");
          }
          break;
        case "antenna":
          box([.42, .035, .17], [0, -.08, 0], "metal");
          mesh(new THREE.ConeGeometry(.11, .48, 4), mat("white"), [0, .16, 0]);
          port([0, -.15, 0], "y", .025);
          break;
        case "hatch":
          box([.72, .065, .57], [0, 0, 0], "white");
          box([.66, .075, .51], [0, -.015, 0], "metal");
          box([.19, .024, .07], [.1, .05, 0], "dark");
          for (const x of [-.3, .3]) for (const z of [-.22, .22]) cylinder(.016, .02, [x, .045, z], "dark", "y");
          for (const z of [-.18, .18]) cylinder(.03, .13, [-.37, 0, z], "gold", "z");
          break;
        case "turbomachine":
          rotor(3, .24, .45);
          cylinder(.18, .35, [-.45, 0, 0], "body");
          ring(.25, .035, [.27, 0, 0]);
          port([-.45, .22, 0], "y", .07); feet(.65, .38);
          break;
        case "harness":
          for (let i = 0; i < 5; i++) {
            const z = (i - 2) * .026;
            rod([-.48, 0, z], [.25, 0, z], .012, i % 2 ? "gold" : "dark");
            rod([.25, 0, z], [.45, .19, z], .012, i % 2 ? "gold" : "dark");
          }
          for (const x of [-.3, 0, .23]) box([.035, .055, .16], [x, 0, 0], "metal");
          box([.1, .09, .18], [-.48, 0, 0]); box([.1, .09, .18], [.45, .19, 0]);
          break;
        case "rib":
          box([1.1, .20, .045], [0, 0, 0], "body");
          for (const y of [-.12, .12]) box([1.15, .035, .16], [0, y, 0], "metal");
          for (const x of [-.45, -.15, .15, .45]) {
            box([.035, .2, .09], [x, 0, 0], "metal");
            cylinder(.016, .065, [x, .11, .05], "gold", "z");
          }
          break;
        case "pedals":
          rod([0, -.1, -.28], [0, -.1, .28], .035);
          for (const z of [-.2, .2]) {
            rod([0, -.1, z], [.14, .1, z], .025);
            box([.08, .2, .15], [.14, .14, z], "dark");
            for (const y of [.08, .14, .2]) box([.015, .012, .13], [.19, y, z], "metal");
          }
          break;
        case "pump": pump(); break;
        case "valve": valve(); break;
        case "vessel": vessel(); break;
        case "electronics": electronics(); break;
        case "actuator": actuator(); break;
        case "gearbox": gearbox(); break;
        case "radiator": radiator(); break;
        case "duct":
          rod([-.4, 0, 0], [.2, 0, 0], .12, "body");
          rod([.2, 0, 0], [.2, .35, 0], .12, "body");
          ring(.13, .022, [-.4, 0, 0]); ring(.13, .022, [.2, .35, 0], "metal", "y");
          for (const x of [-.25, -.1, .05]) ring(.125, .015, [x, 0, 0]);
          break;
        case "sensor":
          cylinder(.075, .25, [0, 0, 0], "body");
          cylinder(.035, .25, [.22, 0, 0], "metal");
          cylinder(.115, .045, [.09, 0, 0], "gold");
          port([-.18, 0, 0]); box([.2, .055, .22], [0, -.09, 0], "metal");
          break;
        case "display":
          box([.18, .43, .48], [0, 0, 0], "dark");
          box([.02, .34, .39], [-.105, 0, 0], "body");
          box([.022, .15, .35], [-.12, .08, 0], "light");
          box([.024, .13, .35], [-.12, -.07, 0], "gold");
          box([.027, .008, .29], [-.135, 0, 0], "white");
          for (const z of [-.18, -.06, .06, .18]) cylinder(.018, .025, [-.12, -.19, z], "metal");
          break;
        case "frame":
          box([.045, .19, 3.1], [0, 0, 0]);
          for (const y of [-.11, .11]) box([.18, .035, 3.1], [0, y, 0], "metal");
          for (const z of [-1.35, -.9, -.45, 0, .45, .9, 1.35]) box([.08, .19, .028], [0, 0, z], "metal");
          break;
      }
    }
    else if (id.startsWith("compressor-")) rotor(4, .37, .67);
    else if (id.startsWith("turbine-")) rotor(3, .31, .48);
    else if (id.startsWith("combustor-")) {
      cylinder(.35, .52, [0, 0, 0], "body");
      ring(.36, .03, [-.23, 0, 0], "gold"); ring(.36, .03, [.23, 0, 0], "gold");
      cylinder(.17, .64, [0, 0, 0], "dark");
      for (let i = 0; i < 8; i++) {
        const angle = i / 8 * Math.PI * 2;
        rod([.04, Math.cos(angle) * .35, Math.sin(angle) * .35], [.14, Math.cos(angle) * .44, Math.sin(angle) * .44], .028, "gold");
      }
    } else if (id.startsWith("exhaust-")) {
      cylinder(.28, .68, [0, 0, 0], "metal", "x", .07);
      ring(.29, .035, [.32, 0, 0], "dark");
    } else if (id.includes("gearbox")) gearbox();
    else if (id.startsWith("air-starter-")) { cylinder(.15, .42, [0, 0, 0], "body"); cylinder(.22, .13, [.25, 0, 0]); port([-.27, 0, 0]); port([0, .2, 0], "y"); feet(.40, .26); }
    else if (id.includes("shock-strut")) strut(id.startsWith("nose"));
    else if (id.includes("wheel-")) wheel(id.startsWith("nose") ? .31 : .49);
    else if (id.includes("brake-stack")) {
      for (let i = 0; i < 6; i++) cylinder(.29, .025, [0, 0, -.10 + i * .04], i % 2 ? "metal" : "dark", "z");
      for (const side of [-1, 1]) { box([.10, .38, .30], [side * .28, 0, 0]); cylinder(.055, .10, [side * .25, .19, 0], "gold", "y"); }
      cylinder(.075, .34, [0, 0, 0], "metal", "z");
    } else if (id.includes("actuator") && !id.startsWith("structure-")) actuator(id.includes("aileron") ? .94 : .67);
    else if (id.includes("screwjack")) {
      actuator(.9, .085);
      for (let i = 0; i < 12; i++) ring(.057, .008, [-.12 + i * .049, 0, 0], "gold");
      box([.22, .19, .20], [-.40, 0, 0]); cylinder(.055, .32, [-.4, 0, 0], "metal", "z");
    } else if (id.includes("pump")) pump();
    else if (id.includes("reservoir") || id.includes("oil-tank")) vessel(id.includes("oil") ? .16 : .19, .66);
    else if (id.includes("accumulator")) {
      vessel(.14, .54); cylinder(.095, .13, [-.36, 0, 0], "dark");
      cylinder(.05, .10, [-.44, 0, 0], "gold");
    } else if (id.includes("valve")) valve();
    else if (id.includes("fuel-level")) {
      cylinder(.042, .52, [0, 0, 0], "metal", "y"); cylinder(.105, .055, [0, -.28, 0], "gold", "y");
      cylinder(.068, .13, [0, .27, 0], "body", "y"); port([.10, .31, 0], "x", .033);
    } else if (id.includes("fuel-filter") || id.includes("water-separator")) {
      vessel(id.includes("fuel") ? .13 : .21, id.includes("fuel") ? .46 : .55);
      port([-.08, -.24, 0], "y", .04); box([.19, .04, .35], [0, -.22, 0], "metal");
    } else if (id.includes("battery")) {
      box([.69, .43, .51], [0, 0, 0], "dark"); box([.72, .055, .55], [0, .24, 0]);
      [-1, 1].forEach(side => { box([.055, .48, .55], [side * .23, 0, 0], "metal"); cylinder(.05, .10, [side * .17, .31, 0], side < 0 ? "gold" : "metal", "y"); });
      box([.22, .16, .012], [0, 0, .262], "white"); feet(.53, .46);
    } else if (id.includes("rectifier") || id.includes("inverter") || id.includes("exchanger")) radiator(id.includes("exchanger") ? .71 : .62);
    else if (id.includes("bus-panel")) {
      box([.77, .11, .56], [0, -.13, 0], "dark");
      for (let i = 0; i < 4; i++) {
        box([.12, .22, .24], [-.27 + i * .18, 0, 0]);
        port([-.27 + i * .18, .17, .055], "y", .034);
      }
      box([.67, .045, .075], [0, .18, -.12], "gold"); feet(.64, .48);
    } else if (id.includes("contactor")) {
      cylinder(.14, .29, [0, 0, 0], "body", "y"); box([.43, .065, .32], [0, .19, 0], "dark");
      [-1, 1].forEach(side => cylinder(.04, .14, [side * .14, .27, 0], "gold", "y")); feet(.30, .26);
    } else if (id.includes("cooling-fan") || id.includes("recirculation-fan")) blower();
    else if (id.startsWith("avionics-")) electronics();
    else if (id === "air-cycle-machine") {
      cylinder(.08, .78, [0, 0, 0], "metal");
      for (const side of [-1, 1]) { cylinder(.25, .24, [side * .22, 0, 0], "body"); ring(.25, .027, [side * .33, 0, 0]); port([side * .22, .30, 0], "y", .09); }
      feet(.51, .43);
    } else if (id === "air-mixing-manifold") {
      cylinder(.14, .80, [0, 0, 0], "body");
      for (const x of [-.25, 0, .25]) { cylinder(.078, .28, [x, .15, 0], "metal", "y"); ring(.080, .02, [x, .30, 0], "gold", "y"); }
      port([-.46, 0, 0], "x", .12); port([.46, 0, 0], "x", .12);
    } else if (id === "cabin-oxygen-module") {
      box([.92, .12, .43], [0, .03, 0], "white");
      cylinder(.08, .56, [0, .14, 0], "metal");
      for (const x of [-.28, 0, .28]) {
        cylinder(.043, .11, [x, -.08, 0], "gold", "y");
        cylinder(.04, .08, [x, -.16, 0], "white", "y", .10);
        rod([x, -.18, .04], [x + .08, -.10, .13], .008, "dark");
      }
    } else if (id === "cabin-lighting-module") {
      box([1.18, .09, .23], [0, 0, 0], "white"); box([1.02, .045, .15], [0, -.065, 0], "light");
      [-1, 1].forEach(side => box([.075, .13, .26], [side * .55, 0, 0], "metal"));
    } else if (id === "cabin-galley-heater") {
      electronics(.57, .47, .53); box([.30, .24, .026], [0, 0, -.28], "dark");
      box([.20, .028, .04], [0, .14, -.31], "metal");
    } else if (id === "structure-floor-crossbeam" || id.includes("wing-spar")) {
      const length = id.includes("wing-spar") ? 2.75 : 3.14;
      box([.055, .22, length], [0, 0, 0], "body");
      [-1, 1].forEach(side => box([.22, .035, length], [0, side * .125, 0], "metal"));
      for (let i = -2; i <= 2; i++) box([.08, .22, .035], [0, 0, i * length / 5], "metal");
      if (id.includes("wing-spar")) group.rotation.y = id.endsWith("port") ? -.40 : .40;
    } else if (id === "structure-crown-stringer") {
      box([1.55, .035, .14], [0, 0, 0], "metal");
      [-1, 1].forEach(side => box([1.55, .13, .025], [0, .067, side * .065]));
      for (const x of [-.60, 0, .60]) box([.16, .027, .26], [x, -.025, 0], "metal");
    } else if (id === "structure-tail-actuator-fitting") {
      box([.43, .065, .49], [0, -.14, 0], "metal");
      for (const side of [-1, 1]) { box([.22, .20, .065], [0, -.02, side * .13]); ring(.09, .035, [0, .11, side * .13], "metal", "z"); }
      for (const x of [-.15, .15]) for (const z of [-.18, .18]) cylinder(.025, .10, [x, -.11, z], "gold", "y");
    } else {
      throw new Error(`No original part geometry for ${id}`);
    }

    // Merge decorative details by material within a single selectable part. This
    // keeps hundreds of bolts, fins and vanes from adding individual draw calls.
    compactPartMeshes(group);
    // Preserve transforms for the assembled state; the viewer adds separation
    // relative to this local assembly coordinate without modifying the definition.
    parents.get(definition.assemblyId)!.group.add(group);
    return { definition, group, basePosition, materials: [...materials.values()] };
  });
}
