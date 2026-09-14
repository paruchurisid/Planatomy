# Part resolution

## Objective

Resolution establishes which manufacturer-scoped part an observation concerns. Applicability establishes whether that part is supported for a selected aircraft reference or component role. The system performs these evaluations separately and retains the evidence for each.

A correct text match does not establish aircraft compatibility. A model-family tag does not establish a precise part match. An attractive geometric resemblance establishes neither.

## Resolution sequence

1. Preserve the source's original identity fields and locators.
2. Identify whether the number is a manufacturer part number, seller stock code, assembly number, serial number, or unknown identifier.
3. Resolve the issuer or manufacturer using a reviewed organization dictionary.
4. Search exact manufacturer-scoped part identities.
5. Apply only reviewed normalization and alias rules.
6. Generate unresolved candidates for fuzzy or incomplete inputs.
7. Review conflicting identities and ambiguous source associations.
8. Evaluate applicability separately against the reference configuration.
9. Publish the decision with its rule version, evidence, and reviewer where required.

## Safe normalization

Whitespace normalization, case-insensitive lookup where the namespace supports it, and display-entity decoding are acceptable search transformations. Preserve exact source spelling as evidence. Keep leading zeros, dash suffixes, slashes, revision markers, and manufacturer-defined punctuation until a namespace-specific rule establishes equivalence.

OCR confusions such as the letter O versus zero, I versus one, or a missing dash generate candidates. They cannot create an automatic exact match. A suffix may distinguish a materially different part; removing it for search must never change the canonical identity.

## Decision classes

| Class | Evidence | Publication behavior |
| --- | --- | --- |
| Exact verified identity | Issuer and exact identifier match a reviewed part record | Eligible for automatic observation attachment after validation |
| Reviewed alias | Explicit alias mapping with source and scope | Eligible within alias constraints |
| Unique candidate, incomplete evidence | Plausible identity but issuer or variant unresolved | Human review; no public price attachment |
| Several candidates | Multiple identities share the observed text | Ambiguity shown in review |
| Conflicting evidence | Fields or sources disagree about identity | Quarantine and resolve |
| Unmatched | No defensible catalog candidate | Keep discovery record; no invented part |

Use these explainable classes in the MVP rather than a pseudo-precise numerical confidence score. Later statistical ranking may order review candidates, but cannot override a hard identity contradiction.

## Candidate ranking

Rank exact identifiers first, then reviewed aliases, then names within the known manufacturer and component category. Use function, parent assembly, aircraft tags, dimensions, and descriptive similarity only as supporting evidence. Keep candidate-generation scores separate from the final match decision.

For every proposed match, show the reviewer what agrees, what differs, which fields are missing, and what rule produced the candidate. A reviewer should not need to reverse-engineer a similarity score.

## Applicability evaluation

Evaluate the part's reviewed applicability assertions against the selected configuration revision. Match all required attributes and temporal conditions. An exact identity with unknown engine option remains unresolved for an engine-specific occurrence. A broad source statement cannot erase a narrower exclusion without explicit review.

When several alternative parts remain supported, show alternatives rather than choosing the least expensive as the installed part. A user's chosen alternative for a hypothetical basket is a scenario assumption, not a modification to the aircraft reference.

## Difficult cases

| Case | Required behavior |
| --- | --- |
| Same number from different issuers | Preserve separate identities |
| Distributor SKU differs from manufacturer number | Map through a reviewed seller alias |
| Number appears in a cross-reference table | Preserve table relation type; do not assume identity |
| Replacement or supersession chain | Store direction and conditions; evaluate each edge |
| Kit contains several parts | Keep kit identity and inclusion scope distinct |
| Repaired unit retains original identity | Condition is an offer or asset attribute, not a new part identity by default |
| Software or hardware revision differs | Preserve revision where it changes scope or applicability |
| One listing contains selectable variants | Bind price only to the explicitly selected variant |
| Identical text syndicated across sites | Resolve identity once but retain all source lineage |
| Supplier claims aircraft applicability | Store as a supplier assertion pending stronger support |

## Review workflow

A case enters pending, assigned, reviewed, and either approved, rejected, or needs-evidence. Approval records a specific decision; a free-text note alone is insufficient. Show current catalog identity, candidate source fields, permitted evidence, aircraft context, rights, and downstream affected objects.

For the pilot, require a second reviewer for ambiguous identity merges, supersession or interchangeability assertions, and configuration changes that affect published price associations. Straightforward exact matches from an approved adapter need not receive repeated manual approval for every refresh.

Identity merges must be reversible through explicit alias and redirect records. Before merging, inspect manufacturer namespace, suffix, and historical offer consequences. Do not delete the losing identity and strand old observations.

## Evaluation

Build a labeled pilot set containing exact matches, leading-zero cases, dash differences, issuer collisions, OCR errors, seller SKUs, assembly-versus-child ambiguity, and unsupported aircraft tags. Measure precision of automatic attachments separately from candidate recall and review completion time.

Launch requires no known wrong automatic attachments in the reviewed critical-case set and at least 99% precision on an independent sample of 200 automatic-eligible decisions, when that sample exists. If the pilot lacks 200 cases, report the actual sample size and keep new identity mappings under human review. Do not claim that a small perfect sample proves 99% population precision.

Track false-positive cost more heavily than unresolved cases. An honest unresolved identity is a usable state; a confident wrong price attached to the model undermines the whole product.
