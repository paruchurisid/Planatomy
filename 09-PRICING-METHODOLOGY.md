# Pricing methodology

## What a displayed price means

The default numeric product is a sourced asking-price observation or an observed asking-price summary for a tightly defined cohort. It is not automatically fair market value, an executable quote, the historical amount paid, an installed replacement cost, or an aircraft valuation.

Every amount must answer: which manufacturer-scoped part, which assembly scope, which condition, which commercial basis, which quantity and unit, which currency, which date, and which audience? If any comparison-critical answer is missing, preserve the evidence but exclude it from the numeric summary.

All examples in this document are fictional arithmetic illustrations. They are not estimates for any real aircraft component.

## Price kinds and sale bases

| Kind or basis | Meaning | Handling |
| --- | --- | --- |
| Public asking price | Supplier advertises an amount | Eligible for asking-price cohort if interpretable |
| Customer quote | Supplier offers recipient-specific terms | Separate quote view; validity and audience enforced |
| Completed transaction | Evidence of an actual completed sale | Separate transaction analysis, deferred |
| Outright purchase | Purchase without a required exchange core | Primary MVP comparison basis |
| Exchange purchase | Price depends on return of an acceptable core or other obligations | Separate cohort with explicit cash and liability terms |
| Repair or overhaul service | Work on an existing unit | Never pooled with acquisition of a replacement unit |
| Lease or rental | Time-based access to a unit | Separate time and usage basis, deferred |
| Lot, package, or kit | Price covers multiple items | Unit conversion only when contents and quantities are known |
| Starting price | Lower-bound or variant-dependent amount | Preserve label; exclude from exact-price summary |
| Quote required | No numeric price supplied | Nonnumeric state, never zero |

## Cohort definition

An MVP cohort requires exact part identity, matching commercial assembly scope, normalized condition, sale basis, homogeneous unit, quantity tier, and allowed audience. Also constrain currency-conversion basis, observation window, and any price-critical geography or tax treatment. Restrict to offers with sufficiently clear terms and current presence.

Engine, module, and serialized life-sensitive items require additional build, life, documentation, and maintenance-status comparability. If those are absent, show individual evidence with limitations and suppress a blended summary. The initial pilot should prefer simpler units rather than force complex assets into a generic model.

Use source-defined conditions mapped to a reviewed internal dictionary. Do not pool new, overhauled, repaired, serviceable, as-removed, unserviceable, or unknown-condition observations. “Used” is not a sufficient universal mapping to serviceable.

## Eligibility filters

An observation is numerically eligible only when its identity is resolved, relevant terms are interpretable, amount is positive, unit conversion is safe, source rights permit the output, evidence is not quarantined, and it falls within the cohort's validity and freshness rules.

For an aircraft-specific display, applicability to the selected reference must also be supported. A valid part-level offer can remain visible on a general part page even when applicability to a particular aircraft is unknown.

Reject token placeholder amounts, expired quotes, ambiguous currencies, unknown package contents, core-only amounts misidentified as full-unit prices, and mixtures of part acquisition with repair fees. High or low amounts are not rejected solely because they look surprising.

## Currency and quantity

Store original currency and amount permanently where permitted. For comparison, record the rate provider, effective date, direction, and conversion result. Use the latest available reference rate on or before the observation date, with a maximum seven-calendar-day gap for the pilot. Missing or older rates make conversion unavailable until reviewed.

Reference exchange rates are an informational comparison basis, not a promise of transaction conversion. ECB explicitly describes its rates as informational and discourages their use for transactions. [ECB reference exchange rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html)

Historical comparisons default to observation-date conversion. An optional constant-currency view must label the common conversion date. Do not retroactively rewrite stored converted observations when a new exchange rate arrives.

For a homogeneous pack of four at USD 400, the unit equivalent is USD 100, but a user needing one still faces USD 400 purchase cost if only full packs are sold. The basket rounds up to purchasable pack counts and applies relevant quantity tiers. Installed quantity does not imply order quantity or supplier availability.

## Duplicate and seller handling

First collapse repeated observations of the same current offer revision. Then consolidate known syndicated offers. For the primary summary, give each independent underlying seller one representative observation within the cohort. Select that seller's most recently source-confirmed eligible offer; break equal-time ties by a stable offer identifier. Expose the rule and let the user inspect all eligible offers separately.

This choice is intentionally deterministic and avoids weighting a seller by the number of reposts. It does not claim that the latest offer is the best available bargain. If underlying seller independence cannot be established, count uncertain offers conservatively and disclose that limitation.

## MVP summary algorithm in words

After eligibility and deduplication, sort independent seller representatives by normalized unit amount. With one or two sellers, display individual observed prices and the seller count, without a consolidated market estimate. With three or more, display the median as “Median observed asking price,” alongside the observed minimum and maximum and the sample count.

For an odd seller count, the median is the middle amount. For an even count, it is the arithmetic mean of the two central amounts. With five or more sellers, optionally show the middle 50% observed band using nearest-rank quartiles: select the amount at the rank obtained by rounding 25% or 75% of the count upward, with ranks beginning at one. Record this convention in the method version.

The minimum-to-maximum range and quartile band describe the observed sample. They are not statistical confidence intervals or a guarantee of future purchase prices. Sparse or selected supplier coverage may systematically differ from the wider market.

