import type { CheckIn } from './types';

// Two-layer feelings wheel: broad (core) emotions, each with more specific ones.
// IDs are stable stored data (DECISIONS 009) and unique across both layers.
// Safe to append; adding children never breaks stored check-ins.
const WHEEL = {
  joyful: {
    label: 'Joyful',
    children: { excited: 'Excited', grateful: 'Grateful', proud: 'Proud', hopeful: 'Hopeful', playful: 'Playful' },
  },
  peaceful: {
    label: 'Peaceful',
    children: { calm: 'Calm', content: 'Content', relaxed: 'Relaxed', safe: 'Safe', connected: 'Connected' },
  },
  sad: {
    label: 'Sad',
    children: { lonely: 'Lonely', disappointed: 'Disappointed', hurt: 'Hurt', grieving: 'Grieving', empty: 'Empty' },
  },
  angry: {
    label: 'Angry',
    children: { frustrated: 'Frustrated', irritated: 'Irritated', resentful: 'Resentful', jealous: 'Jealous' },
  },
  scared: {
    label: 'Scared',
    children: {
      anxious: 'Anxious',
      worried: 'Worried',
      overwhelmed: 'Overwhelmed',
      insecure: 'Insecure',
      stressed: 'Stressed',
    },
  },
  drained: {
    label: 'Drained',
    children: { tired: 'Tired', bored: 'Bored', numb: 'Numb', 'burnt-out': 'Burnt out' },
  },
} as const;

type Wheel = typeof WHEEL;

export type CoreEmotionId = keyof Wheel;
export type DetailEmotionId = { [K in CoreEmotionId]: keyof Wheel[K]['children'] }[CoreEmotionId];
/** Shown outside the wheel; has no parent or children. */
export const NOT_SURE = 'not-sure';
export type EmotionId = CoreEmotionId | DetailEmotionId | typeof NOT_SURE;

export type EmotionOption<T extends EmotionId = EmotionId> = { id: T; label: string };

export const CORE_EMOTIONS: EmotionOption<CoreEmotionId>[] = (Object.keys(WHEEL) as CoreEmotionId[]).map((id) => ({
  id,
  label: WHEEL[id].label,
}));

const children = new Map<CoreEmotionId, EmotionOption<DetailEmotionId>[]>(
  CORE_EMOTIONS.map(({ id }) => [
    id,
    Object.entries(WHEEL[id].children).map(([childId, label]) => ({ id: childId as DetailEmotionId, label })),
  ]),
);

const parents = new Map<EmotionId, CoreEmotionId>(
  [...children].flatMap(([core, kids]) => kids.map((k) => [k.id, core] as const)),
);

const labels = new Map<EmotionId, string>([
  ...CORE_EMOTIONS.map((e) => [e.id, e.label] as const),
  ...[...children.values()].flat().map((e) => [e.id, e.label] as const),
  [NOT_SURE, 'Not sure'],
]);

/** Every emotion in display order: each core followed by its children, then "not sure". */
export const ALL_EMOTIONS: EmotionOption[] = [...labels].map(([id, label]) => ({ id, label }));

export function childEmotions(core: CoreEmotionId): EmotionOption<DetailEmotionId>[] {
  return children.get(core) ?? [];
}

export function emotionLabel(id: EmotionId): string {
  return labels.get(id) ?? id;
}

export function isCoreEmotion(id: EmotionId): id is CoreEmotionId {
  return id in WHEEL;
}

/**
 * The broad emotion an emotion belongs to (itself if already core). Insights group
 * by this, since detailed emotions will be too sparse to show patterns early on.
 */
export function getCoreEmotion(id: EmotionId): CoreEmotionId | typeof NOT_SURE {
  if (id === NOT_SURE || isCoreEmotion(id)) return id;
  return parents.get(id) ?? NOT_SURE;
}

/**
 * The only way to read emotions from a check-in. v1 stores a single emotion;
 * moving to `emotions[]` later only changes this function (DECISIONS 006).
 */
export function getEmotions(checkIn: Pick<CheckIn, 'emotion'>): EmotionId[] {
  return [checkIn.emotion];
}
