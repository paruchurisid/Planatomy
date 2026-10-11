import { ADDITIONAL_PARTS } from "./subsystemExpansion";

export type SubsystemPartDefinition = {
  id: string;
  name: string;
  system: string;
  assemblyId: string;
  assemblyName?: string;
  description: string;
  ata: string;
  geometry?: "pump" | "valve" | "vessel" | "electronics" | "actuator" | "gearbox" | "radiator" | "duct" | "sensor" | "display" | "frame" | "seat" | "console" | "antenna" | "hatch" | "turbomachine" | "harness" | "rib" | "pedals" | "ram-turbine" | "latch" | "manifold" | "probe" | "slide-pack";
  position: [number, number, number];
  offset: [number, number, number];
};

// Original educational geometry. Locations and quantities are representative, not
// a maintenance manual, an airline configuration, or a catalogue of approved parts.
export const SUBSYSTEM_PARTS: SubsystemPartDefinition[] = [];

function part(id: string, name: string, system: string, assemblyId: string, ata: string,
  position: SubsystemPartDefinition["position"], offset: SubsystemPartDefinition["offset"], description: string) {
  SUBSYSTEM_PARTS.push({ id, name, system, assemblyId, ata, position, offset, description });
}

for (const side of [-1, 1]) {
  const suffix = side > 0 ? "port" : "starboard";
  const label = side > 0 ? "Port" : "Starboard";
  const engineZ = side * 5.4;
  const engine = (id: string, name: string, pos: SubsystemPartDefinition["position"], offset: SubsystemPartDefinition["offset"], description: string, ata = "72") =>
    part(`${id}-${suffix}`, `${label} ${name}`, "Propulsion", `core-${suffix}`, ata, pos, offset, description);
  engine("compressor", "compressor stages", [3.25, -1.65, engineZ], [1.45, .50, 0], "Successive rotating and stationary stages raise air pressure before combustion. The visible blade stack is a representative cutaway.");
  engine("combustor", "annular combustor", [2.40, -1.65, engineZ], [.30, 1.25, 0], "An annular chamber mixes fuel and compressed air. Small external stubs illustrate the fuel-injection ring; this is not an engine-specific drawing.");
  engine("turbine", "turbine stages", [1.67, -1.65, engineZ], [-.85, .50, 0], "Hot gas drives turbine stages connected to the compressor and fan through internal shafts. The representative discs separate from the combustor for inspection.");
  engine("exhaust", "core exhaust cone", [.93, -1.65, engineZ], [-1.8, -.15, 0], "The tapered exhaust cone guides the core gas stream. This original shape illustrates the flow path rather than a certified nozzle profile.");
  engine("accessory-gearbox", "accessory gearbox", [2.82, -2.19, engineZ + side * .20], [.1, -1.15, side * .8], "The accessory gearbox transfers shaft power to engine accessories. Housing ribs and drive pads are illustrative.", "72");
  engine("engine-oil-tank", "oil reservoir", [3.55, -2.11, engineZ - side * .32], [1.1, -.75, -side * 1.1], "A reservoir supplies oil for bearing lubrication and cooling. Filler neck, level band and connection ports are representative.", "79");
  engine("air-starter", "pneumatic starter", [2.70, -1.97, engineZ - side * .52], [-.5, -.70, -side * 1.4], "A pneumatic starter converts compressed-air energy into shaft rotation during engine start. The cylinder and reduction housing show its basic arrangement.", "80");

  const gearZ = side * 2.6;
  const main = (id: string, name: string, pos: SubsystemPartDefinition["position"], offset: SubsystemPartDefinition["offset"], description: string) =>
    part(`${id}-${suffix}`, `${label} ${name}`, "Main landing gear assembly", `main-gear-${suffix}`, "32", pos, offset, description);
  main("main-shock-strut", "main-gear shock strut", [-1.2, -2.24, gearZ], [0, .7, 0], "A telescoping oleo strut absorbs landing loads. The torque links and drag brace are simplified as part of this assembly.");
  main("main-wheel-inboard", "inboard main wheel", [-1.2, -3.04, gearZ - side * .26], [0, -.25, -side * 1.1], "A tire, wheel hub and through axle illustrate one main-wheel assembly. Tire dimensions are illustrative.");
  main("main-wheel-outboard", "outboard main wheel", [-1.2, -3.04, gearZ + side * .26], [0, -.25, side * 1.1], "A second main-wheel assembly separates along the axle, exposing the hub and brake area.");
  main("main-brake-stack", "representative brake pack", [-1.2, -3.04, gearZ + side * .12], [.9, -.5, side * .6], "Alternating rotor and stator discs absorb braking energy. One representative brake stack is exposed here; the model is not a full wheel/brake inventory.");
  main("gear-retract-actuator", "retraction actuator", [-1.52, -1.55, gearZ + side * .17], [-.9, .2, side * .7], "A hydraulic cylinder retracts and extends the gear through its linkage. This view simplifies the uplock, downlock and attachment geometry.");

  const fuel = (id: string, name: string, pos: SubsystemPartDefinition["position"], offset: SubsystemPartDefinition["offset"], description: string) =>
    part(`${id}-${suffix}`, `${label} ${name}`, "Fuel system", `fuel-${suffix}`, "28", pos, offset, description);
  fuel("fuel-boost-pump", "fuel boost pump", [-.20, -.36, side * 3.0], [1, .9, side * .4], "An electric boost pump moves fuel from the tank toward the engine feed line. The motor body, inlet and outlet are individually shaped.");
  fuel("fuel-isolation-valve", "fuel feed valve", [-.86, -.30, side * 4.2], [.1, 1.25, side * .5], "An actuated valve controls the engine feed path. The quarter-turn housing is a representative functional shape.");
  fuel("fuel-level-probe", "fuel quantity probe", [-2.30, -.10, side * 7.2], [-.5, 1.55, side * .6], "A representative capacitance probe helps estimate tank fuel quantity. Real tanks use multiple probes with calibration specific to their geometry.");
  fuel("fuel-filter", "representative fuel strainer", [-1.45, -.28, side * 5.6], [-.8, .7, -side * .5], "A strainer illustrates removal of debris in a fuel path. Its displayed location is educational, not an A320 maintenance location claim.");

  const controls = (id: string, name: string, pos: SubsystemPartDefinition["position"], offset: SubsystemPartDefinition["offset"], description: string) =>
    part(`${id}-${suffix}`, `${label} ${name}`, "Flight controls", `controls-${suffix}`, "27", pos, offset, description);
  controls("aileron-actuator", "aileron servo actuator", [-5.80, .19, side * 13.6], [.6, 1.0, side * .8], "A hydraulic servo actuator converts a flight-control command into aileron motion. Ports, cylinder and rod are shown as a simplified unit.");
  controls("flap-screwjack", "flap drive screwjack", [-4.5, -.2, side * 6.0], [1, .8, side * .1], "A geared screwjack converts rotary drive into controlled flap movement. The exposed helical collar is a visual guide to the drive principle.");
  controls("flap-drive-gearbox", "flap drive gearbox", [-5.15, -.10, side * 9.5], [-.5, .8, side * .4], "A compact gearbox transmits torque through the flap drive system. This representative housing is separate from the wing surface.");
}

