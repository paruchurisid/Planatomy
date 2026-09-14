# Aircraft knowledge model

## The three identities

A component concept describes a function, such as a hydraulic pump. A component occurrence describes a position in a particular aircraft reference, such as a particular pump within a particular system. A part definition describes a manufacturer-scoped catalog identity that can be offered commercially. A serialized asset, when supported later, describes one physical instance of that part.

These identities must remain separate. Two visually identical occurrences can use different part definitions. One part definition can occur multiple times on one aircraft. A mesh can depict a whole assembly that contains several priced units. A catalog part can exist without any dedicated geometry.

## Main relationships

| Relationship | Cardinality | Meaning |
| --- | --- | --- |
| Family to variant | One to many | A broad family includes documented variants |
| Variant to reference configuration | One to many | A reference selects or declares unknown configuration attributes |
| Configuration revision to occurrences | One to many | Published anatomy belongs to a fixed reference revision |
| Occurrence to component concept | Many to one | Each occurrence has a primary semantic meaning |
| Occurrence to parent occurrence | Many to zero or one | Physical containment within this reference |
| Concept to functional systems | Many to many | A component can participate in more than one function |
| Occurrence to mesh nodes | Many to many | Several nodes can depict one unit, or a coarse node can depict several concepts |
| Occurrence to applicable parts | Many to many through evidence | Alternative identities require configuration conditions |
| Part to seller offers | One to many | Separate offers may have different terms or observations |
| Part to serialized assets | One to many, later | Commercial identity does not establish a specific asset's condition |

## Aircraft reference and configuration

An aircraft family is a navigation label, not a complete bill of materials. A reference configuration records the chosen variant, engine option, relevant modification assumptions, cabin option if applicable, document revisions, geometry fidelity, and known omissions. Every attribute supports known, unknown, and not-applicable states.

An optional later airframe entity records manufacturer serial identity, registration history, and as-of date. A registration is not a durable configuration identity. Do not infer installed parts from a tail number without suitable aircraft records and permission to use them.

The initial reference can be representative and educational. Its title and every export must carry that status. Unsupported configuration attributes remain visible instead of being silently assigned the most common option.

## Applicability logic

An applicability assertion links a part to an occurrence or a defined equipment role under stated conditions. Conditions may concern variant, engine option, serial range, modification state, equipment option, parent assembly revision, or document effectivity. The assertion includes its source, relevant excerpt locator, effective interval, reviewer, and revision.

Evaluate to one of four results: supported, unsupported, conditional, or unknown. A missing required configuration attribute yields conditional or unknown, never supported. A conflict between authoritative assertions enters review and blocks automatic positive applicability. Negative evidence should not be overwritten by a vague seller model tag.

Supported applicability means that the cited source supports the reference mapping. It is not an installation authorization or a certification of a physical item's serviceability.

## System organization

Use plain-language groups for navigation and a separately maintained aviation taxonomy for technical classification. ATA's standards program identifies iSpec 2200 as including an aircraft system numbering scheme. The project should obtain the appropriate source and usage rights before importing a detailed classification. [ATA standards overview](https://ataebiz.org/standards/)

The proposed initial navigation groups are airframe and structure; propulsion; landing gear and braking; flight controls; electrical power; hydraulics; fuel; avionics and navigation; cabin and equipment; and air and environmental systems. These are product navigation groups, not a reproduction of an official chapter table.

Each taxonomy entry records authority, identifier, label, edition, and mapping provenance. Do not invent an official-looking code for an uncategorized component. A component can appear in a functional search result without appearing twice in a physical inventory.

## Hierarchy and quantities

Use an acyclic physical-containment tree per configuration revision. Keep functional membership, electrical or fluid connectivity, replacement relationships, and commercial bundles outside that tree. This prevents a pump that belongs to multiple systems from becoming several physical objects during aggregation.

An occurrence records quantity relative to its parent, unit, position label, and quantity status. For discrete components, prefer explicit occurrences for separately selectable positions. For repeated low-detail items, use a grouped occurrence with a known quantity. Never represent both expanded children and their grouped quantity as independently countable items in the same scenario.

Unknown quantities stay unknown. A catalog's “quantity as required” is not converted into one. Installed quantity differs from supplier stock quantity, package quantity, minimum order quantity, and user-selected replacement quantity.

## Assembly scope

An assembly has a commercial-scope description where evidence exists: bare unit, dressed assembly, accessories included, accessories excluded, or unknown. These scope labels are price-critical. A complete assembly price must not be applied to a bare component node because the labels look similar.

Component membership and commercial inclusion are not always identical. Track an explicit inclusion relation when an offer covers bundled items. Price aggregation uses inclusion and physical overlap, not just visual parenthood.

## Part relationships

Maintain distinct relations for exact identity, alias, seller stock code, supersession, approved alternative asserted by a named source, kit membership, and related-but-not-interchangeable items. Relations have direction, conditions, evidence, and dates. Do not assume a replacement chain is symmetric or transitively compatible in every configuration.

Manufacturer identity forms part of the part-number namespace. An organization identifier such as CAGE can be stored where verified, but does not substitute for establishing the part-number issuer. Manufacturer mergers and trade-name changes need aliases with provenance rather than mass identity replacement.

## Representation fidelity

| Fidelity | Meaning | Pricing implication |
| --- | --- | --- |
| Reference-accurate | Reviewed against licensed references for the stated scope | Still requires independent part mapping |
| Approximate placement | Correct general region; detailed dimensions not established | Show location limitation |
| Schematic component | Simplified educational shape | Price can attach only through reviewed semantic mapping |
| Grouped representation | One visible shape stands for several items | Expose grouping and quantity before subtotaling |
| Unmapped geometry | Shape exists without verified semantic correspondence | No automatic price mapping |

## Knowledge publication

Publish aircraft configuration, occurrence tree, semantic mappings, and geometry manifest as a compatible release set. Keep price publications independently versioned but reference that set. A corrected occurrence mapping triggers affected price-summary invalidation and scenario warnings.

A review record includes author, reviewer, source version, reason, change impact, and publication time. Preserve prior releases for reproducible research where rights allow. Retired mappings remain auditable but do not participate in current results.
