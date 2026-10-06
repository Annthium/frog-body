# bodymap

Read docs/PROJECT.md (current scope and plan) and docs/DECISIONS.md (why) before starting work.

- Update PROJECT.md when scope, stack or the data model changes; append new decisions to DECISIONS.md (never edit old entries).
- Commands: `npm run dev`, `npm test` (watch), `npm run test:run`, `npm run build`, `npm run lint`.
- Region / emotion / quality IDs in `src/domain/` are stable stored data: never rename them, change labels instead.
- Read emotions only via `getEmotions()`. Insights are pure functions of `CheckIn[]` with Vitest tests.
- Body-map drawing lives in `src/components/BodyMap/geometry.ts`; it may be redrawn freely as long as region IDs stay.