part("nose-shock-strut", "Nose-gear shock strut", "Landing gear", "nose-gear", "32", [13.4, -2.25, 0], [0, .65, 0], "The nose-gear oleo strut absorbs ground loads. Torque links and a simplified drag brace are included in this selectable unit.");
part("nose-wheel-port", "Port nose wheel", "Landing gear", "nose-gear", "32", [13.4, -3.04, .23], [0, -.25, .95], "A small tire and wheel hub separate along the nose axle to expose the steering and strut arrangement.");
part("nose-wheel-starboard", "Starboard nose wheel", "Landing gear", "nose-gear", "32", [13.4, -3.04, -.23], [0, -.25, -.95], "The second nose-wheel assembly illustrates the twin-wheel arrangement; the nose wheels are not shown with main-wheel brake packs.");
part("nose-steering-actuator", "Nose steering actuator", "Landing gear", "nose-gear", "32", [13.1, -1.75, .23], [1, .2, .8], "A compact hydraulic actuator illustrates steering input to the nose-gear collar. The actual steering mechanism is simplified.");

for (const [index, circuit] of ["green", "blue", "yellow"].entries()) {
  const z = -.60 + index * .60;
  const label = circuit[0].toUpperCase() + circuit.slice(1);
  part(`hydraulic-reservoir-${circuit}`, `${label} hydraulic reservoir`, "Hydraulics", "hydraulics", "29", [-.8, -.96, z], [.6, .7 + index * .2, (index - 1) * 1.1], `A ${circuit}-coded reservoir represents one of the A320's three hydraulic circuits. This compact teaching layout does not depict actual reservoir installation positions.`);
  part(`hydraulic-pump-${circuit}`, `${label} circuit pump module`, "Hydraulics", "hydraulics", "29", [.24, -1.05, z], [1.4, -.55, (index - 1) * 1.1], "A motor/pump form illustrates pressure generation. Circuit drive sources differ on the real aircraft; this common visual symbol does not claim three identical electric pumps.");
  part(`hydraulic-accumulator-${circuit}`, `${label} hydraulic accumulator`, "Hydraulics", "hydraulics", "29", [-1.82, -.99, z], [-1.1, -.3, (index - 1) * 1.1], "A pressure vessel stores hydraulic energy and damps pressure changes. The gas cap and fluid connection are visible in the separated view.");
}

