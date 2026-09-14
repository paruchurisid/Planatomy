# Planatomy

**An interactive anatomy atlas for commercial passenger jets, with traceable pricing for the components inside them.**

Planatomy lets someone rotate a passenger aircraft, reveal its internal systems, select a component, understand its function, and investigate what comparable replacement parts cost. Each price connects to evidence, a part identity, a condition, commercial terms, and an observation date. Aircraft configuration and data gaps remain visible throughout the experience.

The project takes its interaction inspiration from [Human Atlas](https://github.com/ashemag/human-atlas). The aviation product adds a curated aircraft knowledge model, configurable component applicability, permitted data collection, and a pricing evidence engine.

## Status and scope

- Documentation baseline: September 14, 2026.
- User-confirmed initial market: commercial passenger jets.
- Working product name: Planatomy.
- Proposed first aircraft: one representative Airbus A320ceo configuration, subject to the asset and data feasibility gate. This is a planning choice, not a user-selected subtype or a verified aircraft dataset.
- Current deliverable: technical and product documentation only. No application code, dependency installation, infrastructure, data harvesting jobs, or new directories are included.
- All numerical launch targets, schedules, operating budgets, and fictional price examples are planning assumptions unless explicitly identified otherwise.

## The basic idea

The main screen is a three-dimensional passenger jet surrounded by a searchable system tree and an inspection panel. A visitor can remove the outer shell, isolate landing gear or avionics, and click an individual component. The inspection panel explains the component, its placement, applicable part numbers, and available price evidence. A cost overlay highlights expensive components within a clearly specified comparison basis.

The product has three linked but independent layers:

1. **Aircraft anatomy:** what is visible, what it does, and where it belongs.
2. **Part identity and applicability:** which purchasable items may correspond to the selected component under a documented configuration.
3. **Commercial evidence:** what a source observed or offered, on what terms, at what time, and with what publication rights.

A visual component may have no priced part number. A catalog part may have no dedicated mesh. A supplier listing may exist without a usable public price. These are supported product states.

## Documentation map

| Document | Purpose |
| --- | --- |
| [01 — Product vision](01-PRODUCT-VISION.md) | Users, value proposition, positioning, scope, business hypotheses, and success measures |
| [02 — Experience and requirements](02-EXPERIENCE-AND-REQUIREMENTS.md) | Screens, journeys, interactions, acceptance criteria, and empty states |
| [03 — Human Atlas assessment](03-HUMAN-ATLAS-ASSESSMENT.md) | Observed reference behavior, reuse choices, and aviation-specific differences |
| [04 — Aircraft knowledge model](04-AIRCRAFT-KNOWLEDGE-MODEL.md) | Systems, component hierarchy, configurations, occurrences, and applicability |
| [05 — Data source strategy](05-DATA-SOURCE-STRATEGY.md) | Candidate sources, evidence rights, feasibility audit, and coverage strategy |
| [06 — Ingestion and scraping](06-INGESTION-AND-SCRAPING.md) | Collection, parsing, normalization, retries, review, and refresh lifecycle |
| [07 — Data model](07-DATA-MODEL.md) | Logical entities, fields, relationships, constraints, history, and indexing |
| [08 — Part resolution](08-PART-RESOLUTION.md) | Identity matching, applicability evaluation, conflicts, and review workflow |
| [09 — Pricing methodology](09-PRICING-METHODOLOGY.md) | Comparable cohorts, estimates, confidence, exchange terms, and rollups |
| [10 — System architecture](10-SYSTEM-ARCHITECTURE.md) | Technology choices, boundaries, data flows, deployment, and scaling |
| [11 — API and frontend contracts](11-API-AND-FRONTEND-CONTRACTS.md) | Resource contracts, authorization, state, caching, and error semantics |
| [12 — 3D asset pipeline](12-3D-ASSET-PIPELINE.md) | Asset acquisition, semantic mapping, rendering, delivery, and quality |
| [13 — Security and data governance](13-SECURITY-AND-DATA-GOVERNANCE.md) | Threats, access controls, rights enforcement, and retention |
| [14 — Operations and reliability](14-OPERATIONS-AND-RELIABILITY.md) | Service objectives, monitoring, deployment, recovery, and runbooks |
| [15 — Validation and acceptance](15-VALIDATION-AND-ACCEPTANCE.md) | Test strategy, evaluation sets, launch gates, and requirement traceability |
| [16 — Roadmap and economics](16-ROADMAP-AND-ECONOMICS.md) | Delivery stages, staffing, dependencies, workload, and planning budgets |
| [17 — Decisions and risks](17-DECISIONS-AND-RISKS.md) | Architecture decisions, alternatives, unresolved choices, and risk register |
| [18 — Research and glossary](18-RESEARCH-AND-GLOSSARY.md) | Primary-source register, evidence limitations, terminology, and research tasks |

## Recommended reading paths

For the concept, read 01, 02, and 09. For implementation planning, read 04 through 12 and then 15. For feasibility and investment decisions, read 05, 16, and 17. The source register in 18 distinguishes checked references from assumptions that require further investigation.

## Rules that hold across the design

- A model-family label never establishes the installed configuration of a specific airframe.
- A displayed mesh never establishes an approved part identity by itself.
- Missing price data is unknown, never zero.
- Asking prices, quotations, completed transactions, repair services, and exchange offers remain distinct.
- A complete assembly and its included children cannot both contribute to the same subtotal.
- Observations retain source lineage; corrections create revisions.
- Private or contract-restricted evidence does not become public through aggregation or export.
- A partial catalog subtotal is never presented as the purchase price or market value of an entire aircraft.

## Document precedence

The confirmed passenger-jet scope and documentation-only constraint take precedence over planning defaults. For specific behavior, 04 governs configuration semantics, 08 governs matching, 09 governs pricing, and 13 governs access and rights. Performance and delivery figures are targets defined in 14–16, not measured results. Resolve future conflicting edits in 17 before implementation.

## Implementation quickstart

The first implementation uses PostgreSQL locally and keeps the connection contract compatible with Neon Lakebase Postgres. You do not need a Neon account to run the API locally.

1. Copy `.env.example` to `.env` if you want to override the defaults.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Install the Python package with `python -m pip install -e ".[dev]"`.
4. Apply the schema with `python scripts/run_migrations.py`.
5. Start the API with `uvicorn planatomy_api.main:app --reload`.
6. Open `http://127.0.0.1:8000/docs` and check `GET /health/db`.

For Neon, set `DATABASE_URL` to the connection string for the selected Neon branch and run the same migration command. Keep local development, staging, and production on separate databases or branches; never point local experiments at the production branch.

The workspace is now linked to the Neon `Planatomy` project and its `production` branch. The supported setup command is:

```powershell
npx neon@latest init --skip-template --no-config --yes --agent codex
```

Neon CLI state is stored in the ignored `.neon` and `.env.local` files. Do not commit either file or copy its connection string into source code. Use `neon checkout <branch-name>` for isolated development branches once the first schema is stable.

The current code is deliberately a foundation: it creates the core relational schema and exposes health checks. The aircraft seed catalog, source adapters, review UI, and 3D viewer will be added on top of this contract.
