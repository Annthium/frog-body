import { useState, type KeyboardEvent } from 'react';
import {
  CORE_EMOTIONS,
  NOT_SURE,
  childEmotions,
  emotionLabel,
  getCoreEmotion,
  type CoreEmotionId,
  type EmotionId,
  type EmotionOption,
} from '../../domain';
import { INNER_RADIUS, LABEL_RADIUS, OUTER_RADIUS, polar, wedgePath, wedges } from './wheelGeometry';
import './EmotionWheel.css';

type Props = {
  value: EmotionId | null;
  onChange: (emotion: EmotionId | null) => void;
};

const SIZE = OUTER_RADIUS + 4;

/**
 * Two-layer feelings wheel, one layer at a time: tap a broad emotion to choose it
 * and see more specific ones; tap the centre to go back. Stopping at the broad
 * layer is a complete answer.
 */
export function EmotionWheel({ value, onChange }: Props) {
  const [openCore, setOpenCore] = useState<CoreEmotionId | null>(null);

  const core = value ? getCoreEmotion(value) : null;
  const activeCore = core === NOT_SURE ? null : core;
  // Only show the inner layer while it matches the current value, so clearing
  // the form (value -> null) returns to the broad layer without extra state sync.
  const layer = openCore !== null && openCore === activeCore ? openCore : null;

  const options: EmotionOption[] = layer ? childEmotions(layer) : CORE_EMOTIONS;
  const isPressed = (id: EmotionId) => (layer ? value === id : activeCore === id);

  const choose = (id: EmotionId) => {
    if (layer) {
      onChange(value === id ? layer : id);
    } else {
      // Re-opening the active broad emotion keeps a specific choice made earlier.
      if (activeCore !== id) onChange(id);
      setOpenCore(id as CoreEmotionId);
    }
  };

  return (
    <fieldset className="emotion-wheel">
      <legend>How are you feeling?</legend>

      <svg
        className="emotion-wheel__svg"
        viewBox={`${-SIZE} ${-SIZE} ${SIZE * 2} ${SIZE * 2}`}
        role="group"
        aria-label={layer ? `More specific ways to feel ${emotionLabel(layer).toLowerCase()}` : 'Broad feelings'}
      >
        {/* Keyed by layer so each layer animates in when it appears. */}
        <g key={layer ?? 'core'} className="emotion-wheel__layer">
          {wedges(options.length).map((w, i) => {
            const option = options[i];
            const label = polar(LABEL_RADIUS, w.mid);
            return (
              <Wedge
                key={option.id}
                path={wedgePath(w)}
                labelX={label.x}
                labelY={label.y}
                label={option.label}
                hue={getCoreEmotion(option.id)}
                pressed={isPressed(option.id)}
                small={layer !== null}
                onActivate={() => choose(option.id)}
              />
            );
          })}
        </g>
        <Centre layer={layer} onBack={() => setOpenCore(null)} />
      </svg>

      <p className="emotion-wheel__status" aria-live="polite">
        <Status value={value} layer={layer} />
      </p>

      <button
        type="button"
        className="chip chip--quiet"
        aria-pressed={value === NOT_SURE}
        onClick={() => {
          onChange(value === NOT_SURE ? null : NOT_SURE);
          setOpenCore(null);
        }}
      >
        {emotionLabel(NOT_SURE)}
      </button>
    </fieldset>
  );
}

function activateOnKey(onActivate: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  };
}

type WedgeProps = {
  path: string;
  labelX: number;
  labelY: number;
  label: string;
  hue: string;
  pressed: boolean;
  small: boolean;
  onActivate: () => void;
};

function Wedge({ path, labelX, labelY, label, hue, pressed, small, onActivate }: WedgeProps) {
  return (
    <g
      className="emotion-wheel__wedge"
      data-hue={hue}
      role="button"
      aria-pressed={pressed}
      aria-label={label}
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={activateOnKey(onActivate)}
    >
      <path d={path} />
      <text x={labelX} y={labelY} className={small ? 'is-small' : undefined}>
        {label}
      </text>
    </g>
  );
}

function Centre({ layer, onBack }: { layer: CoreEmotionId | null; onBack: () => void }) {
  if (!layer) {
    return (
      <g className="emotion-wheel__centre" aria-hidden="true">
        <circle r={INNER_RADIUS - 4} />
        <text y={0} className="is-muted">
          Tap one
        </text>
      </g>
    );
  }
  return (
    <g
      className="emotion-wheel__centre is-button"
      data-hue={layer}
      role="button"
      aria-label="Back to all feelings"
      tabIndex={0}
      onClick={onBack}
      onKeyDown={activateOnKey(onBack)}
    >
      <circle r={INNER_RADIUS - 4} />
      <text y={-8} className="is-strong">
        {emotionLabel(layer)}
      </text>
      <text y={12} className="is-muted">
        ‹ Back
      </text>
    </g>
  );
}

function Status({ value, layer }: { value: EmotionId | null; layer: CoreEmotionId | null }) {
  if (value === null) return <span className="muted">Choose the closest feeling.</span>;
  if (value === NOT_SURE) return <>Not sure, and that's okay.</>;

  const core = getCoreEmotion(value);
  if (value === core) {
    return layer ? (
      <>
        <strong>{emotionLabel(core)}</strong>
        <span className="muted"> · pick a more specific word, or leave it here</span>
      </>
    ) : (
      <strong>{emotionLabel(core)}</strong>
    );
  }
  return (
    <>
      {emotionLabel(core)} › <strong>{emotionLabel(value)}</strong>
    </>
  );
}