part("electrical-battery-a", "Representative battery A", "Electrical power", "electrical", "24", [4.2, -1.07, -.43], [-.8, .6, -.9], "A battery enclosure illustrates stored DC power. Top terminals, retaining straps and cooling slots distinguish it from the distribution boxes.");
part("electrical-battery-b", "Representative battery B", "Electrical power", "electrical", "24", [4.2, -1.07, .43], [-.8, .6, .9], "A second representative battery supports the educational two-battery arrangement. Exact type and mounting depend on the aircraft configuration.");
part("electrical-transformer-rectifier", "Transformer rectifier unit", "Electrical power", "electrical", "24", [5.25, -1.1, -.45], [.4, -.7, -.8], "A transformer rectifier converts AC supply into DC. Cooling fins and terminal blocks make the conversion unit visible in the bay.");
part("electrical-bus-panel", "Power distribution panel", "Electrical power", "electrical", "24", [5.25, -1.1, .45], [.4, .85, .8], "Busbars, contactors and protected branches illustrate distribution of power to aircraft loads. Individual bus wiring is not reproduced.");
part("electrical-inverter", "Static inverter", "Electrical power", "electrical", "24", [6.27, -1.05, -.45], [1.1, .4, -.8], "A static inverter illustrates DC-to-AC conversion for a supported electrical load. Its finned enclosure is an original visual abstraction.");
part("electrical-contactor", "Power contactor module", "Electrical power", "electrical", "24", [6.27, -1.04, .43], [1.1, -.65, .8], "High-current contacts switch a power path under electrical control. The two large terminals and coil casing expose the basic function.");

part("avionics-flight-computer", "Flight-control computer", "Avionics", "avionics", "27", [9.25, -.88, -.40], [-1.1, .6, -.8], "A representative removable computer illustrates electronic control processing. The front handle, connectors and cooling slots are simplified.");
part("avionics-navigation-unit", "Inertial / air-data reference unit", "Avionics", "avionics", "34", [10.22, -.88, -.40], [.1, .8, -.8], "A representative reference unit supplies motion and air-data information. This is a functional grouping, not a specific A320 supplier part number.");
part("avionics-radio", "Communications transceiver", "Avionics", "avionics", "23", [11.18, -.88, -.40], [1.1, .6, -.8], "A removable radio transceiver provides an example of aircraft communications equipment. Connector rings and a front handle show its serviceable enclosure.");
part("avionics-data-concentrator", "Data interface unit", "Avionics", "avionics", "31", [9.25, -.88, .40], [-1.1, -.6, .8], "A representative data interface routes signals between systems and indications. The ports illustrate interfaces without specifying an avionics architecture.");
part("avionics-weather-processor", "Weather-radar processor", "Avionics", "avionics", "34", [10.22, -.88, .40], [.1, -.8, .8], "A radar electronics enclosure illustrates signal processing; the nose antenna itself remains outside this representative bay detail.");
part("avionics-cooling-fan", "Avionics ventilation blower", "Avionics", "avionics", "21", [11.18, -.88, .40], [1.1, -.6, .8], "A compact impeller and duct housing illustrate cooling airflow for avionics equipment. Its shown station is an educational arrangement.");

part("air-primary-exchanger", "Primary heat exchanger", "Air and environmental", "air", "21", [-5.30, -1.05, .62], [1.1, .65, .8], "A finned core rejects heat from compressed air. Headers and closely spaced fins illustrate the heat-transfer surface.");
part("air-secondary-exchanger", "Secondary heat exchanger", "Air and environmental", "air", "21", [-6.4, -1.05, .62], [0, .9, .8], "A second finned core illustrates another stage of pack cooling. This is one representative pack flow path, not a complete duplicated installation.");
part("air-cycle-machine", "Air-cycle machine", "Air and environmental", "air", "21", [-6.4, -1.05, -.62], [.1, -.75, -.95], "A compressor/turbine unit uses expansion to cool air for the cabin. The paired housings and shaft are shown as a simplified common-shaft machine.");
part("air-water-separator", "Water separator", "Air and environmental", "air", "21", [-7.55, -1.05, -.62], [-1, -.5, -.8], "A separator removes moisture from the conditioned airflow. The vessel, drain and inlet/outlet ports are modeled for inspection.");
part("air-mixing-manifold", "Cabin mixing manifold", "Air and environmental", "air", "21", [-7.60, -.85, .56], [-1.15, .75, .8], "A manifold illustrates mixing and distribution of supply airflow. The branching outlets represent ducts to cabin zones.");
part("air-trim-valve", "Trim-air valve", "Air and environmental", "air", "21", [-5.25, -1.0, -.62], [1.05, -.4, -.8], "A controlled valve illustrates temperature trimming of a cabin supply branch. Duct size and placement are representative.");

