import {
  CORE_EMOTIONS,
  NOT_SURE,
  childEmotions,
  emotionLabel,
  getCoreEmotion,
  type EmotionId,
} from '../../domain';

type Props = {
  value: EmotionId | null;
  onChange: (emotion: EmotionId | null) => void;
};

/**
 * Two-layer picker: choose a broad emotion, then optionally a more specific one.
 * Laid out as rows of chips for now; becomes a feelings wheel in step 2b.
 */
export function EmotionPicker({ value, onChange }: Props) {
  const core = value ? getCoreEmotion(value) : null;
  const activeCore = core === NOT_SURE ? null : core;

  return (
    <fieldset className="emotion-picker">
      <legend>How are you feeling?</legend>
      <div className="chips">
        {CORE_EMOTIONS.map((e) => (
          <button
            key={e.id}
            type="button"
            className="chip"
            aria-pressed={activeCore === e.id}
            onClick={() => onChange(activeCore === e.id ? null : e.id)}
          >
            {e.label}
          </button>
        ))}
        <button
          type="button"
          className="chip chip--quiet"
          aria-pressed={value === NOT_SURE}
          onClick={() => onChange(value === NOT_SURE ? null : NOT_SURE)}
        >
          {emotionLabel(NOT_SURE)}
        </button>
      </div>

      {activeCore && (
        <div className="emotion-picker__details">
          <p className="muted">More specific? (optional)</p>
          <div className="chips">
            {childEmotions(activeCore).map((e) => (
              <button
                key={e.id}
                type="button"
                className="chip chip--small"
                aria-pressed={value === e.id}
                onClick={() => onChange(value === e.id ? activeCore : e.id)}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
}
