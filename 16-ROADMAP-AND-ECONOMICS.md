# Roadmap and economics

## Delivery assumptions

Plan around a small team with two engineers, part-time product/design support, a 3D artist, and an aviation reviewer. The founder or product lead owns scope and source partnerships. A solo developer can pursue the same sequence, but the elapsed schedule will expand because engineering, data acquisition, and curation compete for the same time.

The planning horizon is 12–16 weeks after the required asset and data access paths become available. Provider negotiation, licensing, and commissioning can take longer than the technical work. The schedule is a planning scenario, not a delivery commitment or a staffing quote.

## Phased roadmap

| Phase | Indicative duration | Deliverables | Exit gate |
| --- | --- | --- | --- |
| 0: Feasibility | 1–2 weeks of active work; external wait additional | Pilot shortlist, 30-concept audit, rights matrix, asset brief | At least 20 price-capable exact identities, two independent suppliers, feasible licensed geometry |
| 1: Vertical slice | 2–3 weeks | One aircraft scene, 10 selectable occurrences, a reviewed evidence panel, text fallback | A component can be traced from mesh through identity to permitted price evidence |
| 2: Data foundation | 3–4 weeks | Catalog model, source registry, 2–3 approved adapters or imports, review workflow | Repeatable extraction and matching on the pilot sample |
| 3: Pilot atlas | 3–4 weeks, partly overlapping phase 2 | 75–150 concepts, 50–100 selectable occurrences, 20–40 priced identities, system exploration | Scope and evidence coverage reviewed |
| 4: Public beta hardening | 2–3 weeks | Price overlays, bounded basket, accessibility, operations, revocation and recovery | Validation gates in 15 pass |
| 5: Expansion | After usage and rights validation | Second passenger-jet reference, improved depth, professional features | Demonstrated user value and sustainable curation cost |

Overlapping workstreams explain why durations do not sum directly to elapsed time. Do not start large-scale interior modeling before the component scope and rights are stable.

## First vertical slice

Choose one discrete component with clear placement, exact identity evidence, and at least one publishable numeric observation. Build a small scene containing its parent context. Show the price type, condition, source date, and provenance. Include another component with no price and an exchange example if a permitted one exists.

The slice validates the difficult information chain before investing in the full aircraft. A simple model is acceptable; an unverified identity-to-price association is not.

## Work breakdown

| Workstream | Concrete work package | Main dependency |
| --- | --- | --- |
| Product | Finalize pilot reference, journeys, wording, and coverage labels | Feasibility findings |
| Data rights | Secure source permissions and define publication policies | Provider responses |
| Aviation curation | Define concepts, occurrences, quantity status, and applicability assertions | Legitimate references |
| 3D | Acquire, segment, optimize, map, and validate pilot geometry | Asset rights and component scope |
| Platform | API, database, queue, storage policies, deployment, and observability | Chosen hosting environment |
| Ingestion | Source adapters, evidence persistence, normalization, and review | Approved source access |
| Resolution | Exact matching, alias registry, ambiguity cases, and applicability evaluation | Catalog identities and labeled examples |
| Pricing | Cohorts, deduplication, summaries, exchange display, and basket rules | Eligible observations |
| Frontend | Viewer, tree, inspection, search, filters, and fallback | Stable resource contracts |
| Quality | Golden sets, device tests, usability, security, and recovery | Representative end-to-end slice |

## Staffing ownership

One engineer can lead viewer/frontend integration while another leads catalog, ingestion, and pricing. Both share contract and release work. The artist owns geometry quality and export consistency; the aviation reviewer owns technical mapping and applicability review. Product/design owns understandable uncertainty and comparison flows.

Critical mapping approval should have a second qualified reviewer. If the team cannot staff that role continuously, batch critical reviews through an external specialist and keep the relevant records unpublished meanwhile. Do not assign aviation authority implicitly to whoever happens to build the interface.

## Illustrative labor planning

The following arithmetic uses hypothetical loaded hourly rates selected for budgeting exercises. It is not a survey of market rates or a contractor quote.