part("cabin-oxygen-module", "Passenger oxygen module", "Cabin systems", "cabin", "35", [2, 1.32, 1.1], [.2, 1.05, .9], "One passenger-service module shows a representative oxygen-generator housing and mask cups. Real installation quantities and activation arrangements vary.");
part("cabin-lighting-module", "Cabin lighting module", "Cabin systems", "cabin", "33", [-1.2, 1.38, -1.1], [0, 1.15, -.9], "An elongated luminaire illustrates overhead cabin lighting and its end connectors. This is a single representative module.");
part("cabin-recirculation-fan", "Cabin recirculation fan", "Cabin systems", "cabin", "21", [-8.75, -.18, -.85], [-.8, .9, -.9], "A blower recirculates cabin air through the ventilation path. Its visible impeller is intended for exploration, not servicing guidance.");
part("cabin-water-pump", "Representative water pump", "Cabin systems", "cabin", "38", [-9.55, -.17, .8], [-1, .5, .8], "A small motor and pump body illustrate a cabin water-service component. The station and surrounding plumbing are simplified.");
part("cabin-galley-heater", "Galley heating unit", "Cabin systems", "cabin", "25", [11.25, .55, 1.1], [1, .9, .8], "A vented heating enclosure represents one removable galley appliance. It does not describe a specific Delta cabin fit-out.");

part("structure-floor-crossbeam", "Representative floor crossbeam", "Primary structure", "airframe", "53", [3.1, -.40, 0], [.1, 1.1, 0], "An I-section floor beam carries cabin loads across the fuselage. One beam is shown in detail among the simplified surrounding frames.");
part("structure-crown-stringer", "Representative crown stringer", "Primary structure", "airframe", "53", [5.4, 1.7, .30], [.3, 1.1, .75], "A longitudinal stiffener supports the skin between fuselage frames. This short segment shows a channel section and fastening pads.");
part("structure-wing-spar-port", "Port wing spar segment", "Primary structure", "wing-port", "57", [-1.60, -.38, 6.2], [0, 1.2, 1], "An I-section spar segment illustrates a principal wing load path. Only a local segment is modeled; it is not a structural sizing model.");
part("structure-wing-spar-starboard", "Starboard wing spar segment", "Primary structure", "wing-starboard", "57", [-1.60, -.38, -6.2], [0, 1.2, -1], "The mirrored representative spar segment exposes a web and upper/lower caps inside the wing.");
part("structure-tail-actuator-fitting", "Tail attachment fitting", "Primary structure", "empennage", "55", [-14.35, 1.35, 0], [.9, .8, .7], "A machined lug and bolted plate illustrate an attachment at the tail structure. Its shape and location are conceptual.");

