CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manufacturers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_name text NOT NULL,
    aliases jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_manufacturers_canonical_name
    ON manufacturers (canonical_name);

CREATE TABLE IF NOT EXISTS aircraft_families (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manufacturer_id uuid REFERENCES manufacturers(id),
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (manufacturer_id, name)
);

CREATE TABLE IF NOT EXISTS aircraft_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id uuid NOT NULL REFERENCES aircraft_families(id),
    designation text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (family_id, designation)
);

CREATE TABLE IF NOT EXISTS configuration_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id uuid NOT NULL REFERENCES aircraft_variants(id),
    revision integer NOT NULL CHECK (revision > 0),
    status text NOT NULL CHECK (status IN ('draft', 'review', 'published', 'retired')),
    attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
    unknown_attributes jsonb NOT NULL DEFAULT '[]'::jsonb,
    as_of_date date,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (variant_id, revision)
);

CREATE TABLE IF NOT EXISTS component_concepts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_name text NOT NULL,
    aliases jsonb NOT NULL DEFAULT '[]'::jsonb,
    description text,
    editorial_status text NOT NULL DEFAULT 'draft'
        CHECK (editorial_status IN ('draft', 'review', 'published', 'retired')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_component_concepts_canonical_name
    ON component_concepts (canonical_name);

CREATE TABLE IF NOT EXISTS component_occurrences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_revision_id uuid NOT NULL REFERENCES configuration_revisions(id),
    concept_id uuid NOT NULL REFERENCES component_concepts(id),
    parent_occurrence_id uuid REFERENCES component_occurrences(id),
    position_label text,
    quantity numeric(12, 3),
    quantity_status text NOT NULL DEFAULT 'unknown'
        CHECK (quantity_status IN ('known', 'unknown', 'not_applicable', 'grouped')),
    fidelity text NOT NULL DEFAULT 'approximate_placement'
        CHECK (fidelity IN ('reference_accurate', 'approximate_placement', 'schematic', 'grouped', 'unmapped')),
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (quantity IS NULL OR quantity >= 0)
);

CREATE TABLE IF NOT EXISTS part_definitions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manufacturer_id uuid NOT NULL REFERENCES manufacturers(id),
    exact_part_number text NOT NULL,
    display_name text,
    category text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (manufacturer_id, exact_part_number)
);

CREATE TABLE IF NOT EXISTS applicability_assertions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id uuid NOT NULL REFERENCES part_definitions(id),
    occurrence_id uuid NOT NULL REFERENCES component_occurrences(id),
    result text NOT NULL CHECK (result IN ('supported', 'unsupported', 'conditional', 'unknown')),
    conditions jsonb NOT NULL DEFAULT '{}'::jsonb,
    source_locator text,
    review_status text NOT NULL DEFAULT 'pending'
        CHECK (review_status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    source_type text NOT NULL,
    official_domain text,
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'paused', 'disabled')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS seller_offers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid NOT NULL REFERENCES sources(id),
    part_id uuid NOT NULL REFERENCES part_definitions(id),
    underlying_seller text,
    source_listing_id text,
    canonical_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (source_id, source_listing_id)
);

CREATE TABLE IF NOT EXISTS offer_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id uuid NOT NULL REFERENCES seller_offers(id),
    revision integer NOT NULL CHECK (revision > 0),
    condition text,
    price_kind text NOT NULL CHECK (price_kind IN ('asking', 'quote', 'transaction', 'service', 'unknown')),
    sale_basis text NOT NULL CHECK (sale_basis IN ('outright', 'exchange', 'repair', 'lease', 'lot', 'unknown')),
    amount numeric(18, 4),
    currency char(3),
    unit text,
    quantity numeric(12, 3),
    core_deposit numeric(18, 4),
    observed_at timestamptz NOT NULL,
    valid_until timestamptz,
    evidence_locator text,
    review_status text NOT NULL DEFAULT 'pending'
        CHECK (review_status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (offer_id, revision),
    CHECK (amount IS NULL OR amount > 0),
    CHECK (quantity IS NULL OR quantity > 0),
    CHECK (core_deposit IS NULL OR core_deposit >= 0)
);

