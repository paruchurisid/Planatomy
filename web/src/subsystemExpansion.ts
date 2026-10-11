import type { SubsystemPartDefinition } from "./subsystemParts";

type XYZ = [number, number, number];
type Item = [id: string, name: string, geometry: NonNullable<SubsystemPartDefinition["geometry"]>, ata: string, description: string];
type Subsystem = {
  id: string;
  label: string;
  system: string;
  origin: XYZ;
  offset: XYZ;
  items: Item[];
};

// Functional study layouts, not installation drawings. One shared definition
// produces both the assembly and its children so their system mappings cannot drift.
export const ADDITIONAL_SUBSYSTEMS: Subsystem[] = [
  {
    id: "emergency-power", label: "20 / Emergency power deployment", system: "Electrical power",
    origin: [-2.2, -1.35, .55], offset: [0, -5.4, 3.2], items: [
      ["ram-air-turbine", "Ram-air turbine rotor", "ram-turbine", "24", "A deployed airflow-driven rotor illustrates an emergency energy source."],
      ["deployment-cylinder", "Emergency turbine deployment cylinder", "actuator", "24", "Illustrates the linear mechanism that moves emergency equipment into the airflow."],
      ["deployment-latch", "Emergency turbine stowage latch", "latch", "24", "Retains the representative deployment mechanism in its stowed position."],
      ["emergency-generator", "Emergency generator housing", "pump", "24", "A rotating-machine housing represents conversion of mechanical energy to electrical power."],
      ["generator-regulator", "Emergency generator regulator", "electronics", "24", "Illustrates regulation and monitoring of emergency electrical output."],
      ["essential-feed", "Essential supply junction", "manifold", "24", "An insulated connection block illustrates distribution to essential electrical loads."],
      ["deployment-switch", "Emergency turbine position switch", "sensor", "24", "Reports a target on the deployment mechanism."],
      ["emergency-harness", "Emergency power wiring bundle", "harness", "92", "Connects representative control and indication equipment."],
    ],
  },
  {
    id: "brake-control", label: "21 / Braking & anti-skid control", system: "Main landing gear assembly",
    origin: [-1.4, -1.35, -.9], offset: [-1.5, -5.5, -3.2], items: [
      ["brake-controller", "Brake and anti-skid controller", "electronics", "32", "Processes wheel-speed inputs and commands brake-pressure modulation."],
      ["brake-distributor", "Brake pressure distribution block", "manifold", "32", "Groups representative hydraulic connections for brake supply and return."],
      ["parking-valve", "Parking brake control valve", "valve", "32", "Illustrates retention or release of a parking-brake pressure supply."],
      ["brake-accumulator", "Brake energy accumulator", "vessel", "32", "Represents stored hydraulic energy available to a braking path."],
      ["left-modulator", "Port brake pressure modulator", "valve", "32", "Illustrates controlled pressure delivery to one braking channel."],
      ["right-modulator", "Starboard brake pressure modulator", "valve", "32", "Illustrates controlled pressure delivery to the opposite braking channel."],
      ["brake-pressure", "Brake supply pressure transducer", "sensor", "32", "Converts supply pressure into a monitoring signal."],
      ["brake-wiring", "Anti-skid signal harness", "harness", "92", "Bundles representative wheel-speed and brake-control connections."],
    ],
  },
  {
    id: "air-data", label: "22 / Air-data sensing", system: "Avionics",
    origin: [12.4, .1, .9], offset: [5.6, .4, 3.8], items: [
      ["pitot-left", "Port pitot probe", "probe", "34", "A forward-facing pressure probe illustrates sensing of airflow total pressure."],
      ["pitot-right", "Starboard pitot probe", "probe", "34", "A second probe illustrates a separate pressure-sensing channel."],
      ["standby-pitot", "Standby pressure probe", "probe", "34", "Illustrates an additional pressure input for a standby indication path."],
      ["static-manifold", "Static pressure connection manifold", "manifold", "34", "Groups representative pressure-line connections."],
      ["temperature-probe", "Air temperature sensing probe", "probe", "34", "Illustrates a protected sensing element exposed to ambient airflow."],
      ["probe-heater", "Probe heat control unit", "electronics", "30", "Controls a representative electrically heated sensing element."],
      ["air-data-interface", "Air-data signal interface", "electronics", "34", "Illustrates conversion and routing of air-data sensor signals."],
      ["sensor-loom", "Air-data sensor wiring loom", "harness", "92", "Bundles probe-heating and sensing connections."],
    ],
  },
  {
    id: "door-evacuation", label: "23 / Door & evacuation equipment", system: "Cabin systems",
    origin: [10.9, .2, -.9], offset: [2.7, 3.5, -4], items: [
      ["slide-pack", "Evacuation slide container", "slide-pack", "25", "A folded-pack enclosure illustrates stowage of evacuation equipment."],
      ["inflation-bottle", "Slide inflation gas cylinder", "vessel", "25", "Represents stored gas for an evacuation inflation system."],
      ["inflation-valve", "Slide inflation control valve", "valve", "25", "Illustrates release of gas into an inflation path."],
      ["door-latch", "Passenger door latch mechanism", "latch", "52", "Shows a hook, pivot and striker in a representative door-retention mechanism."],
      ["door-damper", "Passenger door movement damper", "actuator", "52", "Illustrates controlled resistance during door movement."],
      ["door-armed-sensor", "Door arming position sensor", "sensor", "52", "Reports the position of a representative arming mechanism."],
      ["door-service-cover", "Door mechanism access cover", "hatch", "52", "Covers a representative door-service opening."],
      ["door-signal-loom", "Door indication wiring harness", "harness", "92", "Routes door-position indication signals."],
    ],
  },
  {
    id: "oxygen-distribution", label: "24 / Oxygen supply & regulation", system: "Cabin systems",
    origin: [8.7, -.4, -.7], offset: [2, -2.2, -4.6], items: [
      ["supply-cylinder", "Oxygen supply pressure vessel", "vessel", "35", "Represents a stored-gas supply vessel."],
      ["pressure-regulator", "Oxygen pressure regulator", "valve", "35", "Illustrates reduction of stored-gas pressure for a supply path."],
      ["distribution-block", "Oxygen distribution block", "manifold", "35", "Groups representative regulated supply connections."],
      ["supply-shutoff", "Oxygen supply isolation valve", "valve", "35", "Illustrates isolation of a regulated gas supply."],
      ["pressure-sender", "Oxygen pressure indication sender", "sensor", "35", "Reports pressure in the representative supply circuit."],
      ["service-port", "Oxygen service connection panel", "hatch", "35", "Illustrates access to a gas-service connection."],
      ["supply-monitor", "Oxygen supply monitor", "electronics", "35", "Illustrates monitoring of supply status."],
      ["indication-loom", "Oxygen indication harness", "harness", "92", "Routes representative supply-monitoring signals."],
    ],
  },
  {
    id: "center-fuel", label: "25 / Center fuel management", system: "Fuel system",
    origin: [.8, -.65, 0], offset: [0, 3.7, 2.7], items: [
      ["crossfeed", "Fuel crossfeed control valve", "valve", "28", "Illustrates a controlled connection between fuel feed paths."],
      ["transfer-pump", "Center fuel transfer pump", "pump", "28", "Represents powered transfer from a central fuel volume."],
      ["feed-manifold", "Center fuel feed manifold", "manifold", "28", "Groups representative fuel-feed branches."],
      ["quantity-interface", "Fuel quantity signal interface", "electronics", "28", "Processes representative tank measurement signals."],
      ["refuel-controller", "Refueling control interface", "electronics", "28", "Illustrates control and indication for a refueling path."],
      ["high-level", "Center fuel high-level sensor", "sensor", "28", "Detects a representative fuel-level threshold."],
      ["drain-valve", "Center fuel drain valve", "valve", "28", "Illustrates a controlled drain connection."],
      ["tank-access", "Center tank inspection cover", "hatch", "28", "Shows a removable access cover for a representative tank volume."],
    ],
  },
  {
    id: "fire-detection", label: "26 / Fire detection & isolation", system: "Propulsion",
    origin: [2.5, -.8, -1.1], offset: [1.5, -2.5, -5.1], items: [
      ["fire-controller", "Fire detection control unit", "electronics", "26", "Illustrates processing of fire-zone detection signals."],
      ["detector-a", "Fire detection loop interface A", "sensor", "26", "Represents a connection to a monitored fire-detection channel."],
      ["detector-b", "Fire detection loop interface B", "sensor", "26", "Represents a separate detection channel interface."],
      ["agent-manifold", "Fire agent distribution manifold", "manifold", "26", "Illustrates branching of an extinguishing-agent supply."],
      ["discharge-switch", "Agent discharge pressure switch", "sensor", "26", "Reports a representative discharge-pressure event."],
      ["fuel-isolation", "Fire-zone fuel isolation valve", "valve", "28", "Illustrates isolation of fuel entering a protected zone."],
      ["fire-panel", "Fire warning interface panel", "console", "26", "Groups representative warning and fire-system controls."],
      ["fire-harness", "Fire detection wiring bundle", "harness", "92", "Routes representative protected-zone detection signals."],
    ],
  },
  {
    id: "pressure-safety", label: "27 / Cabin pressure safety", system: "Air and environmental",
    origin: [-10.6, -.5, .6], offset: [-3.4, -2.5, 3.7], items: [
      ["relief-valve", "Cabin positive-pressure relief valve", "valve", "21", "Illustrates a path that limits excessive cabin-to-ambient pressure difference."],
      ["negative-relief", "Cabin negative-pressure relief valve", "valve", "21", "Illustrates a path that limits excessive external-to-cabin pressure difference."],
      ["pressure-transmitter", "Cabin differential-pressure transmitter", "sensor", "21", "Reports cabin pressure relative to an external reference."],
      ["outflow-drive", "Outflow valve drive mechanism", "gearbox", "21", "Illustrates movement of an exhaust-airflow control element."],
      ["pressure-interface", "Pressure safety monitoring unit", "electronics", "21", "Illustrates monitoring of cabin-pressure safety signals."],
      ["reference-manifold", "Pressure reference manifold", "manifold", "21", "Groups representative pneumatic reference connections."],
      ["exhaust-duct", "Cabin exhaust duct section", "duct", "21", "Represents a controlled cabin-air discharge path."],
      ["pressure-loom", "Pressure control wiring harness", "harness", "92", "Connects representative pressure-control equipment."],
    ],
  },
];

export const ADDITIONAL_PARTS: SubsystemPartDefinition[] = ADDITIONAL_SUBSYSTEMS.flatMap(subsystem =>
  subsystem.items.map(([id, name, geometry, ata, description], index) => {
    const column = index % 4, row = Math.floor(index / 4);
    return {
      id: `${subsystem.id}-${id}`, name, geometry, ata, system: subsystem.system, assemblyId: subsystem.id,
      assemblyName: subsystem.label.replace(/^\d+ \/ /, ""),
      position: [subsystem.origin[0] - column * .66, subsystem.origin[1] + row * .42, subsystem.origin[2]] as XYZ,
      offset: [(1.5 - column) * .85, .65 + row * 1.1, row ? -.9 : .9] as XYZ,
      description: `${description} Original educational geometry; layout, dimensions and quantities are representative.`,
    };
  })
);
