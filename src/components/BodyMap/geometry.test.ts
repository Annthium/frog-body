import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../domain';
import { GEOMETRY } from './geometry';

describe('body map geometry', () => {
  it('draws every region in at least one view', () => {
    const drawn = new Set(Object.values(GEOMETRY).flatMap((view) => Object.keys(view)));
    const missing = REGIONS.map((r) => r.id).filter((id) => !drawn.has(id));
    expect(missing).toEqual([]);
  });
});
