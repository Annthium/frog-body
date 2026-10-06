// Stable quality IDs (DECISIONS 007, 009). Safe to append to.
export const QUALITIES = [
  { id: 'tight', label: 'Tight' },
  { id: 'heavy', label: 'Heavy' },
  { id: 'warm', label: 'Warm' },
  { id: 'cold', label: 'Cold' },
  { id: 'tingling', label: 'Tingling' },
  { id: 'buzzing', label: 'Buzzing' },
  { id: 'aching', label: 'Aching' },
  { id: 'numb', label: 'Numb' },
] as const;

export type QualityId = (typeof QUALITIES)[number]['id'];
