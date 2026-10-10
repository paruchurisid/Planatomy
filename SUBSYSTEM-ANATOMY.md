# Subsystem anatomy — original model, revision 02

October 10, 2026. The A320 visual study now has **79 individually selectable subsystem parts** inside the existing 27 assembly groups. These are original procedural illustrations, with names and functional descriptions, not verified manufacturer part-number records.

## Coverage

| Catalog system | Illustrated instances | Detail represented |
| --- | ---: | --- |
| Propulsion | 14 | Compressor stages, annular combustor, turbine stages, core exhaust cone, accessory gearbox, oil reservoir, pneumatic starter on each side |
| Main landing gear assembly | 10 | Shock strut, inboard/outboard wheels, representative brake pack, retraction actuator on each side |
| Landing gear | 4 | Nose shock strut, two nose wheels, steering actuator |
| Fuel system | 8 | Representative boost pump, feed valve, quantity probe, strainer on each side |
| Hydraulics | 9 | Green/blue/yellow-coded reservoirs, representative pump modules and accumulators |
| Electrical power | 6 | Two representative batteries, transformer rectifier, distribution panel, static inverter, contactor |
| Avionics | 6 | Flight-control computer, air-data/inertial reference unit, transceiver, data interface, radar processor, ventilation blower |
| Air and environmental | 6 | Primary/secondary heat exchangers, air-cycle machine, water separator, mixing manifold, trim-air valve |
| Flight controls | 6 | Aileron servo actuator, flap screwjack, flap drive gearbox on each side |
| Cabin systems | 5 | Passenger oxygen module, light, recirculation fan, water pump, galley heating unit |
| Primary structure | 5 | Floor crossbeam, crown stringer, two spar segments, tail attachment fitting |

Counts describe the objects authored for this illustration. They are not aircraft bill-of-materials quantities. A representative brake pack does not imply one brake per main gear, and the common hydraulic pump symbol does not imply identical drive sources across circuits.

## Using the viewer

1. Open a system using its `+` control, or search for a part by name, function, or ATA category.
2. Select a child part. The viewer isolates its system, fits the camera to that part, outlines it, and opens its own description.
3. Use **Subsystem spread** to separate internal parts independently of the aircraft-level **Assembly spread**.
4. Select the parent breadcrumb to see the full subsystem. Use its part labels or the sibling list to inspect another item.
5. **Show aircraft** restores the original shell and assemblies. **Focus selection** enters the subsystem study again. **Reset view** frames the current view; `R` and `F` work when the canvas is focused.

Isolated subsystem studies hide surrounding skins, nacelles, floors, and other context geometry. This prevents an opaque housing from blocking the internal component being inspected. The overview keeps internal spread at zero to preserve a readable aircraft silhouette.

## Implementation

- `web/src/subsystemParts.ts` defines stable local IDs, functions, ATA categories, parent systems/assemblies, installed illustration positions, and separation vectors.
- `web/src/subsystemGeometry.ts` creates distinct pumps, pressure vessels, finned coolers, electronics enclosures, actuators, brake discs, turbine/compressor stages and structural sections. Decorative pieces merge by material within each part, retaining 79 selection boundaries while reducing rendering work.
- `web/src/deltaA320.ts` attaches these parts to their existing parent groups. Former solid placeholders in engine cores, landing gear, avionics, electrical, hydraulic, and environmental groups are replaced.
- `web/src/AircraftScene.tsx` composes parent and child transforms. A child's position is its original local position plus its own separation vector; parent assembly motion is inherited. Raycasts resolve the nearest part ID before the containing assembly. Hidden geometry cannot intercept clicks.
- `web/src/App.tsx` keeps system selection separate from local part selection. Search retains parent systems for child matches, and individual part rows remain available through keyboard-accessible buttons. Catalog updates preserve local part identity and do not mark illustrative children as verified.

The system catalog remains API-compatible. Part definitions are local authored metadata, so this extension does not require a database migration or new service. There are no inferred prices, manufacturer part numbers, or real-aircraft applicability claims.

## Reference boundaries

The functional categories draw on public aircraft-system context. Airbus discusses the A320 hydraulic circuits and their differing pressure sources in [Safety First issue 4](https://safetyfirst.airbus.com/app/themes/mh_newsdesk/pdf/safety_first_04.pdf). Its [cabin-air technical article](https://www.aircraft.airbus.com/sites/g/files/jlcbta126/files/2021-08/FAST-article-Cabin-air-Jan-2021.pdf) describes packs, mixing, recirculation and distribution. These references support function-level explanations, not the dimensions or installation locations in the original artwork.

The model does not establish an exact Delta engine variant, airline cabin configuration, equipment supplier, serialized effectivity, installed quantities, or maintenance procedure. Replacing illustration metadata with verified part records requires independent evidence for each claim.

## Verification

`scripts/verify_subsystems.mjs` checks the actual model against metadata: unique IDs, parent mappings, finite/nonempty geometry, per-part material ownership, and coverage for all eleven catalog systems. It then tests part search, camera focus, direct picking, subsystem animation, parent/sibling navigation, live system-catalog updates, and mobile layout in a browser.

The existing `scripts/verify_viewer.mjs` continues to cover overview and assembled/exploded behavior, labels, orbit, offline fallback, and aircraft-catalog matching. Both scripts use the local development server and the same optional Playwright/browser environment variables documented in `ORIGINAL-A320-MODEL.md`. Screenshots go to ignored `artifacts/viewer/`.
