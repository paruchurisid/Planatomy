# Ingestion and scraping

## Pipeline purpose

The pipeline turns permitted external evidence into reviewable observations. It does not infer aircraft compatibility from a scraped title or publish raw extraction output directly into the viewer. Collection, interpretation, matching, and publication are separate states with durable records.

The preferred source order is contracted API or feed, authorized structured export, permitted structured web content, permitted HTML extraction, and finally browser rendering when necessary. Use manual curation when automation is more expensive or less reliable than the small pilot requires.

## Processing lifecycle

| Stage | Input | Output | Failure behavior |
| --- | --- | --- | --- |
| Eligibility | Approved source policy and scheduled target | Authorized collection job | Deny or pause without fetching |
| Fetch | Target and source budget | Response metadata and permitted evidence object | Retry transient failure; pause access challenges |
| Detect | Response and expected content class | Format, language, layout fingerprint | Quarantine unexpected content |
| Extract | Evidence and adapter version | Field candidates with source locators | Preserve ambiguity and raw strings |
| Normalize | Field candidates | Typed commercial and identity fields | Reject unsafe coercions |
| Resolve | Normalized identity candidates | Match decision or review case | No silent fuzzy identity attachment |
| Validate | Match, terms, rights, and freshness | Eligible observation revision | Quarantine rule violations |
| Publish | Reviewed or rule-approved observation | Audience-specific publication | Atomic visibility change |
| Derive | Eligible observations | Price summaries and search projections | Keep previous valid result with stale state |

## Collection jobs

A collection job carries source ID, policy revision, target identity or catalog partition, scheduled time, access audience, retry budget, adapter version, and idempotency key. Before any request, recheck source status and rights expiry. An old queued job cannot bypass a newly disabled source.

Use a separate queue for network collection and a separate queue for CPU-heavy document processing. Within collection, isolate browser-rendered work from lightweight requests so a slow page cannot exhaust all capacity.

At-least-once job delivery is acceptable. Make observation creation and publication idempotent. Record attempt history separately from the logical job so operators can distinguish many retries from many unique targets.

## Responsible access policy

Use a declared crawler identity and per-source request limits. Honor applicable robots rules and source agreements. Robots rules govern crawler behavior and are not an access authorization mechanism; a public path does not resolve contractual or redistribution rights. [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)

For the pilot, default to one in-flight request per domain and a ten-second minimum interval unless an approved agreement specifies otherwise. These are conservative project defaults, not universal source limits. Respect a longer server retry instruction. A source-specific daily request budget prevents unexpected pagination growth.

Do not circumvent authentication, CAPTCHAs, paywalls, IP restrictions, or access challenges. Do not rotate identities to evade limits. Pause the adapter and review the permitted access method. No scraper submits a form, order, quote request, or message as a side effect of reading.

## Scheduling and freshness

Use a daily eligibility scan and source-specific fetching schedules. A pilot planning default is daily refresh for actively researched public offers and weekly refresh for low-priority catalog material, only within source limits. Stable geometry and taxonomy update on reviewed publication, not on a price schedule.

Separate last attempted fetch, last successful fetch, last content change, source publication date, quote expiry, and last confirmed offer presence. A successful HTTP response containing a login page is not a successful offer refresh. An unchanged response can confirm continued visibility but cannot extend a quote's explicit expiration.

Apply conditional requests where the source supports them and terms allow. Reuse unchanged evidence internally only within retention and licensing limits.

## Extraction contract

Each adapter identifies source record ID, canonical URL, manufacturer string, manufacturer part number, seller stock code, title, description, aircraft tags, raw condition, raw price, currency, sale basis, unit, package quantity, minimum order, stock claim, lead time, core obligations, effective dates, and evidence locators where available.

Missing fields stay missing with a reason. Preserve original text beside normalized values. Record language and locale so a comma or period is not misread as the wrong decimal separator. Separate catalog pages with many variants into distinct offers only when price-to-variant association is explicit.