// Revision 03: additional functional modules. Each entry owns its selection,
// geometry and spread transform; repeated stations are explicit illustrated units.
type Detail = [string, NonNullable<SubsystemPartDefinition["geometry"]>, string, string];
function modules(prefix: string, system: string, assemblyId: string, origin: [number, number, number], details: Detail[], side = 1) {
  details.forEach(([name, geometry, ata, description], index) => {
    const column = index % 4, row = Math.floor(index / 4);
    SUBSYSTEM_PARTS.push({
      id: `${prefix}-${index + 1}`, name, system, assemblyId, geometry, ata,
      position: [origin[0] - column * .82, origin[1] + row * .48, origin[2]],
      offset: [(1.5 - column) * .75, .8 + row * .8, side * (1 + row * .55)],
      description: `${description} Original functional illustration; installation position and quantity are representative.`,
    });
  });
}
for (const side of [-1, 1]) {
  const suffix = side > 0 ? "port" : "starboard", label = side > 0 ? "Port" : "Starboard";
  const mirrored = (items: Detail[]): Detail[] => items.map(([name, ...rest]) => [`${label} ${name}`, ...rest]);
  modules(`engine-detail-${suffix}`, "Propulsion", `core-${suffix}`, [3.8, -1.1, side * 5.4], mirrored([
    ["fuel metering unit", "valve", "73", "Meters fuel delivered to the combustion system."],
    ["engine fuel pump", "pump", "73", "Raises fuel pressure for the engine fuel circuit."],
    ["oil scavenge pump", "pump", "79", "Returns oil from bearing sumps to the lubrication circuit."],
    ["fuel-oil heat exchanger", "radiator", "79", "Transfers heat between oil and fuel streams."],
    ["engine control unit", "electronics", "73", "Processes engine control inputs and commands."],
    ["ignition exciter", "electronics", "74", "Supplies ignition energy during starting and relight."],
    ["bleed regulation valve", "valve", "36", "Regulates a compressed-air extraction path."],
    ["vibration sensor", "sensor", "77", "Measures vibration for engine monitoring."],
    ["oil pressure transmitter", "sensor", "79", "Converts oil pressure into an indication signal."],
    ["reverser actuator", "actuator", "78", "Illustrates the drive that moves thrust-reverser hardware."],
    ["fire extinguishing bottle", "vessel", "26", "Stores extinguishing agent for an engine fire zone."],
    ["starter air duct", "duct", "80", "Routes compressed air toward the starter."],
  ]), side);
  modules(`control-detail-${suffix}`, "Flight controls", `controls-${suffix}`, [-3, .12, side * 7.6], mirrored([
    ["spoiler servo actuator", "actuator", "27", "Moves a spoiler panel under hydraulic control."],
    ["slat drive gearbox", "gearbox", "27", "Transfers rotary drive to a leading-edge device."],
    ["slat position sensor", "sensor", "27", "Reports leading-edge device position."],
    ["flap position sensor", "sensor", "27", "Reports trailing-edge flap position."],
    ["flap hydraulic motor", "pump", "27", "Converts hydraulic pressure into rotary drive."],
    ["wing-tip brake module", "gearbox", "27", "Illustrates a device that arrests unwanted high-lift transmission motion."],
  ]), side);
  modules(`fuel-detail-${suffix}`, "Fuel system", `fuel-${suffix}`, [1.2, -.25, side * 5.5], mirrored([
    ["standby boost pump", "pump", "28", "Illustrates a redundant tank pumping path."],
    ["refuel shutoff valve", "valve", "28", "Controls fuel admission during refueling."],
    ["tank vent duct", "duct", "28", "Provides a ventilation path for the tank volume."],
    ["fuel temperature sensor", "sensor", "28", "Measures fuel temperature."],
    ["feed pressure switch", "sensor", "28", "Detects pressure in a fuel supply path."],
    ["transfer valve", "valve", "28", "Controls a representative fuel transfer path."],
  ]), side);
  modules(`gear-detail-${suffix}`, "Main landing gear assembly", `main-gear-${suffix}`, [-.5, -1.9, side * 2.6], mirrored([
    ["uplock mechanism", "gearbox", "32", "Retains the retracted gear through a locking mechanism."],
    ["downlock actuator", "actuator", "32", "Illustrates the actuator associated with gear locking."],
    ["brake servo valve", "valve", "32", "Modulates hydraulic pressure delivered to the brakes."],
    ["wheel speed transducer", "sensor", "32", "Provides wheel rotation information for braking control."],
    ["gear proximity sensor", "sensor", "32", "Detects a target associated with gear position."],
  ]), side);
}
modules("flight-deck", "Avionics", "nose", [15.6, .32, -.65], [
  ["Captain primary flight display", "display", "31", "Presents primary attitude and flight information."],
  ["Captain navigation display", "display", "34", "Presents navigation and route information."],
  ["First officer primary flight display", "display", "31", "Presents primary flight information at the second crew station."],
  ["First officer navigation display", "display", "34", "Presents navigation information at the second crew station."],
  ["Engine warning display", "display", "31", "Groups engine indications and warning information."],
  ["System status display", "display", "31", "Presents system diagrams and status information."],
  ["Flight management interface", "electronics", "22", "Provides a crew interface to flight management functions."],
  ["Flight guidance control panel", "electronics", "22", "Illustrates controls for selected flight guidance targets."],
  ["Weather radar antenna drive", "gearbox", "34", "Positions the nose weather-radar antenna."],
  ["Standby flight instrument", "display", "31", "Illustrates an independent backup flight indication."],
  ["Window heat controller", "electronics", "30", "Controls electrical heating of flight-deck glazing."],
  ["Wiper drive motor", "pump", "30", "Drives the windshield wiper linkage."],
]);
modules("power-detail", "Electrical power", "electrical", [7.8, -.6, 0], [
  ["AC distribution unit", "electronics", "24", "Distributes alternating-current power."],
  ["DC distribution unit", "electronics", "24", "Distributes direct-current power."],
  ["Generator control unit", "electronics", "24", "Monitors and controls a generator supply."],
  ["External power contactor", "electronics", "24", "Switches the external ground-power connection."],
  ["Emergency power control unit", "electronics", "24", "Illustrates emergency electrical supply control."],
  ["Battery charge limiter", "electronics", "24", "Controls a battery charging path."],
]);
for (const [i, circuit] of ["green", "blue", "yellow"].entries()) modules(`hydraulic-detail-${circuit}`, "Hydraulics", "hydraulics", [1.4, -.6, (i - 1) * .65], [
  [`${circuit} pressure filter`, "vessel", "29", "Traps contamination in the hydraulic pressure path."],
  [`${circuit} relief valve`, "valve", "29", "Limits excessive hydraulic pressure."],
  [`${circuit} pressure transmitter`, "sensor", "29", "Reports hydraulic circuit pressure."],
  [`${circuit} priority valve`, "valve", "29", "Illustrates pressure-dependent allocation of hydraulic supply."],
], i === 0 ? -1 : 1);
modules("environment-detail", "Air and environmental", "air", [-4.8, -.45, 0], [
  ["Pack flow control valve", "valve", "21", "Regulates supply airflow into a conditioning pack."],
  ["Bleed air precooler", "radiator", "36", "Cools extracted compressed air."],
  ["Cabin outflow valve", "valve", "21", "Meters cabin exhaust airflow for pressure control."],
  ["Cabin pressure controller", "electronics", "21", "Commands cabin pressure regulation."],
  ["Duct temperature sensor", "sensor", "21", "Measures temperature in a conditioned-air duct."],
  ["Zone distribution duct", "duct", "21", "Routes supply air toward a cabin zone."],
  ["Pack bypass valve", "valve", "21", "Modulates a representative bypass airflow path."],
  ["Ozone converter", "vessel", "21", "Illustrates a treatment vessel in an air supply path."],
]);
modules("cabin-detail", "Cabin systems", "cabin", [-7, .6, 0], [
  ["Potable water reservoir", "vessel", "38", "Stores water for cabin services."],
  ["Water isolation valve", "valve", "38", "Isolates a water-service branch."],
  ["Lavatory vacuum generator", "pump", "38", "Illustrates vacuum generation for waste transport."],
  ["Waste collection vessel", "vessel", "38", "Collects waste from cabin services."],
  ["Emergency lighting battery", "electronics", "33", "Stores energy for emergency lighting."],
  ["Cabin announcement amplifier", "electronics", "23", "Amplifies passenger announcement audio."],
  ["Smoke detector", "sensor", "26", "Detects smoke in a monitored cabin-service space."],
  ["Crew oxygen cylinder", "vessel", "35", "Illustrates stored oxygen for a crew supply system."],
]);
modules("nose-gear-detail", "Landing gear", "nose-gear", [14, -1.55, -.3], [
  ["Nose gear uplock", "gearbox", "32", "Retains the nose gear in its retracted position."],
  ["Nose gear position sensor", "sensor", "32", "Reports a gear-position target."],
  ["Steering control valve", "valve", "32", "Meters steering hydraulic flow."],
  ["Nose door actuator", "actuator", "32", "Illustrates hydraulic movement of a gear door."],
]);
for (let station = 0; station < 12; station++) {
  modules(`structure-station-${station}`, "Primary structure", "airframe", [10 - station * 1.75, -.35, 0], [
    [`Floor beam station ${station + 1}`, "frame", "53", "Transfers floor loads across a fuselage station."],
  ], station % 2 ? -1 : 1);
}

