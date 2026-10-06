# Decision Log (append-only)

Format: **Decision** - why - revisit when.

## 001 - Core product is a body-map check-in plus light pattern view
Clear core loop (check in, see patterns, learn). Small data model, distinctive UI.
Revisit: if engagement suggests guided exercises or lessons are needed.

## 002 - No LLM in v1
Keeps privacy simple and insights transparent and testable.
Revisit: after the core loop works; consider opt-in, privacy-preserving options.

## 003 - Audience: general wellness; learning from the user's own data only
Narrow focus for v1. Curated educational content deferred.

## 004 - Local-first PWA: Vite, React, TS, SVG, Dexie, Vitest
No backend, no accounts, minimal privacy surface, fast iteration.
Revisit: if sync or heavy analytics are needed.

## 005 - IndexedDB (Dexie) over relational DB
Data is document-shaped, queries are simple, personal scale is small, and SQLite WASM adds setup cost.
Data access goes through a repository interface so SQLite WASM stays swappable.
Revisit: if adding a sync backend, or if SQL is wanted as a learning goal.

## 006 - Single emotion per check-in in v1
Simpler UX and insight math. Door kept open via getEmotions() helper and a future
Dexie migration (emotion -> emotions[], multi-entry index).

## 007 - Sensations = region + optional intensity + optional quality (curated lists)
Adds richness without free-text complexity. Qualities can expand without breaking the model.

## 008 - Not a medical tool
Disclaimer in-app plus static crisis-resources link. No diagnostic language in insights.

## 009 - Stable string IDs for regions/emotions/qualities
Decouples stored data from SVG paths and labels, so the body can be redrawn or relabeled without migration.