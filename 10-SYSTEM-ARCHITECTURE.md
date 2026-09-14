# System architecture

## Architecture decision

Use a browser application, a modular application API, and asynchronous collection and processing workers. PostgreSQL holds authoritative structured data. Object storage holds licensed assets and permitted evidence. A CDN distributes public geometry and application assets. A durable managed queue coordinates background work.

Keep the initial backend a modular monolith with separate worker processes. This provides clear ownership boundaries without requiring independently deployed microservices for every domain. The principal reasons for process isolation are untrusted document processing, browser automation, different resource requirements, and protection of interactive requests.

## Technology baseline

| Layer | Proposed choice | Reason and boundary |
| --- | --- | --- |
| Web interface | React and TypeScript, built with Vite | Interactive viewer with a static deployable shell |
| 3D rendering | Three.js with glTF/GLB delivery | Scene rendering and model interaction; semantic identities remain external |
| UI primitives | Accessible component primitives with project styling | Consistent controls and review tables |
| Application API | Python with FastAPI | Shared language with ingestion and typed resource validation |
| Relational storage | Managed PostgreSQL | Integrity, joins, temporal records, and controlled access |
| Evidence and assets | Managed object storage | Large binary artifacts with distinct private/public policies |
| Background scheduling | Durable managed queue plus scheduler | Retryable, observable asynchronous work |
| Collection | Python HTTP/Scrapy adapters; Playwright where authorized | Source-specific extraction with isolated browser capacity |
| Identity | Managed OIDC provider for staff | Avoid building password and session infrastructure |
| Search | PostgreSQL exact and text search initially | One operational system until volume requires dedicated search |
| Observability | Structured logs, metrics, and distributed traces | Track source-to-publication lineage and runtime health |

These are proposed choices, not installed dependencies. Pin supported versions and review their licenses and security state when implementation begins. FastAPI documents an API framework with OpenAPI-oriented capabilities; Three.js documents browser rendering facilities. The broader system design is a Planatomy proposal. [FastAPI documentation](https://fastapi.tiangolo.com/), [Three.js documentation](https://threejs.org/docs/)

## Logical context

| Actor or system | Communicates with | Purpose |
| --- | --- | --- |
| Public visitor | Web application and public API | Explore approved anatomy and evidence |
| Staff curator | Review application and staff API | Resolve identities and publish changes |
| Approved supplier source | Collection worker | Provide authorized evidence through allowed access |
| Scheduler | Queue | Request refresh and processing work |
| Worker | Database and private object storage | Persist evidence, decisions, and derived results |
| Release publisher | Database, CDN, and projection jobs | Expose compatible audience-specific releases |
| Operator | Monitoring and administration | Diagnose failures, disable sources, restore service |

The public API never performs live source scraping in the user's request path. Selecting a mesh reads already published evidence and can report its refresh status. This isolates user latency from supplier availability and source-rate limits.

## Backend modules

The catalog module owns manufacturers, parts, concepts, configurations, and applicability. The evidence module owns sources, rights references, observations, extraction revisions, and lineage. The resolution module owns candidate decisions and review cases. The pricing module owns cohort formation, eligibility, summaries, and scenario calculations.

The asset module owns geometry manifests and occurrence mappings. The publication module coordinates compatible releases and audience filtering. The administration module owns source policy, audit events, and operational controls. Authorization is shared infrastructure enforced at each module boundary.

Modules interact through explicit application contracts and durable jobs. Avoid directly editing another module's tables from a source adapter. All publication state changes go through the same eligibility and rights checks.

## End-to-end read path

A visitor opens an aircraft reference. The static shell loads the published catalog release and a low-detail asset manifest. The CDN delivers geometry. The application maintains selected occurrence and display state. Selecting a component requests its semantic detail, applicable identities, and the relevant public price summary.

The API validates reference revision and audience, reads the published projection, and returns data with source dates and method version. It does not embed private raw evidence in the response. If a summary is missing, the API returns an explicit unavailable state rather than launching expensive ad hoc aggregation on every request.

## End-to-end write path

The scheduler enqueues an eligible source target. A collection worker checks policy, fetches evidence, and persists a job result. A processing worker extracts and normalizes fields, resolves identity, and creates validated observations or review cases. A curator approves any required decision.

The application records publication changes and an outbox event in one database transaction. An outbox dispatcher reliably sends jobs for price recalculation, search updates, and cache invalidation. Consumers are idempotent. A failed downstream job can retry without duplicating the source observation.

The outbox closes the gap where a database commit succeeds but queue delivery fails. At-least-once processing remains the expected delivery model; no distributed exactly-once guarantee is assumed.

## Storage and access boundaries

Use separate public asset and private evidence storage policies. Private evidence objects have short-lived authorized delivery only where source rights allow the requester to see them. Public models may be cached broadly after license review. No private quote-derived summary is stored in a public CDN namespace.

Use a non-owner application database role. PostgreSQL row security can provide additional protection for organization-scoped rows; it does not replace application authorization, and owner or bypass privileges require special care. [PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

For the public MVP, staff-only review evidence and public publications are already separate audiences. Introduce organization tenants before private customer evidence is ingested, not after private data has been mixed into public projections.

## Deployment topology

Begin with one primary region, static application delivery through a CDN, a small API deployment, separate collection and processing worker pools, managed relational storage, private/public object storage, and a durable queue. Keep database and compute near each other to reduce latency and transfer.

Provide development and staging environments with synthetic or explicitly permitted fixtures. Production credentials and unrestricted source data do not enter developer environments by default. A staging release can validate a full published aircraft snapshot before production promotion.

No particular cloud provider is selected here. Choose one that supports the topology, account ownership, operational familiarity, and budget; document the final choice in the decision register. Avoid coupling catalog identity or model manifests to provider-specific URLs.

## Caching and consistency

Geometry is immutable and content-addressed. Catalog releases have durable revision identifiers. Public API cache keys include release, resource, filter basis, currency basis, and publication policy revision. Organization-scoped responses use private caching rules and include tenant identity in any internal cache key.

Catalog and geometry publish atomically as a release pointer. Price summaries are eventually consistent with eligible observations, with a target publication lag defined in operations. Return last-calculated time and stale status. Source revocation uses immediate visibility filtering and asynchronous physical deletion; cache purge is a tracked part of completion.

## Scale triggers

Add API replicas when measured concurrency or latency demands it. Add browser workers when queue age grows despite healthy source budgets. Add a dedicated search engine only when database search fails relevance or latency requirements after indexing and query review. Add a warehouse when historical analytics interfere with transactional workload.

Do not use a graph database, event-streaming cluster, Kubernetes, or model-serving platform merely for anticipated future complexity. Revisit a service boundary when a module needs independent scaling, ownership, security isolation, or release cadence that worker separation cannot provide.

## Technology alternatives

A full-stack JavaScript API could reduce language count but gives up direct reuse of the proposed Python extraction and analysis layer. A server-rendered frontend could improve public catalog discovery, but the first viewer still requires substantial client rendering. A static-only product suits a demonstration but cannot manage ongoing evidence review and rights-sensitive publication by itself.

The chosen baseline favors one interactive frontend and one backend language, with clear responsibility for long-running collection. Reassess if the implementation team has materially different strengths.
