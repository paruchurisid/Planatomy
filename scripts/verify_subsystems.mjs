import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const output = path.resolve(process.env.VIEWER_ARTIFACTS ?? "artifacts/viewer");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.VIEWER_BROWSER,
  args: ["--enable-webgl", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && /THREE|WebGL|shader/i.test(message.text())) errors.push(message.text()); });
  await page.route("**/aircraft", route => route.abort());
  await page.goto(process.env.VIEWER_URL ?? "http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await page.getByText("Local illustration catalog", { exact: true }).waitFor();

  // Test real geometry/data integration: unique IDs, mapped parents, independent materials,
  // populated and finite meshes, and movable parts in every catalog system.
  const audit = await page.evaluate(async () => {
    const { createDeltaA320 } = await import("/web/src/deltaA320.ts");
    const { SUBSYSTEM_PARTS } = await import("/web/src/subsystemParts.ts");
    const { ADDITIONAL_SUBSYSTEMS } = await import("/web/src/subsystemExpansion.ts");
    const { LOCAL_COMPONENTS } = await import("/web/src/aircraftCatalog.ts");
    const model = createDeltaA320();
    const issues = [], ids = new Set(), materials = new Set();
    const panes = [];
    model.root.traverse(object => {
      if (/cockpit pane/.test(object.name)) panes.push(object);
    });
    if (panes.length !== 6) issues.push("Expected six cockpit glazing panes");
    for (const pane of panes) {
      if (!pane.material.isMeshPhysicalMaterial || pane.material.clearcoat !== 1) issues.push("Missing layered glazing finish");
      if (pane.geometry.attributes.position.count < 100) issues.push("Glazing is not fitted to nose curvature");
    }
    const systems = {};
    model.setInteriorVisible(false);
    for (const part of model.parts) {
      const exterior = ["nose-gear", "main-gear-port", "main-gear-starboard", "external-antennas"].includes(part.definition.assemblyId);
      if (part.group.visible !== exterior) issues.push("Incorrect closed-skin visibility: " + part.definition.id);
    }
    for (const id of ["fuel-port", "fuel-starboard"]) {
      const tank = model.assemblies.find(assembly => assembly.id === id).group.children.find(child => child.isMesh);
      if (tank.visible) issues.push("Tank protrudes through closed wing: " + id);
    }
    model.setInteriorVisible(true);
    if (model.parts.some(part => !part.group.visible)) issues.push("Exploded view did not restore internal parts");
    for (const subsystem of ADDITIONAL_SUBSYSTEMS) {
      const children = model.parts.filter(part => part.definition.assemblyId === subsystem.id);
      if (children.length !== subsystem.items.length) issues.push("Incomplete subsystem: " + subsystem.id);
      if (!model.assemblies.some(assembly => assembly.id === subsystem.id && assembly.system === subsystem.system)) issues.push("Missing subsystem: " + subsystem.id);
    }
    for (const assemblyId of ["apu", "cockpit-equipment", "cargo-equipment", "tail-controls", "service-bay", "external-antennas"]) {
      if (!model.parts.some(part => part.definition.assemblyId === assemblyId)) issues.push("Empty new assembly: " + assemblyId);
    }
    model.parts.forEach(part => {
      const { definition, group } = part;
      if (ids.has(definition.id)) issues.push("Duplicate part: " + definition.id);
      ids.add(definition.id);
      systems[definition.system] = (systems[definition.system] ?? 0) + 1;
      if (group.parent?.userData.assemblyId !== definition.assemblyId) issues.push("Wrong parent: " + definition.id);
      if (group.userData.partId !== definition.id) issues.push("Missing picking identifier: " + definition.id);
      if (!definition.offset.some(value => value !== 0)) issues.push("No separation: " + definition.id);
      let meshes = 0;
      group.traverse(object => {
        if (!object.isMesh) return;
        meshes++;
        if (!object.geometry.attributes.position?.count) issues.push("Empty mesh: " + definition.id);
        if (!object.geometry.attributes.position.array.every(Number.isFinite)) issues.push("Invalid vertices: " + definition.id);
      });
      if (!meshes) issues.push("No geometry: " + definition.id);
      for (const material of part.materials) {
        if (materials.has(material.uuid)) issues.push("Shared highlight material: " + definition.id);
        materials.add(material.uuid);
      }
    });
    for (const system of LOCAL_COMPONENTS) if (!(systems[system.canonical_name] >= 3)) issues.push("Missing subsystem detail: " + system.canonical_name);
    const result = { total: model.parts.length, definitions: SUBSYSTEM_PARTS.length, systems, issues };
    model.dispose(); return result;
  });
  assert.deepEqual(audit.issues, []);
  assert.equal(audit.total, audit.definitions);
  assert.ok(audit.total >= 367);
  assert.equal(await page.locator("canvas").count(), 1);
  await page.screenshot({ path: path.join(output, "subsystems-overview.png"), fullPage: true });

  const search = page.getByRole("textbox", { name: "Search aircraft systems and parts" });
  await search.fill("Door & evacuation equipment");
  assert.equal(await page.locator(".part-row").count(), 8, "Subsystem name finds all its parts");
  await search.fill("Green hydraulic reservoir");
  assert.equal(await page.locator(".system-row").count(), 1, "Searching a part retains its system parent");
  await page.locator(".part-row").filter({ hasText: "Green hydraulic reservoir" }).click();
  await page.getByRole("button", { name: "Show aircraft", exact: true }).waitFor();
  await page.waitForTimeout(1800);
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Green hydraulic reservoir");
  assert.equal(await page.locator(".verified-pill").textContent(), "ILLUSTRATED PART");
  assert.equal(await page.locator("#part-explosion").isEnabled(), true);
  const chosenId = await page.locator(".part-label.is-selected").getAttribute("data-part-id");
  assert.equal(chosenId, "hydraulic-reservoir-green");
  // Direct mesh picking must continue to select the actual child, not its parent group.
  await page.getByRole("button", { name: "Labels on", exact: true }).click();
  const canvas = await page.locator("canvas").boundingBox();
  assert.ok(canvas);
  await page.mouse.click(canvas.x + canvas.width / 2, canvas.y + canvas.height / 2);
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Green hydraulic reservoir");
  await page.getByRole("button", { name: "Labels off", exact: true }).click();
  await page.screenshot({ path: path.join(output, "subsystem-hydraulic-part.png"), fullPage: true });

  await page.locator(".inspector-breadcrumb").click();
  await page.waitForTimeout(1200);
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Hydraulics");
  await page.locator("#part-explosion").fill("0");
  await page.waitForTimeout(1200);
  const compact = await page.locator("canvas").screenshot();
  await page.locator("#part-explosion").fill("100");
  await page.waitForTimeout(1400);
  const expanded = await page.locator("canvas").screenshot();
  assert.notDeepEqual(compact, expanded, "Subsystem spread changes actual rendering");
  await page.screenshot({ path: path.join(output, "subsystem-hydraulics-exploded.png"), fullPage: true });
  await page.getByRole("button", { name: "Show aircraft", exact: true }).click();
  await page.waitForTimeout(1200);
  assert.equal(await page.locator("#part-explosion").isDisabled(), true);

  await search.fill("Port compressor stages");
  await page.locator(".part-row").filter({ hasText: /^Port compressor stages/ }).click();
  await page.waitForTimeout(1400);
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Port compressor stages");
  await page.getByRole("button", { name: "Labels on", exact: true }).click();
  const engineCanvas = await page.locator("canvas").boundingBox();
  await page.mouse.click(engineCanvas.x + engineCanvas.width / 2, engineCanvas.y + engineCanvas.height / 2);
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Port compressor stages", "Nacelle cannot block the focused engine part");
  await page.getByRole("button", { name: "Labels off", exact: true }).click();
  await page.screenshot({ path: path.join(output, "subsystem-compressor.png"), fullPage: true });
  await page.getByRole("button", { name: /Port annular combustor/ }).filter({ has: page.locator(".sibling-number") }).click();
  await page.waitForTimeout(1000);
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Port annular combustor");

  // A live parent description must not relabel local child geometry as catalog-verified.
  await page.evaluate(() => { document.querySelector("canvas").dataset.qaInstance = "same"; });
  await page.unroute("**/aircraft");
  await page.route("**/aircraft", route => route.fulfill({ json: { items: [{ id: "test", family: "Airbus A320", variant: "A320ceo", revision: 3 }] } }));
  await page.route("**/aircraft/test/components", route => route.fulfill({ json: { items: [{ id: "live-propulsion", canonical_name: "Propulsion", description: "Live parent fixture" }] } }));
  await page.getByRole("button", { name: "Reconnect catalog ↻", exact: true }).click();
  await page.getByText("A320 CATALOG CONNECTED", { exact: true }).waitFor();
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Port annular combustor");
  assert.equal(await page.locator(".verified-pill").textContent(), "ILLUSTRATED PART");
  assert.equal(await page.locator("canvas").getAttribute("data-qa-instance"), "same");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1200);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(output, "subsystems-mobile.png"), fullPage: true });
  await page.setViewportSize({ width: 1600, height: 1000 });
  for (const [name, id] of [["APU rotating core", "apu-module-1"], ["Captain seat", "deck-hardware-1"],
    ["Cargo service access panel", "cargo-protection-10"], ["Rudder servo actuator A", "tail-drive-1"],
    ["Ground pneumatic connector", "ground-services-1"], ["VHF blade antenna", "radio-equipment-1"],
    ["Ram-air turbine rotor", "emergency-power-ram-air-turbine"],
    ["Brake and anti-skid controller", "brake-control-brake-controller"],
    ["Port pitot probe", "air-data-pitot-left"],
    ["Evacuation slide container", "door-evacuation-slide-pack"],
    ["Oxygen distribution block", "oxygen-distribution-distribution-block"],
    ["Fuel crossfeed control valve", "center-fuel-crossfeed"],
    ["Fire detection control unit", "fire-detection-fire-controller"],
    ["Cabin positive-pressure relief valve", "pressure-safety-relief-valve"]]) {
    await search.fill(name);
    await page.locator(".part-row").filter({ hasText: name }).click();
    await page.waitForTimeout(1000);
    assert.equal(await page.locator(".detail-title-row h2").textContent(), name);
    assert.equal(await page.locator(".part-label.is-selected").getAttribute("data-part-id"), id);
    if (["deck-hardware-1", "apu-module-1", "emergency-power-ram-air-turbine", "door-evacuation-slide-pack"].includes(id)) {
      await page.screenshot({ path: path.join(output, `${id}.png`), fullPage: true });
    }
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ result: "passed", ...audit, checks: ["geometry coverage", "part search and selection", "isolated focus", "direct picking", "subsystem animation", "parent and sibling navigation", "live catalog identity", "mobile"], artifacts: output }));
} finally { await browser.close(); }
