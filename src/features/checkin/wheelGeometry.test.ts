import { describe, expect, it } from 'vitest';
import { polar, wedges } from './wheelGeometry';

describe('wedges', () => {
  it('centres the first wedge at the top and covers the full circle', () => {
    const ws = wedges(6);
    expect(ws).toHaveLength(6);
    expect(ws[0].mid).toBe(-90);
    expect(ws[5].end - ws[0].start).toBeCloseTo(360);
  });

  it('places angle -90 at the top of the circle', () => {
    const p = polar(100, -90);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(-100);
  });
});