No recency weighting, supplier popularity weighting, predictive regression, or automatic outlier deletion is used in the MVP. Introduce advanced models only after a validated transaction or quote dataset supports evaluation.

## Fictional example

| Evidence | Terms | Outcome |
| --- | --- | --- |
| Seller A: USD 10,000 | Exact identity, overhauled, outright, each, fresh | Included |
| Seller B: USD 12,000 | Same cohort | Included |
| Seller C: USD 14,000 | Same cohort | Included |
| Seller A repost: USD 10,000 | Same underlying offer on another website | Duplicate, not another seller |
| Seller D: USD 5,000 | Exchange price with core obligation | Separate cohort |
| Seller E: request quote | No amount | No numeric contribution |
| Seller F: USD 800 | Repair inspection service | Separate service category |

The outright cohort has three independent sellers. Its median observed ask is USD 12,000, and its observed range is USD 10,000–14,000. The three amounts support a descriptive sample summary, not a claim that the part will transact within that range.

## Exchange terms

Record quoted exchange amount, separately payable core deposit, refundable portion, required core identity and condition, deadline, shipping obligations, inspection or rejection terms, and any additional nonreturn liability. Source wording determines whether a deposit is already included in the quoted amount; never add it twice.

In a fictional offer with a USD 5,000 exchange charge and a separate USD 3,000 core deposit, initial part-related cash is USD 8,000 before other costs. If the entire deposit is refunded after an acceptable core is received, net part-related cash becomes USD 5,000. If the core is rejected, USD 8,000 may not be the maximum exposure because additional fees or outright conversion could apply. Unknown obligations remain unknown.

Compare exchange offers only when their obligations are sufficiently aligned. Show acquisition cash and conditional eventual cash separately. Do not compare an exchange headline against an outright price as though both buy the same rights on the same terms.

## Freshness

The pilot default is a 30-calendar-day freshness window for asking-price summaries and a 90-day historical exploration window. A source contract or explicit offer expiry can impose a shorter limit. Fresh means recently confirmed evidence, not verified available stock or a price guarantee.

Reconfirming an unchanged page can update offer-presence time; it cannot reset a document's stated price-effective date or quote expiry. Display those distinctions when material. A source outage leaves historical evidence with its original date and stale status. It never creates a new observation merely because an internal job ran.

## Evidence strength

Show a multidimensional explanation: identity state, applicability state, source kind, independent seller count, commercial completeness, freshness, and observed dispersion. Do not collapse all uncertainty into a percentage.

A “multiple-seller observed summary” requires the three-seller threshold and all hard eligibility checks. “Limited evidence” covers one or two eligible sellers. “Historical only” means no current eligible observation. “No comparable evidence” covers unresolved terms or absent amounts. These labels describe the dataset, not the probability a price is correct.

## Outliers and conflicts

Flag sudden price changes, very wide dispersion, inconsistent core handling, and radically different assembly scopes for review. Retain legitimate high and low asks when their terms belong in the cohort. Display the spread and its limitations. If conflicting terms cannot be resolved, remove that observation from the cohort with a recorded reason rather than silently trimming the price distribution.

## Component baskets and rollups

A basket is a user-defined replacement-component scenario tied to a configuration revision, part choices, quantities, cohort basis, and as-of date. Each line has a selected amount or a missing-value state. The default subtotal includes eligible known lines only and is labeled “Known selected-component subtotal.” It shows the number of priced and unpriced selected lines immediately beside the amount.

Choose either an assembly or its included descendants for a given physical and commercial scope. If an assembly is selected, exclude covered children. If some children are priced and the parent is not, sum those children only and label the scope partial. Cross-system membership cannot duplicate occurrences. Kits and bundles use explicit inclusion relations to prevent overlapping charges.

In a fictional basket with two independent occurrences at USD 12,000 each and one unpriced component, the known selected-component subtotal is USD 24,000 across two priced occurrences out of three selected. It is not a complete system value. Unknown quantity also blocks a complete total even when unit price is known.

Summed line medians are labeled a sum of selected reference amounts, not the median of an actual multi-item transaction. Summed lower and upper observed bounds are scenario bounds, not confidence intervals; correlated prices and unavailable simultaneous supply limit their meaning.

## Coverage and prohibited extrapolation

Report anatomy coverage against the curated target list, identity coverage against selected occurrences, and price coverage against eligible selected identities or occurrences. Always state the denominator and whether it counts concepts, positions, or quantities. Ten repeated instances of one identity are not ten independent priced identities.

Do not estimate missing component value by scaling from mesh count, polygon volume, model size, or the proportion of catalog rows priced. Do not divide the whole aircraft's sale price across visible meshes. Do not sum every known component and call the result the aircraft's market value.

Installed replacement cost would require labor, tooling, logistics, tax, consumables, testing, downtime, and possibly other costs. Part-out value would require recoverability, sale probability, timing, removal costs, condition, and demand. Both are separate later research products.

## Reproducibility

Store the eligible observation IDs, excluded IDs and reasons, seller consolidation rule, currency rates, method version, cohort signature, audience, and evaluation time with every summary. Saved scenarios retain the chosen publication revisions. Recalculation creates a new scenario revision and explains differences rather than silently changing a previously shared result.