// Revision 04: remote equipment gets dedicated assemblies rather than being
// collected in a central bay. Coordinates remain authored study positions.
modules("apu-module", "Propulsion", "apu", [-15.1, -.1, 0], [
  ["APU rotating core", "turbomachine", "49", "A small gas turbine provides auxiliary shaft power."],
  ["APU load compressor", "turbomachine", "49", "Illustrates the compressed-air source for auxiliary pneumatic supply."],
  ["APU accessory gearbox", "gearbox", "49", "Transfers shaft power to auxiliary accessories."],
  ["APU generator", "pump", "49", "Illustrates a rotating electrical generator driven by the auxiliary unit."],
  ["APU electronic controller", "electronics", "49", "Supervises auxiliary-unit operation."],
  ["APU fuel control valve", "valve", "49", "Meters fuel to the auxiliary combustion system."],
  ["APU oil reservoir", "vessel", "49", "Stores lubricant for the auxiliary unit."],
  ["APU oil cooler", "radiator", "49", "Rejects heat from the auxiliary lubrication circuit."],
  ["APU intake door actuator", "actuator", "49", "Moves the auxiliary-unit air intake door."],
  ["APU fire bottle", "vessel", "26", "Stores extinguishing agent for the auxiliary fire zone."],
  ["APU exhaust temperature sensor", "sensor", "49", "Monitors auxiliary exhaust temperature."],
  ["APU pneumatic shutoff valve", "valve", "49", "Controls the auxiliary compressed-air supply."],
]);
modules("deck-hardware", "Avionics", "cockpit-equipment", [15.1, .05, .6], [
  ["Captain seat", "seat", "25", "Shows seat rails, cushions, armrests and restraint straps."],
  ["First officer seat", "seat", "25", "Illustrates a second adjustable crew seat."],
  ["Overhead switch panel", "console", "31", "Groups representative aircraft-system switches and indicators."],
  ["Center pedestal control panel", "console", "31", "Groups representative center-console controls."],
  ["Captain rudder pedals", "pedals", "27", "Provides a foot-operated directional-control interface."],
  ["First officer rudder pedals", "pedals", "27", "Illustrates a second linked pedal interface."],
  ["Audio control panel", "console", "23", "Selects communication and audio sources."],
  ["Radio tuning panel", "console", "23", "Provides radio tuning and selection controls."],
  ["Engine start control panel", "console", "80", "Illustrates the crew interface for engine starting."],
  ["Cockpit wiring loom", "harness", "92", "Bundles electrical connections between flight-deck equipment."],
  ["Flight-deck circuit breaker panel", "console", "24", "Illustrates manually accessible circuit protection."],
  ["Standby compass sensor", "sensor", "34", "Represents a separate heading reference."],
]);
modules("tail-drive", "Flight controls", "tail-controls", [-13.6, .6, 0], [
  ["Rudder servo actuator A", "actuator", "27", "Converts hydraulic pressure into rudder control motion."],
  ["Rudder servo actuator B", "actuator", "27", "Illustrates a separate rudder actuation channel."],
  ["Rudder servo actuator C", "actuator", "27", "Illustrates an additional rudder actuation channel."],
  ["Rudder travel limiter", "gearbox", "27", "Illustrates a mechanism for limiting rudder travel."],
  ["Port elevator actuator", "actuator", "27", "Drives an elevator control surface."],
  ["Starboard elevator actuator", "actuator", "27", "Drives the opposite elevator control surface."],
  ["Stabilizer trim screw drive", "actuator", "27", "Illustrates the linear drive used to set stabilizer incidence."],
  ["Stabilizer trim gearbox", "gearbox", "27", "Transfers rotary drive into the stabilizer adjustment mechanism."],
  ["Rudder position transmitter", "sensor", "27", "Reports rudder position to monitoring equipment."],
  ["Elevator position transmitter", "sensor", "27", "Reports elevator position."],
  ["Stabilizer position transmitter", "sensor", "27", "Reports stabilizer trim position."],
  ["Tail control wiring harness", "harness", "92", "Connects tail-control sensors and electronics."],
]);
modules("cargo-protection", "Cabin systems", "cargo-equipment", [1, -1, .45], [
  ["Forward cargo smoke detector", "sensor", "26", "Monitors a representative forward cargo zone for smoke."],
  ["Aft cargo smoke detector", "sensor", "26", "Monitors a representative aft cargo zone for smoke."],
  ["Cargo extinguishing bottle A", "vessel", "26", "Stores agent for cargo fire suppression."],
  ["Cargo extinguishing bottle B", "vessel", "26", "Illustrates a second suppression-agent vessel."],
  ["Cargo fire distribution valve", "valve", "26", "Illustrates routing of a suppression supply."],
  ["Cargo ventilation isolation valve", "valve", "21", "Isolates a ventilation path."],
  ["Cargo door hydraulic actuator", "actuator", "52", "Illustrates powered movement of a cargo door."],
  ["Cargo door latch drive", "gearbox", "52", "Transmits motion to a door latching mechanism."],
  ["Cargo door lock sensor", "sensor", "52", "Detects a representative locking target."],
  ["Cargo service access panel", "hatch", "52", "Shows a hinged service panel and recessed handle."],
  ["Cargo lighting unit", "electronics", "33", "Represents protected lighting equipment for the hold."],
  ["Cargo detector wiring loom", "harness", "92", "Connects the cargo monitoring components."],
]);
modules("ground-services", "Air and environmental", "service-bay", [8.2, -1.35, 0], [
  ["Ground pneumatic connector", "duct", "36", "Connects a representative external pneumatic supply."],
  ["Ground air isolation valve", "valve", "36", "Isolates the ground-air connection."],
  ["Preconditioned air coupling", "duct", "21", "Illustrates an external conditioned-air connection."],
  ["Ground service access door", "hatch", "52", "Provides access to a service connection bay."],
  ["Pneumatic pressure sensor", "sensor", "36", "Reports pressure in the service supply path."],
  ["Service manifold", "duct", "36", "Illustrates an air distribution connection."],
  ["Service bay drain valve", "valve", "21", "Illustrates drainage of collected moisture."],
  ["Ground air check valve", "valve", "36", "Illustrates a one-way flow device."],
]);
for (const side of [-1, 1]) {
  const suffix = side > 0 ? "port" : "starboard", label = side > 0 ? "Port" : "Starboard";
  for (let station = 0; station < 8; station++) {
    const x = .2 - station * .64, z = side * (3.1 + station * 1.5);
    SUBSYSTEM_PARTS.push({ id: `wing-rib-${suffix}-${station + 1}`, name: `${label} wing rib ${station + 1}`,
      system: "Primary structure", assemblyId: `wing-${suffix}`, ata: "57", geometry: "rib",
      position: [x, -.10 + station * .05, z], offset: [0, 1.1 + station % 2 * .35, side * .65],
      description: "A stiffened transverse rib illustrates transfer of local wing loads into the spar and skin. Geometry and station spacing are original educational artwork." });
  }
  modules(`wing-service-${suffix}`, "Primary structure", `wing-${suffix}`, [-2, .15, side * 8], [
    [`${label} wing inspection panel`, "hatch", "57", "Illustrates removable access to internal wing equipment."],
    [`${label} pylon attachment fitting`, "rib", "54", "Illustrates a stiffened attachment load path."],
    [`${label} leading-edge support rib`, "rib", "57", "Supports a representative leading-edge structure."],
    [`${label} trailing-edge support rib`, "rib", "57", "Supports a representative trailing-edge structure."],
  ], side);
  modules(`wing-electrics-${suffix}`, "Electrical power", "electrical", [3.1, -.5, side * 1.1], [
    [`${label} wing wiring loom`, "harness", "92", "Illustrates bundled wiring for wing equipment."],
    [`${label} navigation light driver`, "electronics", "33", "Supplies a representative external lighting load."],
    [`${label} strobe power supply`, "electronics", "33", "Supplies energy to a representative flashing light."],
    [`${label} wing junction box`, "electronics", "24", "Provides electrical distribution connections."],
  ], side);
  modules(`anti-ice-${suffix}`, "Air and environmental", "air", [-5, -.5, side * 1.35], [
    [`${label} wing anti-ice valve`, "valve", "30", "Controls hot-air supply to an ice-protection path."],
    [`${label} anti-ice supply duct`, "duct", "30", "Routes hot air through a representative ice-protection circuit."],
    [`${label} duct overheat detector`, "sensor", "30", "Detects excessive temperature near an air duct."],
    [`${label} anti-ice pressure switch`, "sensor", "30", "Monitors supply pressure for ice protection."],
  ], side);
}
modules("radio-equipment", "Avionics", "avionics", [11.8, -.4, .95], [
  ["VHF blade antenna", "antenna", "23", "Illustrates a streamlined radio antenna and mounting base."],
  ["Navigation antenna", "antenna", "34", "Illustrates an external navigation receiving element."],
  ["Transponder antenna", "antenna", "34", "Illustrates a radio interface for surveillance responses."],
  ["Emergency locator transmitter", "electronics", "25", "Represents emergency location transmitting equipment."],
  ["Traffic advisory processor", "electronics", "34", "Processes representative traffic surveillance inputs."],
  ["Radio altimeter unit", "electronics", "34", "Processes a radio-based height measurement."],
  ["Flight data recorder", "electronics", "31", "Illustrates a unit that records aircraft parameters."],
  ["Cockpit voice recorder", "electronics", "23", "Illustrates a unit that records flight-deck audio."],
]);

