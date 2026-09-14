# Human Atlas assessment

## Evidence inspected

The assessment reviewed the public repository landing page and README, package manifest, and license on September 14, 2026. It did not run the project, benchmark its rendering, audit all source files, or verify its behavior on physical devices. Treat implementation reuse as a later code-review decision.

The reference describes selectable 3D anatomy, system visibility, search, isolation, exploded arrangements, and mobile controls. Its README reports batched geometry, per-structure rendering controls, and rendering on scene changes. These are documented claims from the project, rather than measurements made for Planatomy. [Human Atlas repository](https://github.com/ashemag/human-atlas)

The package manifest identifies React, Three.js, TypeScript, and Vite among its dependencies and build tools. Planatomy can use those technologies without inheriting the reference's complete dependency set or version choices. [Human Atlas package manifest](https://raw.githubusercontent.com/ashemag/human-atlas/main/package.json)

## What “looks like this” means for this specification

Interpret the reference as an interaction and information-layout direction: a central manipulable object, selective layers, a searchable hierarchy, a contextual detail panel, and an exploded inspection mode. Do not interpret it as a request to copy branding, reproduce human anatomy assets, or assume the same geometry pipeline fits aviation.

The aviation viewer should feel similarly immediate. A person should not have to understand a technical catalog before opening a plane and selecting a visible system. Once the person reaches a part identity or price, the additional aviation-specific distinctions should appear in context.

## Proposed adaptation

| Reference interaction | Planatomy behavior | Aviation requirement |
| --- | --- | --- |
| Whole-object exploration | Rotate and inspect aircraft exterior | Keep orientation and aircraft-reference identity visible |
| Layer visibility | Reveal propulsion, structure, cabin, or hydraulic components | Permit overlapping functional and physical classifications |
| Structure selection | Select a component occurrence | Separate visual occurrence from catalog part identity |
| Search | Search component names, aliases, and part numbers | Manufacturer-scoped identity and configuration filters |
| Isolate | Inspect a component with its parent context | Show approximate geometry and mapping status |
| Exploded arrangement | Separate selected assembly components | Preserve parent relationships and avoid implying disassembly instructions |
| Detail panel | Function, identity, applicability, evidence, and price | Date, condition, sale basis, provenance, rights |

## Reuse decision

Prefer a new aircraft-specific data model and application architecture, informed by the reference interactions. Consider selective reuse of viewer techniques only after inspecting their coupling to the human anatomy format. The first rendering spike should compare a simple Three.js implementation against any reusable batching or picking approach.

Do not commit to copying a complex rendering optimization before measuring the pilot scene. A scene with a limited number of selectable aircraft assemblies may perform well with simpler methods. Preserve stable semantic identifiers whichever rendering strategy is chosen.

## License boundary

The repository's application license is MIT, with preservation of its copyright and permission notice required when copying substantial portions. Record the specific source revision and reused material if reuse occurs. [Human Atlas license](https://raw.githubusercontent.com/ashemag/human-atlas/main/LICENSE)

The reference identifies its anatomy data as separately licensed. No aircraft geometry rights follow from the availability of the reference application. Planatomy requires its own aircraft asset permissions and credits. [Human Atlas data and attribution notes](https://github.com/ashemag/human-atlas#anatomy-data)

## Main architectural difference

Planatomy's evidence changes over time and may have audience restrictions. Geometry can remain stable while a source disappears, an offer expires, a mapping is corrected, or a part becomes associated with another reference configuration. Therefore, geometry identifiers must refer to a versioned knowledge layer rather than embed current prices directly in the model.

The browser loads a scene manifest and geometry from the asset delivery layer. It resolves component facts and prices through application resources. A price correction should not require rebuilding a mesh. A geometry re-export should not create a new commercial identity for the same part.

## Deferred technical assessment checklist

Before reusing source, inspect selection correctness with transformed geometry, disposal of GPU resources, visibility and picking consistency, mobile gesture handling, keyboard alternatives, dependency exposure, and model-format assumptions. Confirm that upstream asset attribution remains intact and that adapted shader behavior can represent multiple occurrences of one part identity.

The result of that assessment should be a short reuse decision with copied-file inventory, attribution obligations, measured benefit, and maintenance burden. No code has been copied as part of this documentation deliverable.
