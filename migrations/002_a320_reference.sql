-- A320 specification baseline. This is a dimensional and systems reference,
-- not a tail-specific bill of materials or a maintenance configuration.
UPDATE configuration_revisions
SET attributes = attributes || '{
  "reference_status":"specification_based_schematic",
  "aircraft_family":"Airbus A320",
  "baseline":"A320-200/A320neo dimensional envelope",
  "length_m":37.57,
  "height_m":11.76,
  "fuselage_diameter_m":3.95,
  "cabin_width_m":3.70,
  "wing_span_m":35.80,
  "propulsion":"twin underwing engines",
  "flight_controls":"digital fly-by-wire",
  "engine_option":"unknown"
}'::jsonb,
unknown_attributes = '["engine_option","airframe_serial","cabin_layout","wingtip_device","airline_modifications"]'::jsonb
WHERE revision = 1
  AND variant_id IN (SELECT id FROM aircraft_variants WHERE designation = 'A320ceo');

INSERT INTO schema_migrations (version)
VALUES ('002_a320_reference')
ON CONFLICT (version) DO NOTHING;

INSERT INTO component_concepts (canonical_name, description, editorial_status)
VALUES
    ('Propulsion', 'Twin underwing engine installation; exact engine option is configuration-dependent', 'published'),
    ('Flight controls', 'Digital fly-by-wire control surfaces and actuators', 'published'),
    ('Electrical power', 'Aircraft electrical generation, distribution, and conversion', 'published'),
    ('Hydraulics', 'Hydraulic generation, storage, and distribution', 'published'),
    ('Fuel system', 'Fuel storage, transfer, indication, and feed', 'published'),
    ('Avionics', 'Flight management, navigation, communication, and display systems', 'published'),
    ('Cabin systems', 'Passenger cabin furnishing, lighting, galleys, and lavatories', 'published'),
    ('Air and environmental', 'Pressurization, air conditioning, ventilation, and bleed-air functions', 'published'),
    ('Primary structure', 'Fuselage, wing, empennage, and structural load paths', 'published')
ON CONFLICT (canonical_name) DO NOTHING;

WITH reference_components(name, position_label, quantity, quantity_status, fidelity) AS (
    VALUES
        ('Propulsion', 'left and right underwing engine stations', 2::numeric, 'known', 'schematic'),
        ('Flight controls', 'wing and tail control surfaces', 1::numeric, 'grouped', 'grouped'),
        ('Electrical power', 'equipment bays and distribution network', 1::numeric, 'unknown', 'schematic'),
        ('Hydraulics', 'distributed aircraft hydraulic network', 1::numeric, 'unknown', 'schematic'),
        ('Fuel system', 'wing and center fuel volumes', 1::numeric, 'unknown', 'schematic'),
        ('Avionics', 'forward and equipment-bay avionics', 1::numeric, 'unknown', 'schematic'),
        ('Cabin systems', 'single-aisle passenger cabin', 1::numeric, 'unknown', 'approximate_placement'),
        ('Air and environmental', 'fuselage environmental-control zones', 1::numeric, 'unknown', 'schematic'),
        ('Primary structure', 'fuselage, wing, and empennage structure', 1::numeric, 'known', 'schematic')
)
INSERT INTO component_occurrences (
    configuration_revision_id, concept_id, position_label, quantity, quantity_status, fidelity
)
SELECT cr.id, cc.id, v.position_label, v.quantity, v.quantity_status, v.fidelity
FROM configuration_revisions cr
JOIN aircraft_variants av ON av.id = cr.variant_id
JOIN reference_components v ON TRUE
JOIN component_concepts cc ON cc.canonical_name = v.name
WHERE av.designation = 'A320ceo' AND cr.revision = 1
  AND NOT EXISTS (
      SELECT 1 FROM component_occurrences existing
      WHERE existing.configuration_revision_id = cr.id AND existing.concept_id = cc.id
  );
