# 3D asset pipeline

## Visual objective

Produce a recognizable passenger-jet reference with useful internal component placement, selective system visibility, and reliable component picking. Prioritize meaningful segmentation over photorealism. An exterior-only model with thousands of decorative polygons is less useful than a simpler model with correctly identified systems and reviewed component occurrences.

The viewer is an educational and research representation. Exploded views illustrate relationships and are not maintenance disassembly procedures. Geometry fidelity and semantic mapping confidence are independently tracked.

## Asset brief for the pilot

Commission or license one exterior shell, major structural groups, engine and nacelle groups, landing gear and wheel/brake assemblies, selected flight-control surfaces and actuators, representative internal equipment, and enough cabin context to orient the user. Build only the internal detail supported by references and the curated component scope.

Deliver the editable source asset, browser-ready exports, component mapping inventory, license record, provenance notes, scale and coordinate specification, and a list of approximations. The artist must identify what is modeled accurately, schematically, or only by approximate placement.

## Acquisition acceptance

Confirm commercial browser display and delivery rights, derivative-work rights, attribution, geographic or audience limits, ownership of commissioned additions, and continued use after a contract ends. A render-only license may be unsuitable because a browser receives geometry. Do not promise that delivered meshes cannot be extracted by a determined visitor.

An asset must pass both rights review and technical review before it becomes a public CDN object. Store draft engineering or licensed source files privately. Public exports may contain less detail than the source material, but simplification does not automatically remove license restrictions.

## Authoring conventions

Use one declared coordinate convention: meters, right-handed coordinates, positive Y upward, positive Z toward the aircraft nose, and positive X toward the aircraft's right side. Document the source-to-runtime transform and verify handedness with labeled reference axes. If a source asset uses a different convention, normalize at import rather than applying undocumented per-view corrections.

Choose a documented aircraft reference origin suitable for stable transforms, such as a reviewed reference point near the aircraft center. Preserve each component's assembled transform, bounds, pivot, and occurrence mapping. Relative placement should remain stable across export revisions.

Do not encode part numbers as the only mesh names. Use stable asset-node identifiers and a separate semantic manifest. Names help artists and reviewers; identifiers bind application data.

## Processing stages

| Stage | Responsibility | Acceptance artifact |
| --- | --- | --- |
| Acquire | Establish rights and source provenance | Asset license and source inventory |
| Normalize | Units, axes, transforms, naming, topology cleanup | Normalized editable asset |
| Segment | Separate selectable semantic regions | Node-to-occurrence draft map |
| Review anatomy | Check placement and scope against references | Approved mapping and fidelity notes |
| Optimize | Reduce geometry, materials, textures, and draw overhead | Quality-tier exports |
| Validate | Check format, references, selection, and bounds | Validation report and visual review |
| Package | Create immutable assets and manifest | Versioned release candidate |
| Publish | Promote compatible catalog and geometry set | Public release pointer |

## Delivery format

Use glTF/GLB for runtime scene delivery, with separate logical chunks for the exterior and major assemblies. Khronos describes glTF as a format for efficient transmission and loading of 3D scenes. The format supports the delivery strategy; Planatomy still owns semantic mapping and application-level validation. [Khronos glTF](https://www.khronos.org/gltf/)

Use compressed geometry and textures when supported and validated on target devices. Keep a small required extension set and verify decoder compatibility. A compressed download can expand substantially in CPU and GPU memory, so measure both transfer size and resident memory.

## Manifest responsibilities

The scene manifest records release ID, asset hashes, quality tier, required decoders, coordinate convention, overall bounds, chunk dependencies, node-to-occurrence mappings, selection geometry references, system memberships, fidelity labels, and credits. It references a specific catalog revision.

Validate every referenced occurrence before publication. One occurrence can map to several meshes, and grouped schematic meshes can map to several occurrences with a chooser. Price data stays outside the manifest so price refreshes do not invalidate immutable geometry caches.

## Rendering approach

Start with straightforward scene objects, selective instancing for repeated geometry, shared materials, and rendering when the scene changes. Measure before adding custom GPU batching. Any batching must preserve a semantic identifier for each selectable occurrence and support visibility, highlighting, and exploded transforms.

Keep picking consistent with rendered transforms and clipping. Hidden or clipped geometry must not intercept selection invisibly. If simplified collision or picking meshes are used, ensure selection boundaries remain understandable and small components remain reachable through the text tree.

Dispose of textures, buffers, event listeners, and workers when switching aircraft releases. An application that performs well on first load can still fail after several aircraft changes if resources accumulate.

## Exploded views

Separate only the active assembly or system by default. Use reviewed offsets or deterministic layout rules that preserve a visual relationship to the parent. Add subtle connection lines only when they improve understanding. Do not scatter the entire aircraft's component inventory indiscriminately.

Keep assembled transforms immutable and derive exploded positions from the selected mode and factor. Picking and label anchors must use the same transform state as rendering. Frame the full selected scope after separation, accounting for the inspection panel and mobile viewport.

When a component belongs to several functional systems, explode its physical occurrence once. A price overlay follows the occurrence to its exploded position and retains the same unit or contribution basis.

## Cutaways and transparency

Prefer deliberate shell hiding and clipping for internal inspection. Full-scene transparency can create confusing depth ordering and excessive rendering cost. Cap cut surfaces or use a consistent explanatory treatment where practical. Provide a quick return to an assembled exterior view.

A selected component remains visually distinguishable through outlines or local isolation. Avoid making a tiny expensive component impossible to select because it is behind a translucent large assembly.

## Proposed performance budgets

| Measure | Pilot target | Qualification |
| --- | --- | --- |
| First usable exterior payload | At most 8 MB compressed geometry and textures | Excludes later on-demand assemblies |
| Full pilot reference payload | At most 30 MB compressed | Goal subject to anatomy fidelity review |
| Initial mobile scene | At most 300,000 visible triangles | Starting budget, not a universal device limit |
| Full desktop scene | At most 1 million visible triangles | Prefer lower when equivalent meaning is preserved |
| Draw calls in normal view | At most 150 | Measure representative system and cost modes |
| Resident graphics-related memory | At most 250 MB on reference mobile profile | Must include decoded textures and geometry |
| Sustained interaction | At least 30 frames per second on reference mobile, 50 on reference desktop | Measured over the agreed interaction trace |

Choose actual physical reference devices during the rendering spike and record them. Browser emulation alone cannot establish memory behavior or real multitouch usability. If budgets fail, reduce initial detail and defer loading rather than weakening the text research experience.

## Visual QA

Review front, rear, side, top, underside, and interior system views. Test camera framing at wide desktop, narrow portrait phone, and landscape phone dimensions. Inspect exploded layouts for overlap, clipped selection, unreadable labels, and confusing parent relationships.

Check a sample of every mapping type: one mesh to one occurrence, many meshes to one occurrence, grouped meshes, repeated instances, and unpriced nodes. Compare the model-selected and tree-selected identities. Record known fidelity exceptions in the release instead of burying them in asset filenames.

## Expansion to more aircraft

Reuse generic component concepts, materials, and interface behaviors. Reuse geometry only when rights and applicability support it. New aircraft receive their own occurrence layout, configuration revision, and mapping review. A visually similar engine or wheel is not automatically the same catalog item.
