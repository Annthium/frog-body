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

## 010 - Left/right sides share one region; placeholder body drawing
Keeps the region list short (20) and insights readable. The body map is drawn from simple
shapes in geometry.ts so work isn't blocked on the asset decision.
Revisit: if users want to tell left from right, or when a proper body-map asset is chosen.

## 011 - One body figure with a Front/Back switch
Replaces side-by-side views: the figure stays large enough to tap on phones. A badge on the
inactive side shows how many of its regions are selected, so back selections aren't forgotten.
Revisit: if testing shows people miss the back view.

## 012 - Emotions as a two-layer feelings wheel, with our own word list
Inspired by the Feelings Wheel (Willcox, 1982): 6 broad emotions, each with 4-5 specific ones, plus
"Not sure" outside the wheel (replaces the "neutral" question). Our own list rather than a published
wheel's, to avoid licensing questions. A check-in stores the most specific emotion chosen;
insights roll up with getCoreEmotion().
Revisit: when adding a third layer, or if disgust/surprise are wanted.

## 013 - Check-in rules: only emotion is required
Zero regions is valid data ("noticed nothing"). Note capped at 140 chars. After saving, show a
confirmation and clear the form. Emotion picker ships as chip rows first; the wheel layout is step 2b.
Revisit: when History exists (maybe go there after saving).

## 014 - Feelings wheel interaction
One ring of wedges at a time. Tapping a broad emotion selects it (a complete answer) and shows its
specific emotions; tapping the centre goes back without losing the choice. Each broad emotion has
its own hue, shared by its specific emotions, so insights can reuse the colours later.
Revisit: if a third layer is added, or wedges get too narrow for longer word lists.
