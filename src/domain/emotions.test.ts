import { describe, expect, it } from 'vitest';
import {
  ALL_EMOTIONS,
  CORE_EMOTIONS,
  NOT_SURE,
  childEmotions,
  emotionLabel,
  getCoreEmotion,
  getEmotions,
} from './emotions';

describe('getEmotions', () => {
  it('wraps the single v1 emotion in an array', () => {
    expect(getEmotions({ emotion: 'calm' })).toEqual(['calm']);
  });
});

describe('emotion wheel', () => {
  it('has unique IDs across both layers', () => {
    const ids = ALL_EMOTIONS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every core emotion at least one child', () => {
    for (const core of CORE_EMOTIONS) expect(childEmotions(core.id).length).toBeGreaterThan(0);
  });

  it('maps detailed emotions to their core', () => {
    expect(getCoreEmotion('worried')).toBe('scared');
    expect(getCoreEmotion('burnt-out')).toBe('drained');
  });

  it('maps core emotions and "not sure" to themselves', () => {
    expect(getCoreEmotion('sad')).toBe('sad');
    expect(getCoreEmotion(NOT_SURE)).toBe(NOT_SURE);
  });

  it('labels every emotion', () => {
    expect(emotionLabel('burnt-out')).toBe('Burnt out');
    expect(emotionLabel(NOT_SURE)).toBe('Not sure');
  });
});
