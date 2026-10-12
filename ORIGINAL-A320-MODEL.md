# Original airline-livery A320 study

Updated October 12, 2026. The viewer now uses original procedural geometry and uploaded livery artwork created for Planatomy. No Sketchfab mesh or external model service is used. The shared study can be viewed as Delta, American, United, or Alaska through the livery selector.

Revision 02 adds [79 selectable subsystem parts](SUBSYSTEM-ANATOMY.md) within the 27 assembly groups, with a second separation slider, system isolation, and individual-part inspection.

## Run it

From the repository root, run `npm install` when dependencies are missing, then `npm run dev`. Open `http://127.0.0.1:5173/`.

The model and eleven illustrative system descriptions load immediately without Postgres or the API. If the existing A320 API is available, recognized system descriptions are linked to that catalog. An unavailable API keeps the local illustration usable. A different aircraft's catalog is never attached to the A320 scene.

## Artwork and geometry

`web/src/deltaA320.ts` builds 27 independently movable assemblies:

- Upper fuselage shell, lower fuselage, forward flight deck/radome, aft fuselage/APU, and airframe rings.
- Passenger floor, repeated seats, and representative cabin furnishings.
- Port and starboard swept wings, wingtip fences, control surfaces, and illustrative fuel volumes.
- Two engine nacelles, two fan/spinner assemblies, and two simplified engine cores.
- Tail and stabilizers, with separate rudder and elevator surfaces.
- Nose landing gear and two main landing gear stations.
- Avionics, electrical distribution, hydraulics, and environmental-control modules.

The fuselage profile, airfoil lofts, hollow engine cowls, fan vanes, tires, frames, and other geometry are authored in TypeScript. Each livery supplies its own paint palette, wordmark, and original tail graphic through `web/src/airlineVariants.ts`; the geometry and subsystem locations stay shared. Lettering and marks are drawn on canvas textures at runtime. The repeated cabin seats use instancing to limit rendering work.

The length, span, and fuselage diameter target an approximate classic A320-200 envelope: 37.57 m × 34.10 m × 3.95 m. This uses wingtip fences rather than the wider sharklet envelope from the earlier generic database baseline. See [Airbus A320 aircraft characteristics, July 2025](https://www.aircraft.airbus.com/sites/g/files/jlcbta126/files/2025-07/AC_A320_20250715.pdf) and [Delta's A320 reference](https://news.delta.com/mediakit/airbus-a320).

These dimensions are an overall visual reference. Cabin seating, engine internals, bay contents, routing, and part boundaries are simplified original illustrations. The artwork does not establish the installed configuration of a particular airline aircraft, certified dimensions, manufacturer part numbers, or approved maintenance procedures. Airline and Airbus names identify reference subjects; the project is not endorsed by any of them.

## Interaction

- Starts in the exploded view at 78% separation.
- Assembled returns every group to its original position; Exploded restores the default separation.
- The slider interpolates from 0–100%. Each assembly has its own offset, so engines, fans, wings, cabin, shell, and landing gear separate individually.
- Drag to orbit; scroll or pinch to zoom; right-drag to pan. Reset view restores the fitted camera. Press `R` while the canvas is focused to reset.
- Click a part or an assembly label to select its system. Orbit drags do not trigger selection.
- Open a system's part list to select an individual subsystem component. The camera focuses the part and exposes its system's internals; Subsystem spread separates these child parts. Show aircraft restores the overview.
- Labels toggle the main assembly callouts. Overlapping labels are suppressed to keep the model legible.
- Reduced-motion preferences skip movement interpolation. WebGL failure produces an explicit error state.

`AircraftScene.tsx` owns lighting, the camera, controls, raycasting, animation, labels, and cleanup. The model's groups carry semantic identifiers; a raycast resolves the nearest assembly and then the corresponding catalog occurrence by canonical name. The scene survives changes in selection or incoming catalog data without rebuilding the renderer.

Subsystem meshes also carry stable local part IDs; those take precedence over assembly selection. Parts remain illustrative even when the containing system description comes from the live catalog.

## Data limits

The original model is the primary asset. The old `VITE_A320_MODEL_URL` hook has been removed: it overlaid an unsegmented model and could not provide genuine exploded anatomy. Future imported meshes need explicit assembly segmentation, transforms, and occurrence mapping.

The generic A320ceo catalog remains separate from this airline-livery visual study. Selecting a livery changes paint and markings only; it does not claim a carrier-specific configuration. No new database migration or price evidence was added. Prices remain unavailable until verified part identities and comparable observations exist.

## Verification

`npm run build` checks TypeScript and produces the Vite build. `scripts/verify_viewer.mjs` exercises the browser with the API deliberately disconnected: immediate rendering, assembled/exploded views, labels and selection, full separation, reset, search, and a 390-pixel mobile viewport. It saves screenshots under the ignored `artifacts/viewer/` directory.

Run that script against the development server using an installed Playwright package. `PLAYWRIGHT_MODULE` can point to its `index.mjs`, and `VIEWER_BROWSER` can point to an installed Chromium-compatible executable. `VIEWER_URL` and `VIEWER_ARTIFACTS` optionally override the server and screenshot directory. The test does not install browsers or contact the database.
