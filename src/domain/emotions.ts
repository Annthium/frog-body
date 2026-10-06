import type { CheckIn } from './types';

// Stable emotion IDs (DECISIONS 009). "neutral" is still an open question.
export const EMOTIONS = [
  { id: 'calm', label: 'Calm' },
  { id: 'joyful', label: 'Joyful' },
  { id: 'content', label: 'Content' },
  { id: 'excited', label: 'Excited' },
  { id: 'anxious', label: 'Anxious' },
  { id: 'stressed', label: 'Stressed' },
  { id: 'sad', label: 'Sad' },
  { id: 'angry', label: 'Angry' },
  { id: 'lonely', label: 'Lonely' },
  { id: 'tired', label: 'Tired' },
] as const;

export type EmotionId = (typeof EMOTIONS)[number]['id'];

/**
 * The only way to read emotions from a check-in. v1 stores a single emotion;
 * moving to `emotions[]` later only changes this function (DECISIONS 006).
 */
export function getEmotions(checkIn: Pick<CheckIn, 'emotion'>): EmotionId[] {
  return [checkIn.emotion];
}