| Role | Assumed effort | Assumed rate | Illustrative cost |
| --- | --- | --- | --- |
| Two engineers | 960 total hours, equivalent to two people for 12 full-time weeks | USD 80/hour | USD 76,800 |
| 3D artist | 120 hours | USD 60/hour | USD 7,200 |
| Aviation reviewer | 80 hours | USD 120/hour | USD 9,600 |
| Product and design support | 80 hours | USD 70/hour | USD 5,600 |
| Total labor | 1,240 hours | Mixed assumptions | USD 99,200 |
| 20% labor contingency | Applied to total labor | Planning reserve | USD 19,840 |
| Labor plus contingency | Before licenses and service costs | Planning scenario | USD 119,040 |

Founder labor can reduce cash expenditure while retaining opportunity cost. A schematic early prototype can require much less work; a detailed interior atlas or complex engine evidence can require much more. Replace assumed rates and hours with real staffing decisions before approving a build budget.

Data licenses, geometry licenses, legal review, taxes, hardware, and partner onboarding are unquoted external costs. Do not treat their absence from the example as zero. They can dominate the feasibility decision.

## Illustrative monthly infrastructure envelope

| Category | Placeholder allowance | What to validate |
| --- | --- | --- |
| API and static application | USD 120 | Region, minimum instances, requests, bandwidth |
| Database and backups | USD 250 | Storage, recovery, connections, high availability |
| Collection and processing workers | USD 80 | Browser fraction, run duration, concurrency |
| Queue and scheduler | USD 50 | Delivery volume and retention |
| Object storage and CDN | USD 50 | Geometry transfer, evidence retention, requests |
| Monitoring and error reporting | USD 50 | Retention and event volume |
| Identity, staging, and miscellaneous reserve | USD 100 | Staff accounts and nonproduction capacity |
| Total placeholder | USD 700/month | Budget worksheet only; no vendor prices checked |

This is an internal allocation example, not a promise that these services can be bought at these amounts. Obtain current provider quotes after topology selection. Licensed data and human review are excluded and must have separate budget lines.

## Workload model

Assume 1,000 source targets refreshed daily, 30 days per month, and one request per target before pagination or retries. That produces 30,000 collection requests per month. At 100 KB average stored evidence, raw capture adds about 3 GB monthly and about 9 GB across a 90-day window, before compression, versions, and metadata.

If each normalized observation is approximately 2 KB, 30,000 observations add about 60 MB monthly or 1.44 GB over 24 months, before indexes, database overhead, and deduplication. Presence checks can be smaller than full new price revisions; avoid storing identical content repeatedly without a reason.

If 20% of targets require 30 seconds of browser processing, browser time is 6,000 seconds daily, approximately 1.67 worker-hours per day or 50 worker-hours monthly. Startup, retries, and isolation overhead increase actual usage. At a ten-second per-domain minimum request interval, 1,000 requests to one domain require at least about 2.8 hours of elapsed scheduling; adding workers cannot override that limit.

For 10,000 cold sessions monthly, an 8 MB exterior payload transfers roughly 80 GB. If 20% load the remaining 22 MB detail budget, that adds 44 GB, totaling about 124 GB. If every session loads the full 30 MB reference, the upper scenario is about 300 GB. These decimal approximations exclude application assets, API traffic, retries, and cache effects.

## Main economic sensitivity

Measure cost per accepted part mapping, cost per fresh publishable observation, review minutes per disputed identity, and geometry hours per accepted occurrence. A cheap crawler that produces mostly ambiguous records can be more expensive than a small licensed feed.

Run sensitivity cases for a source license costing several times the infrastructure budget, twice the geometry effort, low public price coverage, and review effort growing with each aircraft variant. Make a decision using actual quotes and measured pilot work, not just cloud compute estimates.

## Expansion gates

Add a second aircraft only after the first has useful repeatable evidence and users can interpret its prices correctly. Add private customer data only after tenant isolation and contracts are ready. Add transaction analytics only when transaction evidence and evaluation rights exist. Add market-value prediction only after measuring it against held-out real outcomes with appropriate expertise.

Stop or narrow the pricing product if public redistribution is infeasible, exact identity mapping is unreliable, or ongoing curation costs exceed plausible user value. Preserve a clearly scoped anatomy product if that remains useful, while keeping pricing claims aligned with the evidence actually available.
