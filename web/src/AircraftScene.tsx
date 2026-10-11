import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createDeltaA320, DELTA_MODEL_VERSION, type AircraftAssembly } from "./deltaA320";
import type { AircraftPart } from "./subsystemGeometry";
import type { ComponentOccurrence } from "./types";
import "./AircraftScene.css";

type Props = {
  selected: ComponentOccurrence | null;
  mode: "assembled" | "exploded";
  onSelect: (id: string) => void;
  components: ComponentOccurrence[];
  explosion?: number;
  labels?: boolean;
  resetKey?: number;
  selectedPartId?: string | null;
  onSelectPart?: (id: string) => void;
  partExplosion?: number;
  isolatedSystem?: string | null;
  focusKey?: number;
};
type Hit = { assembly: AircraftAssembly; part?: AircraftPart };
type LabelNode = { assembly: AircraftAssembly; part?: AircraftPart; button: HTMLButtonElement; width: number };
const systemMatches = (system: string, filter?: string | null) =>
  !filter || system === filter || (filter === "Landing gear" && system === "Main landing gear assembly");
const cleanLabel = (text: string) => text.replace(/^\d+ \/ /, "");

export default function AircraftScene(props: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  latest.current = props;
  const [failure, setFailure] = useState<string | null>(null);
  const [hover, setHover] = useState<{ label: string; system: string; part: boolean } | null>(null);
  const [counts, setCounts] = useState({ assemblies: 0, parts: 0, systems: {} as Record<string, number> });

  useEffect(() => {
    const mount = mountRef.current, overlay = labelRef.current;
    if (!mount || !overlay) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      setFailure("The 3D canvas could not start. Enable hardware acceleration in your browser and reload.");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-label", "Original Delta-inspired A320. Drag to rotate, scroll to zoom, or select a labeled assembly or subsystem part.");
    canvas.setAttribute("role", "img");
    canvas.tabIndex = 0;
    mount.appendChild(canvas);
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xdce5ed);
    scene.fog = new THREE.Fog(0xdce5ed, 140, 280);
    scene.add(new THREE.HemisphereLight(0xf4f9ff, 0x607088, 2.1));
    const key = new THREE.DirectionalLight(0xfff5e7, 3.5); key.position.set(25, 45, 15); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -43, right: 43, top: 43, bottom: -43, near: 1, far: 140 });
    key.shadow.bias = -.0004; key.shadow.normalBias = .08; scene.add(key);
    const fill = new THREE.DirectionalLight(0xc5dcff, 1.6); fill.position.set(-20, 9, -25); scene.add(fill);
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xdce5ed, roughness: 1 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial); ground.rotation.x = -Math.PI / 2;
    ground.position.y = -9; ground.receiveShadow = true; scene.add(ground);
    const grid = new THREE.GridHelper(160, 80, 0x9aafc0, 0xb6c7d5); grid.position.y = -8.98;
    const gridMaterial = grid.material as THREE.Material; gridMaterial.transparent = true; gridMaterial.opacity = .18; scene.add(grid);

    const model = createDeltaA320(); scene.add(model.root);
    const assemblyMap = new Map(model.assemblies.map(item => [item.id, item]));
    const partMap = new Map(model.parts.map(part => [part.definition.id, part]));
    const partOffsets = new Map(model.parts.map(part => [part.definition.id, new THREE.Vector3(...part.definition.offset)]));
    const systemCounts: Record<string, number> = {};
    model.parts.forEach(part => { systemCounts[part.definition.system] = (systemCounts[part.definition.system] ?? 0) + 1; });
    setCounts({ assemblies: model.assemblies.length, parts: model.parts.length, systems: systemCounts });
    model.root.updateMatrixWorld(true);
    const assemblyBounds = new Map(model.assemblies.map(item => [item.id, new THREE.Box3().setFromObject(item.group)]));
    const partBounds = new Map(model.parts.map(part => [part.definition.id, new THREE.Box3().setFromObject(part.group)]));
    const contextMeshes: THREE.Mesh[] = [];
    model.root.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      let ancestor: THREE.Object3D | null = object;
      while (ancestor && ancestor !== model.root) {
        if (ancestor.userData.partId) return;
        ancestor = ancestor.parent;
      }
      contextMeshes.push(object);
    });
    const camera = new THREE.PerspectiveCamera(35, 1, .02, 600);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true; controls.dampingFactor = .08;
    controls.minDistance = .65; controls.maxDistance = 250; controls.maxPolarAngle = Math.PI * .79;
    let width = 1, height = 1;
    const direction = new THREE.Vector3(1.05, .76, 1.32).normalize();
    let previousReset = latest.current.resetKey, previousFocus = latest.current.focusKey;
    let previousIsolation = latest.current.isolatedSystem ?? null;
    let focusedPartId: string | null = null;
    const focusedCenter = new THREE.Vector3();
    function targetExplosion() {
      return latest.current.mode === "assembled" ? 0 : THREE.MathUtils.clamp(latest.current.explosion ?? .78, 0, 1);
    }
    function targetPartExplosion() {
      return latest.current.isolatedSystem ? THREE.MathUtils.clamp(latest.current.partExplosion ?? .55, 0, 1) : 0;
    }
    function desiredPartBounds(part: AircraftPart, spread = targetPartExplosion()) {
      const parent = assemblyMap.get(part.definition.assemblyId)!;
      return partBounds.get(part.definition.id)!.clone()
        .translate(parent.offset.clone().multiplyScalar(targetExplosion()))
        .translate(partOffsets.get(part.definition.id)!.clone().multiplyScalar(spread));
    }
    function fitView(focus = false) {
      const state = latest.current;
      const selectedPart = state.selectedPartId ? partMap.get(state.selectedPartId) : undefined;
      const scope = state.isolatedSystem ?? (focus ? state.selected?.canonical_name : null);
      const boxes: THREE.Box3[] = [];
      focusedPartId = focus && selectedPart ? selectedPart.definition.id : null;
      if (focus && selectedPart) {
        const box = desiredPartBounds(selectedPart);
        box.getCenter(focusedCenter);
        boxes.push(box.expandByScalar(.30));
      } else {
        if (!scope) for (const item of model.assemblies) {
          boxes.push(assemblyBounds.get(item.id)!.clone().translate(item.offset.clone().multiplyScalar(targetExplosion())));
        }
        for (const part of model.parts.filter(part => systemMatches(part.definition.system, scope))) {
          boxes.push(desiredPartBounds(part, scope ? 1 : 0));
        }
      }
      const bounds = new THREE.Box3(); boxes.forEach(box => bounds.union(box));
      if (bounds.isEmpty()) return;
      const target = bounds.getCenter(new THREE.Vector3());
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), direction).normalize();
      const up = new THREE.Vector3().crossVectors(direction, right).normalize();
      const tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), tanX = tanY * camera.aspect;
      let distance = 1.5;
      for (const box of boxes) {
        for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
          const corner = new THREE.Vector3(x, y, z).sub(target);
          distance = Math.max(distance, Math.abs(corner.dot(right)) / tanX + corner.dot(direction), Math.abs(corner.dot(up)) / tanY + corner.dot(direction));
        }
      }
      camera.position.copy(target).addScaledVector(direction, distance * 1.22);
      controls.target.copy(target); controls.maxDistance = Math.max(175, distance * 2);
      camera.lookAt(target); controls.update();
    }
    function resize() {
      const nextWidth = Math.max(1, mount!.clientWidth), nextHeight = Math.max(1, mount!.clientHeight);
      if (width === nextWidth && height === nextHeight) return;
      width = nextWidth; height = nextHeight; camera.aspect = width / height; camera.updateProjectionMatrix();
      renderer.setSize(width, height); fitView(Boolean(latest.current.selectedPartId && latest.current.isolatedSystem));
    }
    const observer = new ResizeObserver(resize); observer.observe(mount); resize();

    const guidePositions = new Float32Array((model.assemblies.length + model.parts.length) * 6);
    const guideGeometry = new THREE.BufferGeometry(); guideGeometry.setAttribute("position", new THREE.BufferAttribute(guidePositions, 3));
    const guideMaterial = new THREE.LineBasicMaterial({ color: 0x6a879d, transparent: true, opacity: .2, depthWrite: false });
    const guides = new THREE.LineSegments(guideGeometry, guideMaterial); guides.frustumCulled = false; scene.add(guides);
    const selectionBox = new THREE.BoxHelper(new THREE.Object3D(), 0xb12746);
    selectionBox.visible = false; scene.add(selectionBox);

    function occurrenceFor(item: AircraftAssembly) {
      const found = latest.current.components.find(c => c.canonical_name === item.system);
      return found ?? (item.system === "Main landing gear assembly" ? latest.current.components.find(c => c.canonical_name === "Landing gear") : undefined);
    }
    function selectHit(hit: Hit) {
      if (hit.part && latest.current.onSelectPart) latest.current.onSelectPart(hit.part.definition.id);
      else { const component = occurrenceFor(hit.assembly); if (component) latest.current.onSelect(component.id); }
    }
    function makeLabel(assembly: AircraftAssembly, part?: AircraftPart): LabelNode {
      const button = document.createElement("button"); button.type = "button";
      button.className = "assembly-label" + (part ? " part-label" : "");
      button.textContent = part ? part.definition.name : cleanLabel(assembly.label);
      button.title = button.textContent + " · " + assembly.system;
      button.setAttribute("aria-label", "Inspect " + (part ? "part " + part.definition.name : assembly.label));
      if (part) button.dataset.partId = part.definition.id;
      button.addEventListener("click", () => selectHit({ assembly, part })); overlay!.appendChild(button);
      return { assembly, part, button, width: button.offsetWidth || 150 };
    }
    const labelNodes = [
      ...model.assemblies.filter(item => item.labelPriority).map(item => makeLabel(item)),
      ...model.parts.map(part => makeLabel(assemblyMap.get(part.definition.assemblyId)!, part)),
    ];
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    let hovered: Hit | null = null;
    let down = { x: 0, y: 0 }, moved = false, pointerHeld = false;
    function hitAt(event: PointerEvent): Hit | null {
      const rect = canvas.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      for (const hit of raycaster.intersectObject(model.root, true)) {
        let object: THREE.Object3D | null = hit.object;
        let assembly: AircraftAssembly | undefined, part: AircraftPart | undefined, visible = true;
        while (object) {
          if (!object.visible) visible = false;
          if (object.userData.partId) part = partMap.get(object.userData.partId);
          if (object.userData.assemblyId) assembly = assemblyMap.get(object.userData.assemblyId);
          object = object.parent;
        }
        if (visible && assembly) return { assembly, part };
      }
      return null;
    }
    function pointerDown(event: PointerEvent) { down = { x: event.clientX, y: event.clientY }; moved = false; pointerHeld = true; }
    function pointerMove(event: PointerEvent) {
      if (pointerHeld && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) moved = true;
      const next = pointerHeld ? null : hitAt(event);
      if (next?.assembly.id !== hovered?.assembly.id || next?.part?.definition.id !== hovered?.part?.definition.id) {
        hovered = next;
        setHover(next ? { label: next.part?.definition.name ?? cleanLabel(next.assembly.label), system: next.assembly.system, part: !!next.part } : null);
      }
      canvas.style.cursor = next ? "pointer" : pointerHeld ? "grabbing" : "grab";
    }
    function pointerUp(event: PointerEvent) {
      if (pointerHeld && !moved && event.button === 0) { const hit = hitAt(event); if (hit) selectHit(hit); }
      pointerHeld = false;
    }
    function pointerCancel() { pointerHeld = false; hovered = null; setHover(null); }
    function keyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "r") { event.preventDefault(); fitView(); }
      if (event.key.toLowerCase() === "f") { event.preventDefault(); fitView(true); }
    }
    canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("pointercancel", pointerCancel);
    canvas.addEventListener("pointerleave", pointerCancel); canvas.addEventListener("keydown", keyDown);
    const contextLost = (event: Event) => { event.preventDefault(); setFailure("The browser lost its 3D context. Reload to restore the aircraft."); };
    canvas.addEventListener("webglcontextlost", contextLost);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, lastTime = performance.now(), amount = targetExplosion(), partAmount = targetPartExplosion();
    const projection = new THREE.Vector3(), point = new THREE.Vector3(), basePoint = new THREE.Vector3();
    const focusDelta = new THREE.Vector3();
    function animate(time: number) {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, .25); lastTime = time;
      const state = latest.current;
      amount = reducedMotion.matches ? targetExplosion() : THREE.MathUtils.damp(amount, targetExplosion(), 6, delta);
      partAmount = reducedMotion.matches ? targetPartExplosion() : THREE.MathUtils.damp(partAmount, targetPartExplosion(), 6, delta);
      const isolated = state.isolatedSystem ?? null;
      // In a subsystem study, expose its internals instead of hiding them behind
      // the original nacelle, wing skin, cabin floor, or surrounding airframe.
      contextMeshes.forEach(mesh => { mesh.visible = !isolated; });
      if (previousIsolation !== isolated || previousFocus !== state.focusKey || previousReset !== state.resetKey) {
        const focus = previousFocus !== state.focusKey || (previousIsolation !== isolated && !!isolated && !!state.selectedPartId);
        fitView(focus);
        previousIsolation = isolated; previousFocus = state.focusKey; previousReset = state.resetKey;
        hovered = null; setHover(null);
      }
      guidePositions.fill(0);
      model.assemblies.forEach((item, i) => {
        item.group.position.copy(item.offset).multiplyScalar(amount);
        item.group.visible = systemMatches(item.system, isolated);
        const isSelected = !state.selectedPartId && occurrenceFor(item)?.id === state.selected?.id && Boolean(state.selected);
        const isHovered = hovered?.assembly.id === item.id && !hovered.part;
        item.materials.forEach(mat => { mat.emissive.setHex(isHovered ? 0x386080 : isSelected ? 0x154058 : 0x000000); mat.emissiveIntensity = isHovered ? .24 : .14; });
        if (item.group.visible && !isolated) {
          item.anchor.toArray(guidePositions, i * 6);
          point.copy(item.anchor).add(item.group.position).toArray(guidePositions, i * 6 + 3);
        }
      });
      model.parts.forEach((part, i) => {
        const definition = part.definition, parent = assemblyMap.get(definition.assemblyId)!;
        part.group.position.copy(part.basePosition).addScaledVector(partOffsets.get(definition.id)!, partAmount);
        const selected = definition.id === state.selectedPartId, hoverPart = hovered?.part?.definition.id === definition.id;
        const systemSelected = !state.selectedPartId && definition.system === state.selected?.canonical_name;
        part.materials.forEach(mat => {
          mat.emissive.setHex(selected ? 0xa52542 : hoverPart ? 0x386080 : systemSelected ? 0x154058 : 0x000000);
          mat.emissiveIntensity = selected ? .30 : hoverPart ? .24 : .10;
        });
        if (parent.group.visible && isolated) {
          const index = (model.assemblies.length + i) * 6;
          basePoint.copy(part.basePosition).add(parent.group.position).toArray(guidePositions, index);
          point.copy(part.group.position).add(parent.group.position).toArray(guidePositions, index + 3);
        }
      });
      guides.visible = isolated ? partAmount > .02 : amount > .02;
      guideMaterial.opacity = (isolated ? partAmount : amount) * .35;
      guideGeometry.attributes.position.needsUpdate = true;
      // Track the selected part's animated center without changing the user's
      // orbit angle or zoom when either level of separation changes.
      if (focusedPartId) {
        const part = partMap.get(focusedPartId)!;
        partBounds.get(focusedPartId)!.getCenter(point);
        point.add(assemblyMap.get(part.definition.assemblyId)!.group.position)
          .addScaledVector(partOffsets.get(focusedPartId)!, partAmount);
        focusDelta.copy(point).sub(focusedCenter);
        camera.position.add(focusDelta); controls.target.add(focusDelta); focusedCenter.copy(point);
      }
      controls.update(); model.root.updateMatrixWorld(true);
      const selectedPart = state.selectedPartId ? partMap.get(state.selectedPartId) : undefined;
      selectionBox.visible = !!selectedPart && systemMatches(selectedPart.definition.system, isolated);
      if (selectionBox.visible && selectedPart) selectionBox.setFromObject(selectedPart.group);
      const placed: { x: number; y: number; w: number }[] = [];
      const orderedLabels = [...labelNodes].sort((a,b) => Number(b.part?.definition.id === state.selectedPartId) - Number(a.part?.definition.id === state.selectedPartId));
      orderedLabels.forEach(({ assembly, part, button, width: labelWidth }) => {
        // Hidden and offscreen labels must also relinquish the previous selection.
        const selected = part ? part.definition.id === state.selectedPartId : !state.selectedPartId && occurrenceFor(assembly)?.id === state.selected?.id;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
        const eligible = part ? !!isolated && systemMatches(part.definition.system, isolated) : !isolated && state.mode === "exploded" && amount > .12;
        if (!eligible || state.labels === false) { button.style.display = "none"; return; }
        if (part) {
          partBounds.get(part.definition.id)!.getCenter(point);
          point.y = partBounds.get(part.definition.id)!.max.y + .12;
          point.add(assembly.group.position).addScaledVector(partOffsets.get(part.definition.id)!, partAmount);
        } else point.copy(assembly.anchor).add(assembly.group.position);
        projection.copy(point).project(camera);
        const x = (projection.x * .5 + .5) * width, y = (-projection.y * .5 + .5) * height;
        const outside = projection.z < -1 || projection.z > 1 || x < labelWidth / 2 + 6 || x > width - labelWidth / 2 - 6 || y < 72 || y > height - 45;
        const overlap = placed.some(p => Math.abs(p.x - x) < (p.w + labelWidth) / 2 + 8 && Math.abs(p.y - y) < 36);
        const visible = !outside && !overlap;
        button.style.display = visible ? "block" : "none";
        if (visible) {
          button.style.transform = "translate(" + x + "px, " + y + "px) translate(-50%, -100%)";
          button.disabled = part ? !state.onSelectPart : !occurrenceFor(assembly);
          placed.push({ x, y, w: labelWidth });
        }
      });
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
      canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("pointercancel", pointerCancel);
      canvas.removeEventListener("pointerleave", pointerCancel); canvas.removeEventListener("keydown", keyDown);
      canvas.removeEventListener("webglcontextlost", contextLost);
      labelNodes.forEach(({ button }) => button.remove()); model.dispose();
      groundGeometry.dispose(); groundMaterial.dispose(); grid.geometry.dispose(); gridMaterial.dispose();
      guideGeometry.dispose(); guideMaterial.dispose(); selectionBox.geometry.dispose(); selectionBox.material.dispose();
      key.shadow.dispose(); renderer.dispose(); canvas.remove();
    };
  }, []);

  const visibleParts = props.isolatedSystem
    ? (counts.systems[props.isolatedSystem] ?? 0) + (props.isolatedSystem === "Landing gear" ? counts.systems["Main landing gear assembly"] ?? 0 : 0)
    : counts.parts;
  return <div className="aircraft-stage">
    <div className="scene-canvas" ref={mountRef} />
    <div className="assembly-labels" ref={labelRef} hidden={props.labels === false || (props.mode === "assembled" && !props.isolatedSystem)} />
    <div className="model-caption"><span className="model-caption-rule" /><div><strong>{props.isolatedSystem ?? "DELTA / A320–200"}</strong><small>{props.isolatedSystem ? "ISOLATED SUBSYSTEM / ORIGINAL PARTS" : DELTA_MODEL_VERSION}</small></div></div>
    <div className="model-scale"><strong>{props.isolatedSystem ? visibleParts : counts.assemblies || "—"}</strong><span>{props.isolatedSystem ? <>illustrated<br />parts</> : <>separable<br />assemblies</>}</span></div>
    {!props.isolatedSystem && <div className="model-part-count">{counts.parts} subsystem parts · Select a system to explore</div>}
    {hover && !failure && <div className="model-hover"><strong>{hover.label}</strong><span>{hover.system} · {hover.part ? "Inspect part" : "Inspect assembly"}</span></div>}
    <div className="model-footnote">ORIGINAL PROCEDURAL ART <span>·</span> ILLUSTRATIVE INTERNALS</div>
    {failure && <div className="model-failure" role="alert"><strong>3D viewer unavailable</strong><p>{failure}</p><button onClick={() => window.location.reload()}>Reload viewer</button></div>}
  </div>;
}