CREATE INDEX IF NOT EXISTS idx_occurrences_configuration
    ON component_occurrences(configuration_revision_id, parent_occurrence_id);
CREATE INDEX IF NOT EXISTS idx_parts_number
    ON part_definitions(manufacturer_id, exact_part_number);
CREATE INDEX IF NOT EXISTS idx_applicability_occurrence
    ON applicability_assertions(occurrence_id, result, review_status);
CREATE INDEX IF NOT EXISTS idx_offer_revisions_cohort
    ON offer_revisions(offer_id, condition, price_kind, sale_basis, observed_at DESC);

INSERT INTO schema_migrations (version)
VALUES ('001_initial')
ON CONFLICT (version) DO NOTHING;

-- Small reference record for local development. This is a placeholder reference,
-- not a complete aircraft bill of materials or a verified production dataset.
INSERT INTO manufacturers (canonical_name)
VALUES ('Airbus')
ON CONFLICT (canonical_name) DO NOTHING;

INSERT INTO aircraft_families (manufacturer_id, name, description)
SELECT id, 'A320', 'Commercial passenger-jet reference family (local development seed)'
FROM manufacturers
WHERE canonical_name = 'Airbus'
ON CONFLICT (manufacturer_id, name) DO NOTHING;

INSERT INTO aircraft_variants (family_id, designation)
SELECT id, 'A320ceo'
FROM aircraft_families
WHERE name = 'A320'
ON CONFLICT (family_id, designation) DO NOTHING;

INSERT INTO configuration_revisions (
    variant_id, revision, status, attributes, unknown_attributes, as_of_date
)
SELECT
    id, 1, 'published',
    '{"reference_status":"representative","engine_option":"unknown"}'::jsonb,
    '["engine_option","airframe_serial","cabin_layout"]'::jsonb,
    CURRENT_DATE
FROM aircraft_variants
WHERE designation = 'A320ceo'
ON CONFLICT (variant_id, revision) DO NOTHING;

-- Minimal educational anatomy seed. These occurrences are intentionally
-- unpriced and do not claim a complete or approved aircraft configuration.
INSERT INTO component_concepts (canonical_name, description, editorial_status)
VALUES
    ('Landing gear', 'Primary landing and ground-support system (local development seed)', 'published'),
    ('Main landing gear assembly', 'Simplified main landing-gear occurrence for viewer development', 'published'),
    ('Wheel and brake assembly', 'Simplified wheel and brake occurrence for viewer development', 'published')
ON CONFLICT (canonical_name) DO NOTHING;

INSERT INTO component_occurrences (
    configuration_revision_id, concept_id, position_label, quantity, quantity_status, fidelity
)
SELECT cr.id, cc.id, 'main gear system', 1, 'known', 'schematic'
FROM configuration_revisions cr
JOIN aircraft_variants av ON av.id = cr.variant_id
JOIN component_concepts cc ON cc.canonical_name = 'Landing gear'
WHERE av.designation = 'A320ceo' AND cr.revision = 1
  AND NOT EXISTS (
      SELECT 1 FROM component_occurrences co
      WHERE co.configuration_revision_id = cr.id AND co.concept_id = cc.id
  );

INSERT INTO component_occurrences (
    configuration_revision_id, concept_id, parent_occurrence_id,
    position_label, quantity, quantity_status, fidelity
)
SELECT cr.id, cc.id, parent.id, 'left and right main gear', 2, 'grouped', 'grouped'
FROM configuration_revisions cr
JOIN aircraft_variants av ON av.id = cr.variant_id
JOIN component_concepts cc ON cc.canonical_name = 'Main landing gear assembly'
JOIN component_concepts parent_cc ON parent_cc.canonical_name = 'Landing gear'
JOIN component_occurrences parent
  ON parent.configuration_revision_id = cr.id AND parent.concept_id = parent_cc.id
WHERE av.designation = 'A320ceo' AND cr.revision = 1
  AND NOT EXISTS (
      SELECT 1 FROM component_occurrences co
      WHERE co.configuration_revision_id = cr.id AND co.concept_id = cc.id
  );
