import type { ComponentOccurrence } from "./types";

/** Original illustration metadata; no maintenance quantities or market prices are asserted. */
export const COMPONENT_GUIDE: Record<string, { ata: string; cue: string }> = {
  "Primary structure": { ata: "51–57", cue: "Fuselage, wings and tail" },
  "Propulsion": { ata: "71–80", cue: "Nacelles, fans and engine cores" },
  "Cabin systems": { ata: "25", cue: "Seats, floor and cabin furnishings" },
  "Flight controls": { ata: "27", cue: "Wing and tail control surfaces" },
  "Landing gear": { ata: "32", cue: "Nose gear and undercarriage" },
  "Main landing gear assembly": { ata: "32", cue: "Main struts and paired wheels" },
  "Fuel system": { ata: "28", cue: "Illustrative tank volumes" },
  "Hydraulics": { ata: "29", cue: "Reservoirs and schematic lines" },
  "Electrical power": { ata: "24", cue: "Distribution and equipment modules" },
  "Avionics": { ata: "22 / 23 / 34", cue: "Forward equipment bay" },
  "Air and environmental": { ata: "21 / 36", cue: "Air conditioning and ducting" },
};

const descriptions: Record<string, string> = {
  "Primary structure": "The fuselage, wings and tail carry aerodynamic, cabin and landing loads. The separated outer shell reveals the simplified cabin and equipment inside.",
  "Propulsion": "Two underwing turbofan installations provide thrust. The illustration separates the nacelles, fan faces and simplified cores to make their arrangement visible; it does not represent a specific engine build.",
  "Cabin systems": "A simplified single-aisle cabin shows seating, a floor and cabin furnishings. The seat layout is illustrative and does not reproduce a Delta seat map.",
  "Flight controls": "Movable surfaces on the wings and tail control the aircraft. The model highlights representative surfaces, not the full actuator and linkage installation.",
  "Landing gear": "The undercarriage supports the aircraft on the ground. The model shows a nose gear and two main gear stations with simplified struts and wheels.",
  "Main landing gear assembly": "The two main gear stations carry much of the ground load. Paired wheels, axles and struts are drawn as illustrative assemblies.",
  "Fuel system": "Fuel is stored and managed through wing and center sections. Colored volumes identify representative storage areas rather than exact tank boundaries.",
  "Hydraulics": "Hydraulic power serves aircraft mechanisms including flight controls and landing gear. Reservoirs and routing are schematic, with no service-line detail.",
  "Electrical power": "Generation and distribution equipment supplies aircraft systems. The visible modules indicate functional equipment groups, not specific replaceable units.",
  "Avionics": "Navigation, communication and flight-management equipment is represented in the forward equipment area. Individual hardware and installation details are not modeled.",
  "Air and environmental": "Air conditioning, ventilation and pressurization support the cabin environment. The visible ducting and equipment are simplified functional illustrations.",
};

export const LOCAL_COMPONENTS: ComponentOccurrence[] = Object.entries(COMPONENT_GUIDE).map(([name, guide], index) => ({
  id: `illustration-a320-${index + 1}`,
  parent_occurrence_id: name === "Main landing gear assembly" ? "illustration-a320-5" : null,
  canonical_name: name,
  position_label: guide.cue,
  description: descriptions[name],
  quantity: null,
  quantity_status: "unknown",
  fidelity: "original_illustration",
}));
