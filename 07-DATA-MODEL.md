# Data model

## Storage philosophy

Use a relational source of truth for identities, configuration, evidence, rights, review, and publications. Store large permitted evidence objects and 3D assets in object storage. Search and price summaries are rebuildable projections. A graph database is unnecessary for the initial bounded aircraft hierarchy and relationship workload.

Use durable opaque identifiers rather than names, mesh indices, URLs, or raw part numbers as primary keys. Preserve temporal revisions and lineage. Store monetary values using decimal precision, with currency and unit basis required for normalized numeric use. Null is distinct from zero and from an explicitly unavailable field.

## Catalog and anatomy entities

| Entity | Principal fields | Constraints |
| --- | --- | --- |
| Manufacturer | ID, canonical name, aliases, verified external identifiers, source | Alias changes do not rewrite identity history |
| AircraftFamily | ID, manufacturer, name, public description | Navigation scope only |
| AircraftVariant | ID, family, designation, references | Designation includes source provenance |
| ConfigurationRevision | ID, variant, attributes, unknown attributes, status, revision, as-of date | Immutable after publication; successor revision for edits |
| TaxonomyEntry | ID, authority, code, edition, label, parent, rights | Unique within authority and edition |
| ComponentConcept | ID, name, aliases, explanation, editorial status | Independent of geometry and commercial identity |
| SystemMembership | Concept or occurrence, taxonomy or navigation group, role, evidence | Functional membership does not multiply physical quantity |
| ComponentOccurrence | ID, configuration revision, concept, parent, position, quantity, quantity status, fidelity | Parent belongs to same configuration; no cycles |
| PartDefinition | ID, manufacturer, exact part number, display name, category | Manufacturer-scoped exact identity unique under reviewed rules |
| PartAlias | Part, alias type, issuer, raw value, normalized search value, evidence | Seller codes cannot become manufacturer identities implicitly |
| ApplicabilityAssertion | Part, occurrence or role, conditions, result basis, source, revision, dates | Every positive mapping has evidence and review status |
| PartRelation | From part, to part, type, direction, conditions, evidence | Supersession and interchangeability remain distinct |
| AssemblyInclusion | Assembly or offer scope, included occurrence or part, quantity, evidence | Defines commercial coverage for overlap prevention |

## Evidence and commercial entities

| Entity | Principal fields | Constraints |
| --- | --- | --- |
| Organization | ID, legal or display identity, aliases, verified ownership relations | Supplier independence evaluated separately from domain count |
| Source | ID, owner, type, official domain, status, policy revision | Disabled status enforced before queued fetches |
| RightsPolicy | ID, allowed audiences, raw retention, display, derivatives, export, attribution, expiry | Deny by default for unspecified commercial permissions |
| CollectionJob | ID, source, target, adapter version, budget, idempotency key, status | Retry attempts do not create new logical targets |
| FetchAttempt | Job, attempt time, response class, duration, status, redacted diagnostics | Credentials never retained in diagnostic bodies |
| EvidenceObject | ID, source, object reference, hash, content type, captured time, retention deadline, rights | Object may be absent when storage is not permitted |
| SourceLocator | Evidence object, page or record ID, field location, minimal permitted excerpt | Allows field-level review without whole-document publication |
| ExtractionRevision | Evidence, adapter version, raw fields, normalized fields, warnings | Reprocessing preserves prior interpretation |
| SellerOffer | ID, source listing identity, underlying seller, part resolution, audience | Stable across commercial revisions |
| OfferRevision | Offer, condition, scope, sale basis, price status, amount, currency, unit, quantity terms, core terms, dates | Numeric usability requires complete comparison fields |
| PresenceObservation | Offer revision, successful confirmation time, evidence, visibility state | Reconfirmation does not create independent price evidence |
| QuoteRecord | Offer or part, authorized organization, recipient scope, validity, terms | Private by default; separate from anonymous public asks |
| TransactionRecord | Part, seller, buyer audience, completed amount, date, quantity, terms | Deferred; completion evidence required |
| DeduplicationGroup | Member observations, seller basis, match rationale, review state | Count independent sellers conservatively |
| ExchangeRate | Provider, source currency, target currency, effective date, rate, retrieved time | One reproducible conversion basis per derived amount |

