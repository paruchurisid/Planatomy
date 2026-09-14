# Validation and acceptance

## Validation philosophy

The product must be correct about what it knows, what it does not know, and how its amounts were derived. Validate the full chain from source evidence to selected model occurrence and displayed price. A visually successful demonstration does not establish identity, applicability, or price correctness.

This is a future implementation test plan. No software or live scraper has been built or tested as part of the current documentation task.

## Test layers

| Layer | Main risks | Validation approach |
| --- | --- | --- |
| Source adapter | Layout drift, variant mix-up, wrong currency or price field | Reviewed permitted fixtures and expected extracted facts |
| Normalization | Lost suffixes, decimal parsing, unit mistakes | Exact boundary cases and locale examples |
| Identity resolution | Wrong issuer or ambiguous number attached automatically | Labeled exact, ambiguous, and adversarial cases |
| Applicability | Unknown attributes treated as compatible | Configuration truth table and conflicting assertions |
| Pricing | Mixed cohorts, duplicate sellers, exchange/core confusion | Fixed evidence sets with hand-checked outcomes |
| Aggregation | Parent/child overlap, unknown quantity, false complete totals | Small scenario examples with explicit expected exclusions |
| Authorization | Private data leaking through derivatives or caches | Cross-role and cross-tenant requests through every surface |
| Assets | Orphan mappings, incorrect transforms, inaccessible internals | Manifest validation and visual selection review |
| Frontend | Wrong component response, gesture mistakes, misleading states | Interaction tests and usability sessions |
| Operations | Failed recovery, stale outputs, incomplete revocation | Restore and takedown drills |

## Golden evidence set

Create a licensed or synthetic fixture set with at least 50 representative source records across the pilot's approved adapters. For every record, a reviewer labels identity fields, manufacturer scope, price kind, condition, amount, currency, package basis, exchange terms, dates, and expected eligibility.

Include complete offers, missing prices, price ranges, “from” values, core-only lines, mixed-variant pages, foreign number formatting, superseded identities, stock-code confusion, and expired quotations. Synthetic fixtures test mechanics; real permitted samples test extraction fidelity. Keep these roles identifiable.

Reserve independent records for evaluation rather than tuning every adapter against the same examples. If a source has too few real samples for a representative evaluation, keep its publication path manual and report that limitation.

## Pricing acceptance cases

| Case | Expected result |
| --- | --- |
| Three independent eligible asks of 10,000, 12,000, and 14,000 | Median 12,000; observed range 10,000–14,000 |
| Repeated daily captures of the same 10,000 offer | One seller representative, not multiple independent samples |
| Same seller syndicated through three sites | One independent seller when relation is established |
| Two independent eligible sellers | Individual observations; no consolidated summary |
| New and overhauled conditions | Separate cohorts |
| Exchange 5,000 plus separately stated core 3,000 | Initial part-related cash 8,000; conditional refund explained |
| Core deposit already included in quoted amount | No second addition of deposit |
| Quote expired yesterday but page fetched today | Excluded from current quoted-price view |
| Pack of four for 400, user needs one, no individual sale | Unit equivalent 100; required purchase cost 400 |
| Unknown currency, pack contents, or manufacturer | Excluded from numeric attachment or comparison as applicable |
| One assembly and its included child selected | Covered child excluded or user required to choose scope |
| Two known lines and one unknown line | Known subtotal and partial coverage; no complete total |
| Private low offer plus public high offers | Public summary uses only public evidence; no private count leakage |
| Same inputs and method version recalculated | Identical cohort, contributors, and result |

The arithmetic amounts above are fictional test values. They are not market observations.

## Applicability and identity cases

Test exact number with correct issuer, same number with another issuer, a missing dash suffix, leading zeros, an OCR digit substitution, an approved seller alias, and a part listed under an aircraft family without effectivity evidence. Confirm that only the approved exact and alias cases attach automatically.

