import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Use an installed Playwright package, or point PLAYWRIGHT_MODULE at its index.mjs.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const output = path.resolve(process.env.VIEWER_ARTIFACTS ?? "artifacts/viewer");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.VIEWER_BROWSER, args: ["--enable-webgl", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && /THREE|WebGL|shader/i.test(message.text())) errors.push(message.text()); });
  // Database availability must never gate the model or create a blank scene.
  await page.route("**/aircraft", route => route.abort());
  await page.goto(process.env.VIEWER_URL ?? "http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  await page.locator(".model-scale strong").filter({ hasText: /^\d+$/ }).waitFor();
  await page.waitForTimeout(1800);
  assert.equal(await page.locator("canvas").count(), 1, "One renderer after React StrictMode mount");
  assert.equal(await page.getByText("Local illustration catalog", { exact: true }).count(), 1);
  assert.ok(await page.locator(".assembly-label:visible").count() > 0, "Exploded part labels are visible");
  const exploded = await page.locator("canvas").screenshot();
  await page.screenshot({ path: path.join(output, "delta-a320-exploded.png"), fullPage: true });
  await page.getByRole("button", { name: "Assembled", exact: true }).click();
  await page.waitForTimeout(1400);
  assert.equal(await page.locator("#explosion").inputValue(), "0");
  assert.equal(await page.locator(".assembly-label:visible").count(), 0);
  const assembled = await page.locator("canvas").screenshot();
  assert.notDeepEqual(exploded, assembled, "Exploded and assembled render differently");
  await page.screenshot({ path: path.join(output, "delta-a320-assembled.png"), fullPage: true });
  await page.getByRole("button", { name: "Exploded", exact: true }).click();
  await page.waitForTimeout(1400);
  await page.getByRole("button", { name: /Inspect .*Passenger cabin/ }).click();
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Cabin systems");
  const engineLabel = await page.getByRole("button", { name: "Inspect Port engine nacelle", exact: true }).boundingBox();
  assert.ok(engineLabel);
  await page.mouse.click(engineLabel.x + engineLabel.width / 2, engineLabel.y + engineLabel.height + 4);
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Propulsion", "Direct mesh raycast selects its system");
  const canvasBounds = await page.locator("canvas").boundingBox();
  assert.ok(canvasBounds);
  await page.mouse.move(canvasBounds.x + 100, canvasBounds.y + 100);
  await page.mouse.down();
  await page.mouse.move(canvasBounds.x + 200, canvasBounds.y + 160, { steps: 10 });
  await page.mouse.up();
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Propulsion", "Orbit does not accidentally select a part");
  await page.getByRole("button", { name: /Reset view/ }).click();
  await page.getByRole("button", { name: "Labels on", exact: true }).click();
  await page.locator(".assembly-label:visible").first().waitFor({ state: "hidden" });
  assert.equal(await page.locator(".assembly-label:visible").count(), 0);
  await page.getByRole("button", { name: "Labels off", exact: true }).click();
  await page.locator("#explosion").fill("100");
  await page.waitForTimeout(1400);
  await page.screenshot({ path: path.join(output, "delta-a320-full-explosion.png"), fullPage: true });
  await page.getByRole("button", { name: /Reset view/ }).click();
  await page.getByRole("textbox", { name: "Search aircraft systems and parts" }).fill("hydraulics");
  assert.equal(await page.locator(".system-row").count(), 1);
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  // Changing catalog IDs after rendering preserves selection and the existing canvas.
  await page.evaluate(() => { document.querySelector("canvas").dataset.qaInstance = "original"; });
  await page.unroute("**/aircraft");
  const fixture = { id: "test-a320", family: "Airbus A320", variant: "A320ceo", revision: 3, status: "published", attributes: {}, unknown_attributes: [], as_of_date: null };
  await page.route("**/aircraft", route => route.fulfill({ json: { items: [fixture] } }));
  await page.route("**/aircraft/test-a320/components", route => route.fulfill({ json: { items: [{ id: "live-engine", canonical_name: "Propulsion", description: "Two illustrative engines from a test catalog.", position_label: "Underwing", fidelity: "schematic", quantity_status: "known", quantity: 2, parent_occurrence_id: null }] } }));
  await page.getByRole("button", { name: "Reconnect catalog ↻", exact: true }).click();
  await page.getByText("A320 CATALOG CONNECTED", { exact: true }).waitFor();
  assert.equal(await page.locator(".detail-title-row h2").textContent(), "Propulsion");
  assert.equal(await page.locator("canvas").getAttribute("data-qa-instance"), "original", "Catalog update keeps the canvas");
  assert.equal(await page.locator(".system-row").count(), 11, "Partial live catalog retains all illustrated systems");
  await page.unroute("**/aircraft");
  await page.route("**/aircraft", route => route.fulfill({ json: { items: [{ ...fixture, family: "Boeing 737", variant: "737-800" }] } }));
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Local illustration catalog", { exact: true }).waitFor();
  assert.equal(await page.locator(".system-row").count(), 11, "Mismatched aircraft uses local A320 catalog");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No mobile horizontal overflow");
  await page.screenshot({ path: path.join(output, "delta-a320-mobile.png"), fullPage: true });
  assert.deepEqual(errors, [], "No runtime or WebGL errors");
  console.log(JSON.stringify({ result: "passed", scenarios: ["offline model", "assembled/exploded", "label and mesh selection", "orbit vs click", "labels toggle", "full separation", "reset", "search", "live catalog update", "mismatched catalog", "mobile layout"], artifacts: output }));
} finally {
  await browser.close();
}
