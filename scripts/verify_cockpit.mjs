import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage({viewport: {width: 1200, height: 800}});
  await page.goto(process.env.VIEWER_URL ?? 'http://127.0.0.1:5173/');
  const result = await page.evaluate(async () => {
    const THREE = await import('/node_modules/three/build/three.module.js');
    const {createDeltaA320} = await import('/web/src/deltaA320.ts');
    const model = createDeltaA320();
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0xdbe5ee);
    const nose = model.assemblies.find(a => a.id === 'nose').group;
    scene.add(nose);
    // Hide illustrative flight-deck equipment for an exterior glazing inspection.
    nose.children.forEach(child => { if (child.userData.partId) child.visible = false; });
    scene.add(new THREE.HemisphereLight(0xe9f6ff, 0x687587, 3));
    const sun = new THREE.DirectionalLight(0xffffff, 4); sun.position.set(20, 15, 10); scene.add(sun);
    const camera = new THREE.PerspectiveCamera(34, 1.5, .1, 100);
    camera.position.set(22, 5, 8); camera.lookAt(15.8, .6, 0);
    const renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.setSize(1200, 800); renderer.setPixelRatio(1);
    renderer.domElement.id = 'cockpit-review';
    renderer.domElement.style.cssText = 'position:fixed;inset:0;z-index:99999';
    document.body.appendChild(renderer.domElement); renderer.render(scene, camera);
    return {panes: nose.children.filter(c => /cockpit pane/.test(c.name)).length, parts: model.parts.length};
  });
  assert.equal(result.panes, 6); assert.ok(result.parts >= 199);
  await mkdir('artifacts/viewer', {recursive: true});
  await page.locator('#cockpit-review').screenshot({path: 'artifacts/viewer/cockpit-closeup.png'});
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
