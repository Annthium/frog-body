// Geometry for a ring of equal wedges, centred on (0, 0). Angles are in degrees,
// clockwise from the positive x-axis (SVG's y-axis points down), so -90 is the top.

export const OUTER_RADIUS = 150;
export const INNER_RADIUS = 56;
export const LABEL_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;

export type Wedge = { start: number; end: number; mid: number };

/** n equal wedges, the first one centred at the top. */
export function wedges(n: number): Wedge[] {
  const size = 360 / n;
  return Array.from({ length: n }, (_, i) => {
    const mid = -90 + i * size;
    return { start: mid - size / 2, end: mid + size / 2, mid };
  });
}

export function polar(radius: number, angle: number): { x: number; y: number } {
  const rad = (angle * Math.PI) / 180;
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

/** SVG path for a ring segment between the inner and outer radius. */
export function wedgePath({ start, end }: Wedge, inner = INNER_RADIUS, outer = OUTER_RADIUS): string {
  const large = end - start > 180 ? 1 : 0;
  const o0 = polar(outer, start);
  const o1 = polar(outer, end);
  const i1 = polar(inner, end);
  const i0 = polar(inner, start);
  const f = (n: number) => n.toFixed(2);
  return [
    `M ${f(o0.x)} ${f(o0.y)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${f(o1.x)} ${f(o1.y)}`,
    `L ${f(i1.x)} ${f(i1.y)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${f(i0.x)} ${f(i0.y)}`,
    'Z',
  ].join(' ');
}
