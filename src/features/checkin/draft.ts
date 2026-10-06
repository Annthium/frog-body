import { REGIONS, type CheckIn, type EmotionId, type RegionId, type Sensation } from '../../domain';

export const NOTE_MAX_LENGTH = 140;

/** The check-in form's state before saving. */
export type CheckInDraft = {
  emotion: EmotionId | null;
  sensations: Sensation[];
  note: string;
};

export const EMPTY_DRAFT: CheckInDraft = { emotion: null, sensations: [], note: '' };

/** An emotion is the only required field; zero regions is a valid check-in. */
export function canSave(draft: CheckInDraft): boolean {
  return draft.emotion !== null;
}

/** Add the region if absent, remove it (and its details) if present. */
export function toggleRegion(sensations: Sensation[], regionId: RegionId): Sensation[] {
  return sensations.some((s) => s.regionId === regionId)
    ? sensations.filter((s) => s.regionId !== regionId)
    : [...sensations, { regionId }];
}

export function updateSensation(sensations: Sensation[], regionId: RegionId, patch: Partial<Sensation>): Sensation[] {
  return sensations.map((s) => (s.regionId === regionId ? { ...s, ...patch } : s));
}

const regionOrder = new Map<RegionId, number>(REGIONS.map((r, i) => [r.id, i]));

export function buildCheckIn(draft: CheckInDraft, now = Date.now(), id: string = crypto.randomUUID()): CheckIn {
  if (draft.emotion === null) throw new Error('A check-in needs an emotion');

  // Stored in body order rather than tap order, with unset details dropped.
  const sensations = [...draft.sensations]
    .sort((a, b) => regionOrder.get(a.regionId)! - regionOrder.get(b.regionId)!)
    .map(({ regionId, intensity, quality }): Sensation => ({
      regionId,
      ...(intensity !== undefined && { intensity }),
      ...(quality !== undefined && { quality }),
    }));

  const note = draft.note.trim().slice(0, NOTE_MAX_LENGTH);

  return {
    id,
    createdAt: now,
    emotion: draft.emotion,
    sensations,
    ...(note && { note }),
    schemaVersion: 1,
  };
}
