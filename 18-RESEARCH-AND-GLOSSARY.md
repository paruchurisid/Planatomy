# Research and glossary

## Research status

Research for this baseline was conducted on September 14, 2026. It inspected the linked Human Atlas project, selected official aviation source descriptions, and primary technical documentation. It did not obtain source contracts, aircraft illustrated parts catalogs, a segmented aircraft asset, private supplier prices, or confirmed live part-to-aircraft mappings.

No real aircraft-part price is asserted by this documentation. Fictional amounts in 09 and 15 demonstrate arithmetic and eligibility. Infrastructure and labor figures in 16 are internal planning assumptions, not market quotes.

## Primary-source register

| ID | Source | Use in this documentation | Limit |
| --- | --- | --- | --- |
| R-01 | [Human Atlas repository](https://github.com/ashemag/human-atlas) | Interaction inspiration and project-described rendering approach | README inspection, not a runtime benchmark |
| R-02 | [Human Atlas package manifest](https://raw.githubusercontent.com/ashemag/human-atlas/main/package.json) | Verify named frontend technologies | Not a dependency recommendation or security audit |
| R-03 | [Human Atlas license](https://raw.githubusercontent.com/ashemag/human-atlas/main/LICENSE) | Identify application-code license boundary | Aircraft assets need separate rights |
| R-04 | [ATA standards overview](https://ataebiz.org/standards/) | Locate official aircraft taxonomy and technical-data standards | Full licensed standards not reviewed or reproduced |
| R-05 | [Airbus aircraft characteristics](https://www.aircraft.airbus.com/en/customer-care/fleet-wide-care/airport-operations-and-aircraft-characteristics/aircraft-characteristics) | Identify official general aircraft-reference material | Does not establish an internal parts catalog or reuse rights |
| R-06 | [Satair Market](https://www.satair.com/about-satair/digital-resources/satair-market/) | Candidate commercial source category | No account, API entitlement, or redistribution terms verified |
| R-07 | [PartsBase](https://www.partsbase.com/) | Candidate marketplace and integration provider | Public product description only |
| R-08 | [ILS](https://www.ilsmart.com/) | Candidate marketplace and intelligence provider | Public product description only |
| R-09 | [FAA Suspected Unapproved Parts Program](https://www.faa.gov/aircraft/safety/programs/sups) | Ground the distinction between commercial claims and safety approval | Not an installation determination for any part |
| R-10 | [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) | Crawler policy reference | Robots rules do not establish content-use permission |
| R-11 | [Khronos glTF](https://www.khronos.org/gltf/) | Runtime 3D delivery format reference | Asset fidelity and licenses remain project responsibilities |
| R-12 | [Three.js documentation](https://threejs.org/docs/) | Rendering technology reference | No pilot performance measured |
| R-13 | [FastAPI documentation](https://fastapi.tiangolo.com/) | API framework reference | No implementation or version locked |
| R-14 | [PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) | Database access-control capability and role caveats | Application, cache, and derived-data controls still required |
| R-15 | [Playwright Python documentation](https://playwright.dev/python/docs/intro) | Browser automation capability | Does not authorize access to sources |
| R-16 | [Scrapy AutoThrottle](https://docs.scrapy.org/en/latest/topics/autothrottle.html) | Adaptive collection tooling reference | Per-source policies still govern use |
| R-17 | [ECB exchange reference rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) | Informational currency-conversion reference | No transaction FX rate promised |
| R-18 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessibility target | Conformance requires implementation audit |
| R-19 | [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) | Fetch-worker threat mitigation | Must be tested in the chosen network environment |

The attempted direct fetch of [Boeing Shop](https://shop.boeing.com/) returned a fetch error. It remains a research candidate, and no conclusions about its API, public pricing, or terms are drawn from that failed request.

## Evidence versus design

The cited sources substantiate the limited factual descriptions attached to them. The architecture, workflow, thresholds, data schema, user journeys, scope targets, and economic scenarios are proposed Planatomy design choices. They should not be read as recommendations or performance guarantees supplied by those sources.

Time-sensitive capabilities, licenses, terms, and library versions must be rechecked before implementation and source onboarding. This baseline deliberately avoids reproducing full technical standards or private commercial data.

## Research backlog

| Priority | Research task | Required output |
| --- | --- | --- |
| First | Compare one A320ceo and one 737NG candidate for data and asset feasibility | Scored matrix with evidence and acquisition constraints |
| First | Audit 30 component concepts across five systems | Identity, price, rights, and review-time worksheet |
| First | Inspect asset licenses for browser delivery and modification | Approved acquisition brief and contract questions |
| First | Identify source integration and derivative-publication rights | Source policy record with actual terms |
| First | Confirm exact pilot configuration and technical references | Reviewed configuration baseline with explicit unknowns |
| Next | Interview educators and parts researchers | Task priorities and willingness-to-pay evidence |
| Next | Measure mobile rendering with a permitted sample asset | Device-specific payload, memory, and interaction results |
| Next | Validate extraction on permitted commercial records | Independent labeled sample and critical-error report |
| Next | Collect real provider and staffing quotes | Revised delivery budget and sensitivity cases |
| Later | Evaluate private quotation and transaction data | Tenant, consent, rights, and methodology extension |
| Later | Assess demand for fleet or asset scenarios | Validated use cases before adding valuation models |

## Glossary

| Term | Meaning in Planatomy |
| --- | --- |
| Aircraft family | Broad product grouping used for navigation |
| Aircraft variant | A more specific manufacturer designation within a family |
| Reference configuration | Declared aircraft assumptions and unknowns used by one published anatomy model |
| Airframe | A specific physical aircraft, supported later through suitable identifying records |
| Effectivity | Conditions or ranges under which a technical assertion applies |
| Component concept | Functional or semantic description independent of a particular location |
| Component occurrence | One positioned or explicitly grouped representation in an aircraft reference |
| Part definition | Manufacturer-scoped catalog identity |
| Part number | An identifier whose issuer and namespace matter |
| Serial number | Identity of a physical item, not the general catalog part |
| Assembly | Group of components whose physical or commercial scope must be specified |
| Bill of materials | Structured parts and quantity list for a defined scope; not assumed complete here |
| IPC / illustrated parts catalog | Technical catalog potentially supporting part relationships and effectivity |
| ATA classification | Aviation system taxonomy tracked with authority and edition |
| LRU | Line-replaceable unit; classification does not establish this product's maintenance authority |
| OEM | Original equipment manufacturer |
| MRO | Maintenance, repair, and overhaul organization or activity |
| AOG | Aircraft on ground; urgency can affect commercial terms |
| PMA | Parts manufacturer approval; any specific claim requires appropriate evidence |
| CAGE | Organization identifier that may help establish supplier or manufacturer context |
| Asking price | Advertised seller amount rather than evidence of a completed transaction |
| Quote | Recipient- and term-specific commercial offer |
| Outright | Purchase basis without an exchange-core obligation |
| Exchange | Commercial basis involving return of an acceptable core or specified obligations |
| Core | Returned component involved in an exchange arrangement |
| Serviceable | Condition claim requiring a source-specific meaning and supporting context |
| As removed | Condition description that does not by itself establish serviceability |
| Supersession | Directed replacement relationship subject to stated conditions |
| Interchangeability | Substitution relationship requiring explicit supporting scope and evidence |
| Cohort | Set of observations that meet one defined comparison basis |
| Provenance | Traceable source and interpretation history for a fact or value |
| Observation | Time-stamped capture or confirmation of external evidence |
| Freshness | Recency relative to the chosen policy, distinct from availability or validity |
| Publication | Reviewed, rights-eligible representation exposed to a defined audience |
| Known subtotal | Sum of eligible selected lines, with unknown coverage retained |
| Part-out value | Value of recovered parts under sale, condition, timing, and cost assumptions; outside MVP |
| Mesh | Renderable geometry that need not correspond one-to-one with a catalog part |
| glTF / GLB | Runtime scene delivery format and its binary packaging form |
| LOD | Level of detail used to vary rendering cost |
| SSRF | Server-side request forgery, a risk when a service fetches attacker-controlled targets |
| Idempotency | Repeated processing has the same intended effect as one successful processing |
| Outbox | Durable record of work to dispatch alongside a committed data change |
| Tenant | Organization boundary for private records and derived outputs |
| RPO | Recovery point objective: targeted maximum data-loss interval |
| RTO | Recovery time objective: targeted restoration interval |

## Next implementation handoff

Begin with the feasibility audit and one evidence-backed visual slice. Read the governing identity and pricing documents before designing tables or attaching amounts to meshes. Resolve the pilot's external dependencies in 17, then use the acceptance gates in 15 to authorize each product stage.

The documentation is complete as a planning baseline. The actual aircraft catalog, source permissions, geometry assets, measured benchmarks, and commercial evidence are future deliverables and are not implied to exist.
