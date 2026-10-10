# Authorized aircraft models

This directory is reserved for aircraft meshes that Planatomy is licensed to ship.

The current viewer instead uses original geometry in `web/src/deltaA320.ts` and
does not load files from this directory. The previous `VITE_A320_MODEL_URL` hook
has been removed. Future imports must map separate mesh nodes to assemblies so
that exploded views and system selection are meaningful.

To add an A320 reference model, place an authorized `.glb` file here and record its
creator, source URL, license, and permission scope in `web/public/models/ATTRIBUTION.md`.
Do not place a downloaded Sketchfab file here unless its license permits the intended
Planatomy use (the linked Airbus5717 model is currently listed as CC BY-NC).
