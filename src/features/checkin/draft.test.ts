import { describe, expect, it } from 'vitest';
import { EMPTY_DRAFT, NOTE_MAX_LENGTH, buildCheckIn, canSave, toggleRegion, updateSensation } from './draft';

describe('canSave', () => {
  it('requires an emotion', () => {
    expect(canSave(EMPTY_DRAFT)).toBe(false);
    expect(canSave({ ...EMPTY_DRAFT, emotion: 'sad' })).toBe(true);
  });
});

describe('toggleRegion', () => {
  it('adds a missing region and removes a present one with its details', () => {
    const added = toggleRegion([], 'chest');
    expect(added).toEqual([{ regionId: 'chest' }]);
    const detailed = updateSensation(added, 'chest', { intensity: 3 });
    expect(toggleRegion(detailed, 'chest')).toEqual([]);
  });
});

describe('buildCheckIn', () => {
  it('fills in id, time and schema version', () => {
    const c = buildCheckIn({ ...EMPTY_DRAFT, emotion: 'calm' }, 1234, 'id-1');
    expect(c).toEqual({ id: 'id-1', createdAt: 1234, emotion: 'calm', sensations: [], schemaVersion: 1 });
  });

  it('throws without an emotion', () => {
    expect(() => buildCheckIn(EMPTY_DRAFT)).toThrow();
  });

  it('sorts sensations in body order and drops unset details', () => {
    const c = buildCheckIn({
      ...EMPTY_DRAFT,
      emotion: 'anxious',
      sensations: [
        { regionId: 'feet', intensity: undefined },
        { regionId: 'chest', intensity: 2, quality: 'tight' },
      ],
    });
    expect(c.sensations).toEqual([{ regionId: 'chest', intensity: 2, quality: 'tight' }, { regionId: 'feet' }]);
    expect('intensity' in c.sensations[1]).toBe(false);
  });

  it('trims the note and omits it when blank', () => {
    expect(buildCheckIn({ ...EMPTY_DRAFT, emotion: 'sad', note: '  rainy day  ' }).note).toBe('rainy day');
    expect('note' in buildCheckIn({ ...EMPTY_DRAFT, emotion: 'sad', note: '   ' })).toBe(false);
  });

  it('caps the note length', () => {
    const c = buildCheckIn({ ...EMPTY_DRAFT, emotion: 'sad', note: 'x'.repeat(NOTE_MAX_LENGTH + 20) });
    expect(c.note).toHaveLength(NOTE_MAX_LENGTH);
  });
});