## Commercial field dictionary

An offer revision retains both raw and normalized condition, condition-definition version, price kind, sale basis, amount, currency, unit, pack quantity, minimum order, price-break schedule, stock claim, lead-time claim, seller location, tax inclusion, shipping inclusion, core deposit, conditional refund, return deadline, rejection liability, warranty claim, document claims, and offer validity.

Each field records whether it is source-observed, source-context-derived, reviewer-corrected, or unknown. Documentation claims need type and verification state; a source mentioning a release form is not a verified certificate record.

For serialized or life-limited items later, add serial number access controls, time/cycle fields, remaining-life basis, trace documentation status, and module or build configuration. Do not attach those attributes to a generic part definition as if every unit shares them.

## Derived and application entities

| Entity | Principal fields | Constraints |
| --- | --- | --- |
| MatchDecision | Candidate extraction, part, evidence features, decision, reviewer, version | Automatic decisions limited by resolution policy |
| ReviewCase | Subject, reason, priority, assigned reviewer, proposed revision, state | Approval is explicit and auditable |
| AuditEvent | Actor, action, target, prior revision, new revision, timestamp, reason | Append-only operational history with redacted content |
| PriceSummary | Part, cohort signature, audience, date window, method version, statistics, freshness | Rebuildable; never sole surviving price evidence |
| SummaryContribution | Summary, eligible observation or seller representative, weight, exclusion reason | Reproducible inclusion and exclusion |
| ScenarioRevision | Owner scope, configuration revision, selection, quantities, price basis, exclusions | Immutable saved result with recomputation option |
| ScenarioLine | Occurrence or part, quantity, chosen evidence, coverage status, overlap group | Prevent parent/child and bundle double counting |
| AssetRevision | ID, license, artist, source references, hash, fidelity, dimensions, validation status | Public delivery requires asset rights approval |
| MeshMapping | Asset revision, node identifier, occurrence, mapping type, transform reference | No orphan mapping in a published release |
| PublicationRelease | Configuration, asset manifest, taxonomy version, mappings, status | Compatible release set switched atomically |
| Tenant and Membership | Organization, user, role, account state | Introduced for private pilot data; enforced across projections |

## Temporal semantics

Maintain source effective time separately from system observation time and publication time. A supplier's offer date may precede collection. A later correction may change interpretation without changing the original source date. Save each date explicitly; do not overload one “updated” timestamp.

Publications have valid-from and retired-at times. Quotes also have source validity intervals. A backtest uses only evidence available to the system at its historical cutoff, not evidence discovered later with an older document date.

## Integrity rules

Require foreign-key integrity for occurrences, parts, sources, and revisions. Enforce acyclic containment at publication. Validate nonnegative known quantities and positive usable prices; exceptional values go through review. A currency conversion cannot exist without its rate record. An exact part match cannot omit manufacturer scope unless an approved unique namespace rule is recorded.

Disallow publication when the associated rights policy is expired, the evidence is quarantined, the mapping is unresolved for that view, or the asset-manifest references are inconsistent. A failed secondary search update cannot roll back a valid source record; it creates a retryable projection job.

## Index and query strategy

Index manufacturer plus exact part number, normalized aliases, configuration occurrences, parent links, source offer identities, observation timestamps, review status, and audience scope. Add full-text search for descriptions and trigram-style fuzzy name matching only where measurement justifies it. Exact identity search remains first.

Price retrieval should select by part, audience, condition, commercial basis, and time window. Create summary lookup indexes on that cohort signature. Use relational hierarchy traversal initially. Consider a closure projection if repeated deep navigation becomes expensive.

Partition high-volume observations by time only after measuring table growth and retention workload. Archive permitted raw artifacts through object lifecycle policy. Avoid partitioning every small catalog table prematurely.

## Deletion, revisions, and rebuilding

Source revocation triggers a lineage-based impact query over observations, summaries, scenarios, search records, exports, and caches. Retain an internal tombstone and audit reference where allowed, without retaining prohibited source content. Historical reproducibility is limited by source rights; the interface must disclose removed evidence.

Rebuild search and price projections from eligible source records and versioned decisions. Migrate schemas through additive changes, backfill, validation, and controlled cutover. Retain compatibility for published asset manifests and saved scenario revisions during migration.
