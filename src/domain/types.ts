import type { EmotionId } from './emotions';
import type { QualityId } from './qualities';
import type { RegionId } from './regions';

export type Intensity = 1 | 2 | 3;

export type Sensation = {
  regionId: RegionId;
  intensity?: Intensity;
  quality?: QualityId;
};

export type CheckIn = {
  id: string;
  createdAt: number; // epoch ms
  emotion: EmotionId; // single in v1; always read via getEmotions()
  sensations: Sensation[];
  note?: string;
  schemaVersion: 1;
};
