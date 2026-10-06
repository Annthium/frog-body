// Stable region IDs (DECISIONS 009). Never rename an ID once data exists;
// change the label instead. Left/right sides share one region in v1.
export const REGIONS = [
  { id: 'head', label: 'Head' },
  { id: 'jaw', label: 'Jaw' },
  { id: 'throat', label: 'Throat' },
  { id: 'neck', label: 'Back of neck' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'chest', label: 'Chest' },
  { id: 'upper-abdomen', label: 'Upper abdomen' },
  { id: 'lower-abdomen', label: 'Lower abdomen' },
  { id: 'pelvis', label: 'Pelvis' },
  { id: 'upper-back', label: 'Upper back' },
  { id: 'mid-back', label: 'Mid back' },
  { id: 'lower-back', label: 'Lower back' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'upper-arms', label: 'Upper arms' },
  { id: 'forearms', label: 'Forearms' },
  { id: 'hands', label: 'Hands' },
  { id: 'thighs', label: 'Thighs' },
  { id: 'knees', label: 'Knees' },
  { id: 'lower-legs', label: 'Lower legs' },
  { id: 'feet', label: 'Feet' },
] as const;

export type RegionId = (typeof REGIONS)[number]['id'];

const regionLabels = new Map<string, string>(REGIONS.map((r) => [r.id, r.label]));

export function regionLabel(id: RegionId): string {
  return regionLabels.get(id) ?? id;
}
