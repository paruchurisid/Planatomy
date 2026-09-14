# Security and data governance

## Security objective

Protect the application, source credentials, licensed evidence, and customer data while preserving traceability. The main distinctive threats are untrusted network content entering processing workers and rights-restricted evidence accidentally reaching public views or aggregates.

This document specifies product controls. It does not assert that a particular source license, scraping practice, export, or jurisdiction has been legally cleared. Source-specific commercial and legal review belongs in onboarding when actual materials and terms are available.

## Data classes

| Class | Examples | Default handling |
| --- | --- | --- |
| Public publication | Approved descriptions, permitted asks, licensed public models | Public API and controlled CDN |
| Restricted research | Contract-limited catalog excerpts and private reference materials | Staff or licensed audience only |
| Organization private | Customer quotes, internal part lists, private annotations | Tenant-scoped storage and projections |
| Credentials | Supplier tokens, service credentials, session secrets | Managed secret storage; never evidence artifacts |
| Operational metadata | Job outcomes, redacted logs, audit events | Role-limited operations access |

Classify at ingestion and preserve the label through derivatives. Unknown classification defaults to restricted. Public metadata about a source does not make that source's collected records public.

## Threat and control matrix

| Threat | Entry point | Required controls |
| --- | --- | --- |
| Server-side request forgery | Source URLs or document links | Approved domains, DNS/IP validation, redirect revalidation, network egress restrictions |
| Malicious HTML | Scraped descriptions and source previews | Sanitize display, avoid active embedding, strict browser content policy |
| Malicious documents | PDF or archive processing | Isolated workers, resource limits, no privileged filesystem access |
| Secret exposure | Fetch logs, browser traces, errors | Redaction, scoped credentials, private trace retention |
| Tenant data leakage | Search, summaries, exports, caches | Audience filtering before computation and storage; isolation tests |
| Source prompt injection | Optional assisted extraction | Treat content as data; no authority to invoke tools or change policy |
| Supply-chain compromise | Dependencies and build assets | Pinning, dependency review, artifact provenance, restricted deployment credentials |
| Unauthorized publication | Review or source administration | Role separation, revision checks, audit records |
| Resource exhaustion | Expensive search, assets, document bombs | Bounded queries, size limits, queue budgets, rate limits |
| Misleading supplier data | Fabricated or inconsistent offers | Provenance, field validation, conflict review, no implicit seller endorsement |

OWASP's SSRF guidance supports allowlisting and validation at the application and network layers. Apply these controls to each redirect and resolved destination rather than checking only the initially submitted URL. [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

## Network and worker isolation

Only approved source targets enter the fetch queue. Block loopback, private network ranges, link-local destinations, cloud metadata endpoints, and unexpected ports unless a narrowly defined internal integration explicitly needs them. Revalidate redirects and DNS results, including IPv6 cases.

Browser workers use isolated contexts per source and account. They do not inherit an operator's everyday browser profile. Disable unnecessary downloads and limit navigation to approved destinations. Do not expose database administrative credentials inside browser or document workers.

Document workers have bounded CPU, memory, runtime, and file expansion. Treat embedded scripts, attachments, and external references as untrusted. Reject unsupported archive nesting and resource explosions.

## Identity and authorization

Staff authenticate through a managed identity provider with multi-factor protection. Assign roles for curation, critical review, publication, source administration, and operations. The API evaluates permissions server-side on every protected operation. The browser hiding a button is not authorization.

Use short-lived service credentials where possible, separate production from staging, and scope each source credential to the minimum required access. Rotation and revocation must not require rebuilding the frontend. Audit administrative actions without storing secrets in the audit payload.

## Rights propagation

Each observation links to a versioned rights policy. Effective output rights are the intersection of the source's permissions, the caller's entitlement, the intended operation, and any derivative restrictions. Public summary formation filters eligible public observations before aggregation; it never computes a private summary and then merely hides its source rows.

Counts, minimums, ranges, availability flags, and export filenames can leak private data too. Treat derived metadata as protected when it reveals restricted evidence. Minimum cohort sizes alone do not establish permission to publish confidential prices.

A rights-policy change invalidates affected projections and caches. Source expiry checks operate independently of the refresh scheduler so a disabled feed cannot remain public indefinitely through old summaries.

## Retention proposal

| Record class | Initial planning default | Override rule |
| --- | --- | --- |
| Raw permitted HTML or document evidence | 90 days | Shorter source requirement or explicit longer license controls |
| Normalized price observations | 24 months | Only while retention and derived-use rights permit |
| Source credentials | Only while integration is active | Revoke promptly on termination or compromise |
| Operational logs | 30 days | Minimize personal and commercial content |
| Audit metadata | 12 months | Retain longer only for documented need and permitted content |
| Rolling encrypted backups | 35 days | Deletion obligations may require a different design |
| Public geometry releases | While licensed and supported | Takedown or license expiry overrides availability |

These are proposed service policies, not claims about legal retention requirements. When raw evidence expires, retain permitted hashes and field lineage, but mark that the original artifact is no longer available. Do not pretend that a hash can reconstruct or substantiate every field by itself.

If a contract requires immediate erasure from all copies, evaluate backup segregation or cryptographic erasure before onboarding. For ordinary rolling backups, prevent deleted records from being republished on restore and document the purge horizon accurately.

## Takedown and correction

Provide a source or rights-holder contact route and a record-level correction mechanism. On validated revocation, first remove access, then identify downstream observations, summaries, exports, assets, caches, and retained copies. Track completion and exceptions. Retain only permissible audit metadata.

For factual correction, preserve the earlier interpretation where allowed and publish a successor revision. Notify affected saved-scenario owners only through a later explicitly authorized notification feature. Current-page warnings can explain changes without sending messages automatically.

## Aviation information boundaries

The interface does not certify authenticity, serviceability, traceability, or installation eligibility. The FAA maintains a program addressing suspected unapproved parts, which underscores why a marketplace listing should not be treated as a safety approval. [FAA Suspected Unapproved Parts Program](https://www.faa.gov/aircraft/safety/programs/sups)

Store certification and documentation statements as source claims with verification state. A photographed tag or a reference to an authorization form does not alone establish suitability for a specific installation. Avoid operational maintenance instructions in educational component descriptions unless separately scoped and reviewed.

The initial scope is civilian passenger-jet anatomy and commercial research. If controlled technical material or restricted end-use data appears during sourcing, pause that source's publication and obtain a source-specific review. Do not infer legal classification from an aircraft label alone.

## Export controls within the application

Exports inherit audience, rights, timestamps, method version, and scope limitations. Sanitize spreadsheet-compatible text fields against formula interpretation when CSV export is introduced. Never attach raw licensed evidence to a public download by default. Record generated export IDs and retention so revocation can identify remaining hosted copies.

## Release controls

Security acceptance requires passing authorization tests for direct records, search, summary cohorts, caching, artifacts, and exports; source-fetch destination tests; document resource-limit tests; and secret-redaction checks. Test source revocation through the entire publication path. Detailed release gates are in [15 — Validation and acceptance](15-VALIDATION-AND-ACCEPTANCE.md).