// Crew interfaces follow the two-seat layout, rather than the bay module grid.
const deckPositions: [number, number, number][] = [
  [14.15, -.05, .63], [14.15, -.05, -.63], [14.55, 1.15, 0], [14.45, -.05, 0],
  [15.15, -.3, .63], [15.15, -.3, -.63], [14.05, .2, .1], [14.05, .2, -.22],
  [14.7, .2, 0], [13.8, -.3, 0], [13.55, .6, .8], [15.7, .72, 0],
];
deckPositions.forEach((position, index) => {
  const definition = SUBSYSTEM_PARTS.find(item => item.id === `deck-hardware-${index + 1}`)!;
  definition.position = position;
  definition.offset = [(index % 3 - 1) * 1.1, .5 + Math.floor(index / 3) * .7, index % 2 ? -1.2 : 1.2];
});
for (let index = 0; index < 3; index++) {
  const antenna = SUBSYSTEM_PARTS.find(item => item.id === `radio-equipment-${index + 1}`)!;
  antenna.assemblyId = "external-antennas";
  antenna.position = [8 - index * 5, 2.065, 0];
  antenna.offset = [0, .5 + index * .4, index % 2 ? -.8 : .8];
}

SUBSYSTEM_PARTS.push(...ADDITIONAL_PARTS);
