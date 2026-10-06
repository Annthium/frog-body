# Project Overview (current truth)

_Update this file as things change. History of why lives in DECISIONS.md._

## Goal
Help people learn about the connection between their body and emotions through a
daily check-in on a body map and simple pattern views over their own data.

## Audience
General wellness-curious individuals. Side/practice project that may evolve into a product.

## v1 Scope
- **Check-in:** pick one emotion, tap body regions (one figure with a Front/Back switch), optional intensity (1-3) and quality per region, optional one-line note
- **History:** timeline of past check-ins
- **Insights:** aggregated body heatmap; "when you feel X, you tend to notice it in Y"; time-of-day / day-of-week distribution
- **Settings:** JSON export, delete all data
- **Safety:** disclaimer + static link to crisis resources

## Non-goals (v1)
Accounts, sync, backend, LLM features, notifications, curated lessons, multiple emotions per check-in.

## Stack
- Vite 6 + React 19 + TypeScript (Node 22 LTS recommended; Vite 7 needs Node >= 20.19 / 22.12)
- SVG body map as React components (no canvas / image libs)
- Dexie (IndexedDB) behind a repository interface
- vite-plugin-pwa (installable, offline)
- Vitest (focus: insights logic)
- Zustand or plain React state
- Deploy: static hosting (Cloudflare Pages / Netlify / Vercel)

## Data model

```ts
type CheckIn = {
  id: string;
  createdAt: number;            // epoch ms
  emotion: EmotionId;           // single in v1; always read via getEmotions()
  sensations: {
    regionId: RegionId;
    intensity?: 1 | 2 | 3;
    quality?: QualityId;
  }[];
  note?: string;
  schemaVersion: 1;
};
```

- Region / emotion / quality IDs are stable strings defined in code, separate from SVG paths and display labels.
- Insight functions use `getEmotions(checkIn): EmotionId[]` so the later move to `emotions[]` is a one-place change plus a Dexie migration.
- Index `emotion` now; switch to a multi-entry index (`*emotions`) when migrating.

## Curated lists (editable constants)
- **Emotions:** calm, joyful, content, anxious, stressed, sad, angry, lonely, tired, excited (+ maybe "neutral")
- **Qualities:** tight, heavy, warm, cold, tingling, buzzing, aching, numb
- **Regions:** 20 regions in `src/domain/regions.ts`. Left/right sides share one region. Front-only: jaw, throat, chest, upper/lower abdomen, pelvis. Back-only: neck, upper/mid/lower back, glutes. Both views: head, shoulders, upper arms, forearms, hands, thighs, knees, lower legs, feet.

## Insights (pure functions of CheckIn[])
- Region frequency overall (heatmap)
- Region x emotion co-occurrence, with a minimum sample threshold before display
- Time-of-day / day-of-week distribution

## Planned repo layout

```
src/
  domain/        ids, types, curated lists, getEmotions()
  data/          db.ts (Dexie), repository.ts (addCheckIn, listCheckIns, deleteAll, exportAll)
  insights/      pure functions + tests
  components/    BodyMap/, shared UI
  features/      checkin/, history/, insights/, settings/
  app/           routing, layout, providers
docs/            PROJECT.md, DECISIONS.md
```

## Build order
1. ~~Scaffold + SVG body map with region selection~~ (done, placeholder drawing)
2. Check-in form + Dexie persistence
3. History list
4. Insights functions + heatmap view
5. Export/delete, PWA, disclaimer + crisis link

## Open items
- Body-map asset: a placeholder of simple shapes is in place; decide later whether to draw a proper one or license one
- Final emotion and quality lists
- Include a "neutral" emotion?