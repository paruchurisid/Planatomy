# Subsystem anatomy — original model, revision 05

October 10, 2026. The A320 visual study now has **367 individually selectable subsystem parts** across 41 assembly groups. These are original procedural illustrations, with names and functional descriptions, not verified manufacturer part-number records.

## Coverage

| Catalog system | Illustrated instances | Detail represented |
| --- | ---: | --- |
| Propulsion | 58 | Compressor stages, annular combustor, turbine stages, core exhaust cone, accessory gearbox, oil reservoir, pneumatic starter on each side |
| Main landing gear assembly | 28 | Shock strut, inboard/outboard wheels, representative brake pack, retraction actuator on each side |
| Landing gear | 8 | Nose shock strut, two nose wheels, steering actuator |
| Fuel system | 28 | Representative boost pump, feed valve, quantity probe, strainer on each side |
| Hydraulics | 21 | Green/blue/yellow-coded reservoirs, representative pump modules and accumulators |
| Electrical power | 28 | Two representative batteries, transformer rectifier, distribution panel, static inverter, contactor |
| Avionics | 46 | Flight-control computer, air-data/inertial reference unit, transceiver, data interface, radar processor, ventilation blower |
| Air and environmental | 38 | Primary/secondary heat exchangers, air-cycle machine, water separator, mixing manifold, trim-air valve |
| Flight controls | 30 | Aileron servo actuator, flap screwjack, flap drive gearbox on each side |
| Cabin systems | 41 | Passenger oxygen module, light, recirculation fan, water pump, galley heating unit |
| Primary structure | 41 | Floor crossbeam, crown stringer, two spar segments, tail attachment fitting |

Counts describe the objects authored for this illustration. They are not aircraft bill-of-materials quantities. A representative brake pack does not imply one brake per main gear, and the common hydraulic pump symbol does not imply identical drive sources across circuits.

## Revision 05 additions

Eight new study assemblies add 64 parts:

| Assembly | Parts | Detail |
| --- | ---: | --- |
| Emergency power deployment | 8 | Ram-air rotor, deployment cylinder/latch, generator, regulation and connections |
| Braking & anti-skid control | 8 | Controller, distribution block, parking valve, accumulator and modulators |
| Air-data sensing | 8 | Pressure/temperature probes, heating, signal interface and loom |
| Door & evacuation equipment | 8 | Slide container, inflation supply, latch, damper and indication |
| Oxygen supply & regulation | 8 | Supply vessel, regulator, manifold, isolation and monitoring |
| Center fuel management | 8 | Crossfeed, transfer, feed manifold, quantity/refueling interfaces and access |
| Fire detection & isolation | 8 | Detection channels, agent manifold, discharge sensing and isolation |
| Cabin pressure safety | 8 | Relief paths, differential-pressure sensing, outflow drive and reference connections |

`web/src/subsystemExpansion.ts` supplies both parent assembly definitions and child metadata, keeping IDs, system mappings and locations together. New geometry families depict a two-blade ram-air rotor, hooked latch, multiport manifold, pressure probe and strapped slide container. The eleven top-level catalog systems remain compatible with the existing API.

These are functional teaching layouts. Probe stations are grouped for inspection rather than mounted at verified external sensing locations; the ram-air rotor depicts deployed hardware rather than a complete stow/deploy simulation. Shared rotating-machine and valve shapes do not establish exact aircraft equipment types or installation arrangements.

## Revision 04 additions

Adds 104 selectable parts and six dedicated assemblies: auxiliary power, flight-deck hardware, cargo/fire equipment, tail-control drives, ground-service connections, and external antennas. New geometry families include crew seats with rails and belts, paired pedals, switch consoles, flanged access hatches, blade antennas, bundled wiring, stiffened ribs and auxiliary rotating machinery. Sixteen individual wing ribs populate both wings. Crew equipment follows a two-seat layout, and antennas follow the fuselage crown during assembly spread.

All additions retain individual search, picking, focus and spread behavior. Geometry is illustrative: generator/motor housings and other shared functional shapes are not supplier-specific models. Added ATA categories describe the depicted functions without changing the eleven top-level catalog systems.

## Revision 03 additions

Adds 120 individually selectable modules: engine fuel/oil/ignition/bleed/fire equipment, high-lift drives and sensors, tank feed/refueling/vent components, gear locks and brake control, flight-deck displays and controllers, electrical distribution, hydraulic filtration and regulation, pressure/air conditioning, cabin water/waste/oxygen equipment, and twelve floor-beam stations. The table counts include these additions; its detail column summarizes the original geometry families.

Cockpit glazing now comprises six subdivided, shaped panels fitted to the nose surface, with layered rubber seals, metallic trim, a clearcoat finish, reflected edge accents and two wipers. Glazing is opaque tinted artwork over the shell, rather than a transparent opening into a fully modeled flight deck.

New geometry families include ducts with flange rings, instrument displays, small transmitters and I-section beams. Shared shape builders retain independent per-part materials and picking boundaries. The compact equipment layouts remain functional illustrations rather than engineering installation drawings.

## Using the viewer

1. Open a system using its `+` control, or search for a part by name, function, or ATA category.
2. Select a child part. The viewer isolates its system, fits the camera to that part, outlines it, and opens its own description.
3. Use **Subsystem spread** to separate internal parts independently of the aircraft-level **Assembly spread**.
4. Select the parent breadcrumb to see the full subsystem. Use its part labels or the sibling list to inspect another item.
5. **Show aircraft** restores the original shell and assemblies. **Focus selection** enters the subsystem study again. **Reset view** frames the current view; `R` and `F` work when the canvas is focused.

Isolated subsystem studies hide surrounding skins, nacelles, floors, and other context geometry. This prevents an opaque housing from blocking the internal component being inspected. The overview keeps internal spread at zero to preserve a readable aircraft silhouette.

## Implementation

- `web/src/subsystemParts.ts` defines stable local IDs, functions, ATA categories, parent systems/assemblies, installed illustration positions, and separation vectors.
- `web/src/subsystemGeometry.ts` creates distinct pumps, pressure vessels, finned coolers, electronics enclosures, actuators, brake discs, turbine/compressor stages and structural sections. Decorative pieces merge by material within each part, retaining individual selection boundaries while reducing rendering work.
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

Revision 03 verification also checks six physical-material glazing panes and the expanded part coverage. `scripts/verify_cockpit.mjs` produces an exterior close-up at `artifacts/viewer/cockpit-closeup.png`.

Revision 04 checks require all six new assemblies to contain selectable geometry and exercise search/focus for an APU core, crew seat, cargo hatch, tail actuator, service duct and external antenna. Selection state is updated even for hidden labels, preventing stale highlighted/pressed states when navigating between distant components. The production build and overview/mobile browser scenarios also cover the expanded model.

Revision 05 verification checks each new assembly against its shared part list and exercises search/focus on one part from all eight new subsystems. It captures the ram-air turbine and slide container alongside existing overview, mobile and part screenshots.

Search also matches the new subsystem display names (for example, “Door & evacuation equipment” returns all eight parts), and the inspector displays those names instead of raw assembly IDs.
