# Operations and reliability

## Operating model

Separate user-facing availability from source freshness and data correctness. A healthy web server with stale or misparsed prices is not a healthy product. Conversely, a supplier outage should not make already published educational anatomy unusable.

The pilot can operate with business-hours support and explicit incident ownership. Do not promise continuous response coverage until staffing supports it. Assign one accountable operator and one backup for each production release.

## Proposed service objectives

| Measure | Pilot target | Measurement |
| --- | --- | --- |
| Public read availability | 99.5% per calendar month | Synthetic catalog, component, and price-state requests |
| Cached catalog/API latency | p95 under 400 ms | Server response time at agreed regional probe |
| Uncached component or summary read | p95 under 1 second | Excludes geometry transfer; bounded resource queries |
| First interactive exterior | Under 5 seconds on agreed desktop profile; under 8 seconds on agreed mobile profile | Cold-cache test with documented bandwidth and latency |
| Publication lag after approval | p95 under 15 minutes | Approval to updated eligible public summary |
| Source schedule execution | 95% of eligible jobs start within their configured daily window | Excludes paused or unauthorized sources explicitly |
| Fresh pilot evidence | At least 90% of price-enabled identities have one eligible observation within their configured freshness window | Report denominator and source outage impact |
| Rights revocation | Access denial immediate at origin; public cache suppression within 15 minutes | End-to-end takedown drill |
| Recovery point | At most 24 hours of committed metadata loss | Verified backup and restore capability |
| Recovery time | Restore core public research within 8 hours of incident declaration | Measured recovery drill |

These are launch targets, not current measured service levels. Pin reference devices, network profiles, and probe locations in the implementation release record. Source access and pricing availability are not guaranteed by the application availability objective.

## Observability

Trace a source target through collection attempt, evidence object, extraction revision, match decision, observation publication, and price summary. Each stage emits stable correlation identifiers without leaking raw private content.

Track request latency, error classes, queue age, worker saturation, fetch success, policy denials, rate limits, parse yield, required-field completeness, identity-review volume, source-template changes, rights expiry, publication lag, cache invalidation failures, and geometry load failures.

Measure data drift per source: fraction of listings with numeric prices, condition distributions, currency distributions, unit ambiguity, and price-change magnitude. Compare against reviewed baselines. A sudden increase in low prices can indicate a parser reading core deposits rather than unit prices.

## Alert policy

Page or urgently notify the operator for unauthorized public data exposure, credential compromise, widespread source-to-part misattachment, or sustained public unavailability. Use business-hours alerts for a single paused adapter, rising review backlog, a missed low-priority refresh, or a rendering regression limited to a noncritical profile.

Deduplicate alerts by incident and source. Include impact, last successful state, likely affected cohort, runbook reference, and immediate containment control. Do not send one alert for every failed page in a failing source.

## Deployment workflow

Promote application changes through development, staging, and production. Validate database compatibility and asset-manifest consistency before switching public releases. Use a small production exposure or a reversible release pointer where practical.

Release source adapters independently from large geometry assets. A source adapter has a version, fixtures, quality result, and source-policy compatibility. A geometry release has asset hashes, mapping checks, and fidelity approval. A pricing-method change has fixed expected-output cases and a comparison against the prior method.

Avoid destructive schema changes during the same release that first introduces a replacement field. Use an additive migration, backfill, validation, reader transition, and later cleanup. A rollback plan must account for data written under the new version.

## Runbook: source outage or access challenge

Confirm the source failure class and stop aggressive retries. For rate limits, honor retry guidance and reduce pressure. For access challenges, pause the adapter. Keep the last permitted evidence with its original dates and compute stale state normally. Inform the operator of affected identities and whether any public price summaries lose eligibility.

Resume only after the permitted method and adapter behavior are confirmed. Reprocess a small sample, compare field quality, and then release the queued workload within source budgets.

## Runbook: parser drift or wrong prices

Disable new publication for the affected adapter immediately. Determine the first suspect adapter or source-layout revision. Identify observations and summaries derived from that revision, suppress suspect current values, and show an unavailable or historical state.

Compare permitted evidence to extracted fields, repair the adapter, and replay the affected evidence within retention rights. Use a shadow publication to compare results before promotion. Record the affected time interval and any saved scenario revisions requiring a correction warning.

## Runbook: rights revocation

Disable source publication and new collection. Apply audience denial at the origin, invalidate affected public caches, revoke artifact links, and remove prohibited derived outputs. Use lineage to enumerate remaining objects and exports. Track storage deletion and backup treatment separately from immediate public suppression.

Validate with a public request, an authenticated request, a cached request, and a direct asset or export link. Close the incident only when each required surface is handled or a documented contractual exception applies.

## Runbook: queue backlog

Inspect oldest job age, source budgets, browser-worker saturation, and failure loops. Drop superseded refresh jobs for the same target when a newer authorized job covers the same work. Do not cancel historical reprocessing or rights cleanup just because it has the same URL.

Scale the relevant worker pool only if the source request budget permits. If review is the bottleneck, prioritize the pilot's published identities and source failures before broad discovery. More crawling cannot fix a curation backlog.

## Runbook: database or storage failure

Stop unsafe mutations and preserve recoverable job metadata. Restore the latest valid backup into an isolated recovery environment. Reapply durable permitted events where available, reconcile publication pointers, and replay idempotent projection work. Check revoked-source tombstones before enabling public reads.

Verify catalog integrity, a sample of evidence lineage, current rights, price calculations, and asset-manifest resolution. Restore private access separately after tenant checks. Record actual recovery point and elapsed recovery time against targets.

## Backup and recovery

Use encrypted database backups and provider-supported recovery capabilities selected during deployment. Copy critical asset manifests and original owned assets according to their rights and recovery value. Test a restore at least quarterly during pilot operation and before major migrations.

Search indexes and price summaries are rebuildable, but source evidence may not be refetchable. Prioritize lawful retention of unique evidence and review decisions. Backups must have access isolation; a production service credential should not be able to delete every recovery copy.

## Capacity and cost controls

Set monthly budget alerts, per-source request ceilings, maximum browser-worker concurrency, object retention rules, and export size limits. Report actual cost by API, collection, processing, storage, CDN, and human review where practical.

The largest uncontrolled costs may be licensed data, custom geometry, and expert curation rather than compute. Track review minutes per published identity and geometry hours per accepted selectable occurrence alongside infrastructure metrics.

## Maintenance cadence

Review source health and pending critical cases daily during the pilot. Review coverage and rights-expiry queues weekly. Review dependencies, restore readiness, and operational costs monthly. Revisit pricing methods only through versioned validation; do not tune output statistics ad hoc to make the visual heatmap look more interesting.