Extraction confidence describes how clearly the field was read. It does not indicate that the seller's statement is true. Evidence should distinguish a source's claim of certification or condition from independent verification.

## HTML, structured data, PDFs, and OCR

Prefer explicit fields and stable source identifiers. Structured page metadata can help but must be reconciled against visible variant selection and commercial terms. A page-level minimum price must not be assigned to every variant.

PDF extraction preserves page, table, row, and nearby heading context. A column shift is a publication-blocking failure. OCR-derived part numbers, digits, currency markers, and unit labels require verification for the pilot. Keep scans in restricted evidence storage only when retention is permitted.

Never extrapolate a price from an image filename, an adjacent product, a search snippet, or an unrelated table row. A “from” amount remains a bounded or starting-price claim and is excluded from exact unit-price summaries.

## Normalization rules

Trim insignificant whitespace but retain original part-number punctuation and leading zeros. Decode display entities; do not destructively simplify manufacturer identifiers. Normalize currency only when explicit or unambiguous from documented source context. Map source condition abbreviations through a versioned, source-specific dictionary.

Recognize “call,” “request quote,” “TBD,” and similar markers as nonnumeric states. Reject apparent zero or token placeholder prices for review unless explicitly documented as a genuine commercial offer. Do not infer “new” from a stock photo.

Record pack size and minimum purchase. Unit equivalents support comparison only when the units and pack contents are homogeneous and known. Preserve actual required purchase cost separately.

## Deduplication and historical changes

Deduplicate fetches by source, canonical target, audience, and content fingerprint. Deduplicate offer revisions by stable source offer identity plus normalized commercial content. Maintain separate temporal presence observations if an unchanged offer is reconfirmed.

Cross-site duplicate detection uses underlying seller, manufacturer-scoped part identity, terms, stock references, and syndication indicators. Retain source lineage even when several observations belong to one deduplication group.

Repeated captures of one unchanged offer must not inflate an estimate's sample size. A changed price creates a new offer revision and closes the previous effective interval where the source evidence supports that interpretation.

## Review and assisted extraction

For the MVP, all new part-identity mappings and new source adapters require human review. Established adapters may publish new observations automatically only after field validation, exact identity resolution, and rights checks pass. Large discontinuities, unfamiliar conditions, changed template fingerprints, and conflicting commercial fields return to review.

Language-model assistance is optional and deferred. If introduced, use it only to propose typed extraction or explanatory drafts from supplied evidence. Require field locators, treat source instructions as untrusted content, and keep final prices and applicability behind deterministic validation and review. No model-generated value substitutes for missing evidence.

## Failure policy

| Failure | Response |
| --- | --- |
| Timeout or transient server error | Exponential backoff with jitter, capped at three automatic retries |
| Rate limited | Honor retry interval and reduce source concurrency |
| Authentication or bot challenge | Pause source and alert operator |
| Missing page | Mark observation no longer confirmed; do not infer sale or zero stock |
| Layout drift | Quarantine extraction and compare permitted fixtures |
| Invalid currency, negative price, ambiguous unit | Exclude from numeric publication pending review |
| Rights expiry or source takedown | Stop fetch and suppress affected publications |
| Poison document or excessive resource use | Terminate isolated processor and quarantine target |

## Adapter tooling proposal

Use Python workers with Scrapy for request-oriented collection and Playwright for explicitly permitted browser-dependent sources. Scrapy documents adaptive throttling; Playwright documents browser automation support. Source policy remains an application responsibility rather than something those tools establish. [Scrapy AutoThrottle](https://docs.scrapy.org/en/latest/topics/autothrottle.html), [Playwright Python documentation](https://playwright.dev/python/docs/intro)

Adapter release approval requires representative fixtures, known failure cases, field-quality measurement, rights configuration, and a rollback path. Detailed release tests are in [15 — Validation and acceptance](15-VALIDATION-AND-ACCEPTANCE.md).