For configuration, test known matching attributes, known exclusions, missing engine option, missing modification state, conflicting source revisions, and retired references. The interface must distinguish supported, unsupported, conditional, and unknown outcomes.

Test a part with two occurrences and one occurrence with two supported alternatives. Changing alternatives affects the scenario but must not mutate the aircraft's documented configuration.

## Viewer acceptance

Every selectable node resolves to a valid published occurrence or an explicit grouped chooser. Hidden geometry cannot intercept clicks. Model and tree selection produce the same semantic identity. Exploded transforms, clipping, highlighting, and picking remain aligned throughout transitions.

Test rapid selection while responses arrive out of order, asset failure, graphics-context loss, slow network, reference switching, browser back navigation, and old shared releases. Search and inspection remain usable if geometry fails.

Use actual desktop and mobile devices in addition to emulation. Record model payload, decoded memory, draw calls, frame timing, and interaction trace. Acceptance is against the budgets in 12 and service profiles in 14, with explicitly approved exceptions.

## Accessibility and usability

Audit keyboard navigation, screen-reader component inspection, visible focus, dialog behavior, target sizes, reduced motion, and color-independent price interpretation. A person using only the text tree must be able to identify a component and inspect available evidence.

Recruit at least 10 participants spanning enthusiasts and professional researchers. Ask them to find a component, explain the price type, identify an unpriced item, distinguish an exchange offer, and interpret a partial subtotal. Record task completion and misunderstandings. Fix interpretation failures even if the interface technically passes automated checks.

## Quality thresholds

For each new adapter, target at least 98% correct extraction of critical numeric fields on its independent reviewed sample and zero known identity/price-variant mix-ups. Report sample sizes and confidence limitations. Any critical price-to-part mismatch blocks automatic publication regardless of aggregate percentage.

Identity automatic-attachment evaluation follows the 200-case target and sparse-sample fallback in 08. Published pilot geometry must have zero orphan mappings and zero known duplicate physical occurrences in a subtotal. Every public price contribution must have permitted lineage and a complete cohort basis.

Do not use overall field accuracy to hide systematic failures on exchange prices, minority locales, or sparse aircraft variants. Report performance by difficult case type and source.

## Security acceptance

Attempt unauthorized direct record reads, indirect search discovery, summary reconstruction, private-cache reuse, expired signed links, and export access. Include organization changes and role removal during an active session. Test source URLs that redirect toward internal addresses and documents that exceed resource limits.

Exercise rights revocation through the API, CDN, search, saved scenarios, and hosted exports. Confirm that restoring a backup does not resurrect suppressed evidence. Review logging for source tokens and private content.

## Requirement traceability

| Requirement group | Main specification | Release evidence |
| --- | --- | --- |
| UX-01 through UX-05 | 02 and 12 | Device interaction trace and viewer review |
| UX-06 and UX-07 | 04, 08, and 11 | Search and applicability evaluation set |
| UX-08 and UX-09 | 05, 06, and 09 | Lineage audit and fixed pricing cases |
| UX-10 through UX-12 | 09 and 12 | Overlay interpretation and overlap scenarios |
| UX-13 and UX-15 | 02 and 11 | Shared-state, fallback, and accessibility tests |
| UX-14 | 08 and 13 | Review workflow and audit tests |
| Freshness and recovery | 14 | Source failure and recovery drills |
| Rights and tenant isolation | 13 | End-to-end access and revocation report |

## Release gates

Feasibility approval requires lawful asset and evidence paths. Internal alpha requires a usable component journey, correct data contracts, and no fabricated live values. Public beta requires the pricing and applicability suites, asset mapping review, source rights, accessibility review, operational dashboards, and successful backup and takedown drills.

A release report records scope, test versions, actual sample sizes, failures, accepted exceptions, reviewers, and residual limitations. Coverage goals can be revised openly when evidence is scarce; identity correctness, audience isolation, and honest labeling cannot be traded away for a launch date.
