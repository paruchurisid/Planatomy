# API and frontend contracts

## Contract style

Use versioned resource-oriented HTTP contracts, described here in prose rather than executable schemas. Return stable opaque IDs, explicit revisions, UTC timestamps, decimal monetary representations, currency codes, and structured unavailable states. The first implementation should generate and validate a formal API specification from these agreed contracts.

Separate public read resources from staff operations. Never expose source credentials, raw private artifacts, or unrestricted ingestion controls through a public browser route.

## Public resource catalog

| Resource | Inputs | Response responsibilities |
| --- | --- | --- |
| Aircraft catalog | Search, family filter, pagination | Supported references, publication status, coverage denominators |
| Aircraft reference | Reference ID and optional release | Variant, configuration assumptions, fidelity, release, available systems |
| Scene manifest | Published release and quality tier | Asset URLs, hashes, semantic mapping version, bounds, dependencies |
| Component tree | Reference release and system scope | Stable occurrences, parents, quantity status, labels, visibility group |
| Component detail | Occurrence and release | Function, placement, fidelity, mapping status, applicable identities |
| Part detail | Part identity | Manufacturer, exact number, aliases, documented relationships |
| Part applicability | Part and configuration revision | Supported, unsupported, conditional, or unknown with reasons |
| Search | Query, aircraft context, filters, cursor | Exact identities, concepts, occurrences, match explanation |
| Price observations | Part, condition, sale basis, audience, date window | Eligible public evidence plus clearly separated excluded or historical states |
| Price summary | Part and complete cohort signature | Statistics or insufficient-evidence state, counts, dates, method version |
| Scenario preview | Bounded selection and assumptions | Known subtotal, missing lines, quantity errors, overlap exclusions |
| Methodology | Method version | Human-readable cohort and summary rules |

Public scenario previews are read-like calculations but may use a bounded submission body to avoid putting large selections in URLs. They persist nothing unless the user explicitly saves through an authenticated feature. Limit input size and calculation scope.

## Staff operation catalog

| Operation | Required role | Guardrails |
| --- | --- | --- |
| Inspect evidence | Curator or analyst with source entitlement | Field and artifact rights checked per request |
| Edit catalog draft | Curator | Revision precondition and audit reason |
| Resolve identity candidate | Curator | Evidence and decision class required |
| Approve critical mapping | Authorized second reviewer | Cannot approve own flagged critical change |
| Publish release | Publisher | Asset, mapping, rights, and integrity gates pass |
| Approve source policy | Source administrator | Rights and access settings complete |
| Disable source | Operator or administrator | Immediate visibility stop and tracked cleanup |
| Retry job | Operator | Existing target, source-policy recheck, retry budget |
| Recalculate summary | Operator or pricing curator | Versioned method; no user-supplied arbitrary computation |

Staff mutations carry an idempotency token and expected resource revision where applicable. Reject stale edits with a conflict response that identifies the current revision. Source-administration privileges are not implied by permission to correct a component description.

## Price response contract

The response includes exact part identity, selected condition, commercial scope, sale basis, unit and quantity tier, original or display currency, conversion basis, observation cutoff, freshness policy, evidence state, method version, seller count, and permitted source context.

If summary eligibility fails, omit the summary amount and supply a reason such as insufficient independent sellers, ambiguous unit, historical only, restricted audience, or no numeric evidence. A null amount without explanation is not a valid user-facing contract. An empty eligible set is not a server error.

All observation details distinguish source-stated and independently reviewed fields. A summary response includes a contribution-inspection resource where rights allow, so a user can see why observations were included or excluded.

## Scenario response contract

Return selected configuration revision, requested lines, resolved quantities, chosen price basis, line values, purchase-pack adjustments, excluded overlaps, unknown lines, known subtotal, and coverage denominator. When line currencies cannot be normalized, return separated currency groups and suppress a single combined amount.

Assembly selection must identify the included scope. The backend, not the browser, enforces overlap rules. For uncertain quantity or applicability, return an actionable line state rather than assuming one item or a compatible identity.

## Pagination, filtering, and sorting

Use opaque cursor pagination with deterministic sorting and a default page size of 25, capped at 100. Cursors include or reference the filter and snapshot context so a changing collection does not silently skip or duplicate rows. A stale cursor prompts a restart where consistent continuation is impossible.

Price sorting applies only within an interpretable basis. Put unavailable values in a labeled section rather than treating them as cheapest. Include matched-on information for search results. Restrict wildcard and fuzzy searches to bounded workloads.

## Error semantics

| Condition | Behavior |
| --- | --- |
| Invalid filter or malformed selection | Validation error with field-level reason |
| Resource unavailable to caller | Non-disclosing unavailable response; no private existence leak |
| Retired public revision | Explicit retired state and available replacement where permitted |
| Stale edit | Conflict with current revision metadata |
| Rate limit | Retryable response and retry guidance |
| Background operation accepted | Job reference and status resource |
| Dependency outage | Service failure with request identifier and bounded retry guidance |
| No price or unresolved mapping | Successful domain response with explicit unavailable state |

Public errors do not contain database queries, source credentials, raw HTML, internal addresses, or private record excerpts.

## Frontend state model

Maintain separate state for server resources, the active aircraft release, component selection, viewer presentation, price filters, and scenario draft. A rendering camera update should not trigger a price request. A price-currency change should not reload geometry.

The active selection is an occurrence ID plus release, not a transient mesh index. The renderer maps this identity to its visible node set. Selecting a search result updates the same selection state as clicking the model. Inspecting a part without an occurrence opens a text-focused detail state.

Cancel or ignore obsolete requests after rapid selection changes. A delayed response for the prior component must never populate the new component's panel. Price data and its label update atomically so a fresh label is never paired with a stale amount from another part.

## URL state

Share aircraft reference and release, occurrence, system focus, display mode, and safe public price filters. Validate all identifiers when loading. Do not encode private notes, quotes, user identifiers, or authorization claims into a public share URL. Large or private saved scenarios use authorized server-side records later.

Changing configuration invalidates incompatible selection and basket assumptions. Offer an explicit reset or revision comparison; never retain an unsupported part silently.

## Loading and fallback

Load the interface and text catalog before high-detail geometry. Display an aircraft silhouette or static preview while the first usable scene arrives. Fetch detailed assembly geometry on demand. Keep an error boundary around the renderer so graphics failure does not take down the research interface.

Cache immutable manifests and public catalog releases. Revalidate price resources according to their freshness metadata. Offline cached prices, if later supported, must show offline status and last successful confirmation. Private evidence should not enter a service-worker cache without a specific design review.

## API limits and compatibility

Proposed pilot limits are 100 scenario lines, 200 characters per search query, 100 results per page, and source-dependent observation history windows. These are initial defensive defaults to tune after measured usage. Rate-limit staff bulk operations separately from public browsing.

Add fields compatibly within a major API version. Unknown enum values should render a safe unknown state. Do not reuse a retired field to mean something different. Keep older saved releases readable for the stated support window, subject to evidence rights.
