# Airbus A320 reference baseline

> October 10, 2026: The current frontend uses the [original Delta-inspired A320-200 study](ORIGINAL-A320-MODEL.md), with a 34.10 m wingtip-fence span. The earlier generic database baseline described below uses 35.80 m and remains separate from the visual study. It is not an exact Delta configuration.

Planatomy now uses an Airbus A320 specification-based schematic reference. The model is dimensioned to the published A320 family envelope, while internal detail remains deliberately simplified until licensed technical drawings or a commissioned segmented asset are available.

The baseline uses the A320-200/A320neo dimensional envelope because Airbus publishes a combined A320/A320neo aircraft-characteristics reference for airport and maintenance planning. Airbus lists an A320 family aircraft length of 37.57 m, height of 11.76 m, fuselage diameter of 3.95 m, cabin width of 3.70 m, and wing span of 35.80 m for the ACJ320neo specification page. The production model scales to these proportions; it does not assert that every A320 airframe has identical wingtip devices, cabin, engines, or modifications. [Airbus aircraft characteristics](https://www.aircraft.airbus.com/en/customer-care/fleet-wide-care/airport-operations-and-aircraft-characteristics/aircraft-characteristics) · [Airbus ACJ320neo specifications](https://www.acj.airbus.com/en/exclusive-aircraft/acjneo)

Airbus describes the A320 as a single-aisle family with two underwing engines and digital fly-by-wire flight controls. The viewer represents these as system groups. It does not identify a specific airline's engine, cabin, avionics fit, sharklet status, modification package, or serial-number effectivity. [Airbus A320 Family](https://www.airbus.com/en/products-services/commercial-aircraft/passenger-aircraft/a320-family) · [Airbus fly-by-wire overview](https://www.airbus.com/en/newsroom/stories/2022-06-safety-innovation-1-fly-by-wire-fbw)

## What is modeled

- A320-length narrow-body fuselage with a 3.95 m diameter proportion.
- Swept wings with twin underwing engine stations.
- Vertical and horizontal empennage.
- Main and nose landing-gear visualization.
- System-level schematic occurrences for propulsion, flight controls, electrical power, hydraulics, fuel, avionics, cabin, environmental systems, and primary structure.
- A reference configuration record that exposes unknown engine option, cabin layout, wingtip device, airline modifications, and airframe serial.

## What is not claimed

- The model is not an OEM engineering CAD model, maintenance instruction, illustrated parts catalog, or certification artifact.
- It does not show every component, fastener, wire, duct, line-replaceable unit, or airline option.
- A schematic occurrence does not establish an installed part number or approved replacement.
- Dimensions are a reference envelope, not a survey of one serialized aircraft.

## Rebuild rule

When licensed A320 geometry becomes available, replace the procedural meshes through a versioned asset manifest. Preserve the configuration revision, occurrence identifiers, and evidence lineage. If the licensed asset uses a different dimensional reference, record the transform and source revision instead of silently changing the model's scale.
