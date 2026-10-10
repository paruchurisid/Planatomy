export type SubsystemPartDefinition = {
  id: string;
  name: string;
  system: string;
  assemblyId: string;
  description: string;
  ata: string;
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
