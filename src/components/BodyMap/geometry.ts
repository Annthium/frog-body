import type { RegionId } from '../../domain';

// Placeholder drawing: simple shapes on a 200x436 canvas, one figure per view.
// The drawing can be redrawn freely; only the regionId keys connect it to data.
export type Shape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; r: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number };

export type View = 'front' | 'back';

export const VIEWBOX = '0 0 200 436';

const rect = (x: number, y: number, w: number, h: number, r = 10): Shape => ({ kind: 'rect', x, y, w, h, r });
const ellipse = (cx: number, cy: number, rx: number, ry: number): Shape => ({ kind: 'ellipse', cx, cy, rx, ry });
/** A shape and its mirror across the vertical centre line (x = 100). */
const pair = (s: Shape): Shape[] =>
  s.kind === 'rect' ? [s, { ...s, x: 200 - s.x - s.w }] : [s, { ...s, cx: 200 - s.cx }];

const limbs: Partial<Record<RegionId, Shape[]>> = {
  shoulders: pair(ellipse(58, 94, 14, 11)),
  'upper-arms': pair(rect(38, 106, 22, 58)),
  forearms: pair(rect(34, 168, 20, 56)),
  hands: pair(ellipse(44, 238, 11, 14)),
  thighs: pair(rect(76, 244, 22, 74)),
  knees: pair(ellipse(87, 330, 11, 10)),
  'lower-legs': pair(rect(78, 344, 18, 62, 9)),
  feet: pair(ellipse(86, 418, 14, 8)),
};

// Order matters: later shapes are drawn on top (e.g. jaw over head).
export const GEOMETRY: Record<View, Partial<Record<RegionId, Shape[]>>> = {
  front: {
    head: [ellipse(100, 36, 24, 28)],
    jaw: [rect(84, 54, 32, 12, 6)],
    throat: [rect(90, 68, 20, 16, 4)],
    chest: [rect(70, 88, 60, 44)],
    'upper-abdomen': [rect(72, 136, 56, 36, 8)],
    'lower-abdomen': [rect(74, 176, 52, 34, 8)],
    pelvis: [rect(76, 214, 48, 26)],
    ...limbs,
  },
  back: {
    head: [ellipse(100, 36, 24, 28)],
    neck: [rect(90, 68, 20, 16, 4)],
    'upper-back': [rect(70, 88, 60, 44)],
    'mid-back': [rect(72, 136, 56, 36, 8)],
    'lower-back': [rect(74, 176, 52, 34, 8)],
    glutes: [rect(76, 214, 48, 26)],
    ...limbs,
  },
};
