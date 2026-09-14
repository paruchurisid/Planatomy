# Experience and requirements

## Primary workspace

Use a three-column desktop layout: aircraft and system navigation on the left, a large 3D viewport in the center, and component inspection on the right. A top bar holds aircraft selection, reference configuration, search, and reset. A compact bottom area holds display modes and the price legend when relevant.

On mobile, the viewport sits above a collapsible inspection sheet, with system navigation in a separate drawer. The detail sheet must not cover the selected component after camera framing. Selection should work through the text tree even when the model cannot render.

The default scene is assembled, with a restrained exterior material and clear major-component boundaries. Use a neutral background, high-contrast selection outline, and labels only for the active system or selected item. Avoid making every part label visible at once.

## Screens and responsibilities

| Screen | Main content | Primary action |
| --- | --- | --- |
| Aircraft catalog | Supported references, visual preview, anatomy and price coverage | Open reference |
| Aircraft explorer | Model, systems, configuration, component panel | Investigate component |
| Part detail | Manufacturer-scoped identity, applicability, offers, history | Inspect evidence |
| Compare | Selected comparable part identities or scenarios | Understand differences |
| Methodology | Price basis, sources, confidence rules, exclusions | Interpret results |
| Review console | Candidate records, source evidence, conflicts, revisions | Publish or reject |
| Source administration | Access policy, refresh health, rights expiry | Manage collection |

Anonymous users can explore public records. MVP staff accounts manage curation. Saved user collections and organization workspaces are deferred unless needed for the professional pilot.

## Core journey: discover through anatomy

1. Open the supported passenger-jet reference and see the reference configuration label.
2. Select landing gear from the system tree.
3. Reveal the selected system while retaining a faint aircraft silhouette for spatial context.
4. Select a wheel or brake occurrence.
5. Read its function, approximate placement, and representation-fidelity label.
6. Open a reviewed part identity where available; otherwise see unresolved candidates with explanations.
7. Choose a condition and commercial basis before comparing evidence.
8. Inspect the underlying observation, source link, date, and exclusions.
9. Add an eligible item and a stated quantity to a replacement-component basket.

This journey must work even if step 6 ends with no verified mapping or step 7 has no numeric offers.

## Core journey: start with a part number

Search prioritizes an exact manufacturer-scoped part-number match. The result shows its manufacturer, relevant aircraft references, and whether there is a visual occurrence. Selecting an occurrence opens the relevant aircraft revision and focuses the model. When applicability is conditional, the interface explains the missing configuration attributes before presenting it as a compatible selection.

A part with multiple occurrences opens an occurrence chooser. A known catalog part with no geometry opens a text detail view and highlights its approximate system only if that relation has been reviewed.

## Inspection panel hierarchy

The first section shows component name, function, system, and location. The second shows the selected aircraft configuration and mapping status. The third shows the selected part identity and condition. The fourth shows price evidence and basis. Sources, review dates, related components, and a correction action follow.

For numeric evidence, show currency, unit basis, price kind, condition, evidence count, independent seller count, effective date or observation date, and freshness. Place core obligations adjacent to exchange prices. Place missing-cost exclusions adjacent to scenario subtotals.

Do not make users open a disclaimer to learn that a price is estimated or that a geometry model is approximate. Those are meaningful attributes of the item they are inspecting.

## Functional requirements

| ID | Requirement | Acceptance behavior |
| --- | --- | --- |
| UX-01 | Rotate, pan, zoom, and reset | Pointer, touch, and named camera presets work without losing selection |
| UX-02 | Select components | Model selection and text-tree selection resolve to the same occurrence |
| UX-03 | Reveal internal systems | Visibility changes retain context and exclude hidden meshes from picking |
| UX-04 | Isolate and restore | Previous visibility and camera state can be restored predictably |
| UX-05 | Explode selected scope | Only the chosen system or assembly separates; identity remains stable |
| UX-06 | Search names and identities | Exact part numbers rank above fuzzy name matches |
| UX-07 | Show applicability | Unsupported, conditional, and unknown mappings remain distinguishable |
| UX-08 | Show evidence | Each public numeric observation exposes permitted source context and date |
| UX-09 | Filter comparable prices | Condition and sale basis are explicit, with a visible active filter summary |
| UX-10 | Show cost overlay | Unpriced nodes use a distinct treatment; active basis and currency are visible |
| UX-11 | Compare | Incompatible commercial bases are separated or explained, never silently pooled |
| UX-12 | Build a bounded basket | Quantities, overlap exclusions, and coverage appear beside the subtotal |
| UX-13 | Share a view | A stable link restores aircraft revision, occurrence, and public filters |
| UX-14 | Review corrections | Staff see old evidence, proposed change, reason, and affected outputs |
| UX-15 | Fall back to text | Core discovery and price inspection work without WebGL |

## Visual modes

Assembled mode explains placement. System mode emphasizes function. Cutaway mode reveals internals while explaining that cut surfaces are visualization effects. Exploded mode explains the relationship of assemblies and components. Cost mode changes color according to one comparable metric. Coverage mode distinguishes verified mappings, approximate educational components, and absent price evidence.

Cost mode defaults to eligible unit-price summaries for one selected condition and sale basis. A separate contribution mode multiplies by resolved occurrence quantity. Never switch between those meanings without changing the legend and label. Use a fixed legend within a comparison session so changing aircraft does not create a misleading color comparison. A logarithmic color scale is acceptable if clearly labeled; the text panel always shows the actual amounts.

## State and edge cases

| State | User-facing behavior |
| --- | --- |
| No part mapping | Explain the component; say that a specific part identity has not been verified |
| Multiple candidate parts | Request or display the configuration distinction; offer candidate inspection |
| No numeric evidence | Show “No public price available” and authorized nonnumeric source references |
| Quote required | Show “Request quote at source”; no automatic outbound request |
| Expired quote | Retain as historical only where permitted; exclude from current summary |
| Stale observation | Show the date and stale state; require explicit historical inclusion |
| Unknown currency or unit | Show unnormalized evidence, excluded from numeric comparisons |
| One seller | Show the observed offer and single-seller limitation; suppress market-range language |
| Restricted evidence | Show only permitted public metadata; no private values or revealing counts |
| Asset unavailable | Keep text tree, component descriptions, and eligible evidence usable |
| Source removed | Explain that current evidence is unavailable without exposing revoked content |
| Configuration changed | Clear invalid selections and explain removed basket items |

## Accessibility and interaction

Target WCAG 2.2 AA for the application interface. Provide keyboard-operable equivalents for spatial selection, visible focus, accessible panel names, text alternatives for color meaning, reduced-motion behavior, and non-drag alternatives. The detailed conformance audit belongs in validation. [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Use conservative touch targets, protect against accidental selection after an orbit gesture, and avoid hover-only information. Reduced-motion mode moves directly to exploded positions without animated flight. Announce component selection and loading outcomes through the text interface without streaming every camera change to assistive technology.

## Sharing, privacy, and analytics

Public share links contain reference identifiers and display state, not private quote amounts, credentials, or organization notes. Restricted views require authorization when reopened. Old model revisions resolve explicitly or offer a clearly labeled current replacement.

Measure component selection, search success, source inspection, fallback use, and comparison completion. Do not place private part lists, quotations, user-entered supplier notes, or full source URLs with sensitive query parameters into analytics payloads.

## Content voice

Use plain explanations first and technical terminology second. Prefer “This unit helps control…” over an unexplained acronym. Do not fill unknown facts with generic prose that appears component-specific. Educational descriptions carry references and editorial review state separately from pricing review state.
