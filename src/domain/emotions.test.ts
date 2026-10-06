import { describe, expect, it } from 'vitest';
import { getEmotions } from './emotions';

describe('getEmotions', () => {
  it('wraps the single v1 emotion in an array', () => {
    expect(getEmotions({ emotion: 'calm' })).toEqual(['calm']);
  });
});
