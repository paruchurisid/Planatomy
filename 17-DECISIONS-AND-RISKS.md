# Decisions and risks

## Decision status

“Confirmed” means explicitly supplied by the user. “Proposed baseline” means the documentation chooses a working default that should guide implementation unless new evidence changes it. “Deferred” means the decision is intentionally reserved until the relevant dependency is known.

| ID | Decision | Status | Reason and consequence |
| --- | --- | --- | --- |
| D-01 | Commercial passenger jets first | Confirmed | Aircraft scope is not general aviation |
| D-02 | Documentation only in the existing workspace | Confirmed | No application code or new directories in this deliverable |
| D-03 | Human Atlas as interaction reference | Confirmed direction | Adapt the exploration pattern to aircraft and commercial evidence |
| D-04 | One representative A320ceo configuration first | Proposed baseline | Bounded pilot; exact subtype depends on evidence and asset feasibility |
| D-05 | Separate concepts, occurrences, and part identities | Proposed baseline | Prevent mesh-level identity and quantity errors |
| D-06 | Separate identity resolution from applicability | Proposed baseline | A part-number match does not establish aircraft compatibility |
| D-07 | Curated sources before broad crawling | Proposed baseline | Establish rights and repeatable evidence first |
| D-08 | Asking-price observations as initial numeric product | Proposed baseline | Avoid unsupported transaction or valuation claims |
| D-09 | Exact, explainable cohorts with deterministic summaries | Proposed baseline | Reproducibility and understandable sparse-data behavior |
| D-10 | Three independent sellers for a consolidated observed summary | Proposed baseline | Single offers remain visible without market-summary language |
| D-11 | No automated price imputation in MVP | Proposed baseline | Missing evidence remains visible |
| D-12 | Modular API plus separate asynchronous workers | Proposed baseline | Isolate source and processing failures without broad microservice overhead |
| D-13 | React/Three.js frontend and Python API/workers | Proposed baseline | Fit interactive graphics and extraction responsibilities |
| D-14 | PostgreSQL as structured source of truth | Proposed baseline | Relational integrity and auditable evidence relationships |
| D-15 | Versioned glTF assets and external semantic manifests | Proposed baseline | Geometry can evolve independently from commercial evidence |
| D-16 | Public browsing with authenticated staff review | Proposed baseline | Minimize initial account requirements |
| D-17 | No automatic RFQs, messages, orders, or purchases | Proposed baseline | The current product is research and evidence inspection |
| D-18 | Specific hosting and data providers | Deferred | Select after access, rights, workload, and quotes are known |

## Alternatives considered

### Scrape first and organize later

This creates a large discovery corpus quickly but risks unusable identities, ambiguous terms, rights gaps, and a large review backlog. The selected approach starts from a bounded component list and approved sources, then expands adapters based on measured yield.

### One universal “part price” field

This is simple to display but loses condition, date, unit, assembly scope, and commercial obligations. The selected design stores observations and derives named summaries from explicit cohorts.

### One mesh equals one catalog item

This simplifies a prototype but fails on grouped geometry, repeated occurrences, alternatives, and assemblies. The selected design uses a semantic mapping layer and supports unpriced meshes and nonvisual parts.

### Full aircraft valuation at launch

This is visually compelling but requires extensive missing-cost, condition, demand, and recovery assumptions. The selected design offers bounded selected-component subtotals and explicitly measured coverage.

### Fork the reference unchanged

This might accelerate the first visual demo but couples aviation data to anatomy-specific assumptions and does not solve sourcing or pricing. The selected direction is to assess selective reuse after a focused source review and rendering spike.

### AI-first extraction and valuation

This could reduce some manual reading but adds unsupported-inference and validation risks. The selected MVP uses deterministic extraction and review. Optional assistance can later propose fields while preserving evidence and hard eligibility rules.

## Risk register

| Risk | Likelihood / impact assumption | Early indicator | Mitigation and owner |
| --- | --- | --- | --- |
| Insufficient public price rights | High / high | Useful providers prohibit redistribution | Product lead secures partnership or narrows public scope |
| Interior geometry unavailable | High / high | Licensed models contain exterior only | Art lead commissions schematic internals for a bounded scope |
| Wrong part applicability | Medium / very high | Family tags used without effectivity | Aviation reviewer enforces evidence and unknown states |
| Misread exchange or core prices | High / high | Implausibly low asks or missing obligations | Pricing owner validates commercial fields and isolates cohorts |
| Duplicate seller inventory | High / medium | Same offer appears across marketplaces | Data lead tracks underlying sellers and syndication |
| Source layout changes | High / medium | Numeric field yield suddenly shifts | Adapter owner quarantines drift and uses fixtures |
| Review backlog | Medium / high | Queue age grows faster than accepted coverage | Product lead narrows target catalog and adds reviewer capacity |
| Public/private data leakage | Medium / very high | Shared caches or pooled summaries | Platform owner enforces audience before derivation and tests it |
| Slow mobile model | Medium / medium | High decoded memory or first-load latency | Viewer owner reduces initial detail and chunks assets |
| Misinterpreted subtotal | High / high | Test users call partial sum “aircraft value” | Design owner revises labels, coverage, and presentation |
| Dependency on one supplier | Medium / high | Most priced identities vanish if one feed pauses | Source lead diversifies allowed evidence where practical |
| Overly broad first release | High / high | Multiple families and valuation features added before pilot proof | Product lead uses phase exit gates |
| Licensing costs exceed budget | Unknown / high | Provider quote dominates expected value | Founder revisits economics before implementation commitment |
| Source artifact deletion breaks auditability | Medium / medium | Retention expires before review | Data lead plans permitted evidence retention and declares limitations |

Likelihood labels are planning judgments, not measured probabilities.

## Unresolved decisions and when to resolve them

| Question | Current default | Decision point |
| --- | --- | --- |
| Which exact aircraft variant and engine option? | Representative A320ceo family reference | End of feasibility, before detailed mapping |
| Which assets can be delivered in a browser? | Commission or explicitly license a segmented model | Before acquisition commitment |
| Which sources permit public prices and derived summaries? | None approved yet | Source onboarding |
| Is an early professional customer available? | Public education plus researcher pilot | Discovery interviews during feasibility |
| Which cloud and identity provider? | Managed services in one region | Platform kickoff after workload and ownership review |
| Which staff have technical review authority? | Named aviation reviewer plus critical-case second reviewer | Before first mapping publication |
| What source-specific freshness limits apply? | 30-day asks and 90-day historical exploration | Onboarding and pilot quality review |
| Should comparison history be paid? | Deferred | After rights and willingness-to-pay validation |
| Should application code be open source? | Undecided; independent from data licensing | Before first code release |
| How should public model branding be handled? | Neutral presentation and accurate attribution | Asset and brand review |

These questions do not block the documentation deliverable. They are intentionally identified so future implementation does not accidentally treat an assumption as an acquired right, verified dataset, or confirmed user preference.

## Change process

For a material decision change, record the triggering evidence, options considered, chosen outcome, affected documents, implementation consequences, and date. Update the governing specification before changing dependent calculations or public behavior. Preserve earlier decision context where useful for understanding migration impact.

Changes to price method, configuration applicability, rights handling, or quantity semantics require an explicit validation update. Cosmetic interface refinements can proceed through ordinary design review if they do not alter meaning.
