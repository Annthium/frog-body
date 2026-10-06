import { useState, type KeyboardEvent } from 'react';
import { regionLabel, type RegionId } from '../../domain';
import { GEOMETRY, VIEWBOX, type Shape, type View } from './geometry';
import './BodyMap.css';

type Props = {
  selected: ReadonlySet<RegionId>;
  onToggle: (regionId: RegionId) => void;
};

const VIEWS: { view: View; label: string }[] = [
  { view: 'front', label: 'Front' },
  { view: 'back', label: 'Back' },
];

/** Regions drawn only in this view, i.e. hidden while the other view is shown. */
function onlyIn(view: View): RegionId[] {
  const other = GEOMETRY[view === 'front' ? 'back' : 'front'];
  return (Object.keys(GEOMETRY[view]) as RegionId[]).filter((id) => !(id in other));
}

const EXCLUSIVE: Record<View, RegionId[]> = { front: onlyIn('front'), back: onlyIn('back') };

export function BodyMap({ selected, onToggle }: Props) {
  const [view, setView] = useState<View>('front');
  const label = VIEWS.find((v) => v.view === view)!.label;

  return (
    <div className="body-map">
      <div className="body-map__switch" role="group" aria-label="Body view">
        {VIEWS.map((v) => {
          // Count selections the user can't currently see, so they aren't forgotten.
          const hiddenCount = v.view === view ? 0 : EXCLUSIVE[v.view].filter((id) => selected.has(id)).length;
          return (
            <button
              key={v.view}
              type="button"
              aria-pressed={v.view === view}
              aria-label={hiddenCount > 0 ? `${v.label}, ${hiddenCount} selected` : undefined}
              onClick={() => setView(v.view)}
            >
              {v.label}
              {hiddenCount > 0 && (
                <span className="body-map__badge" aria-hidden="true">
                  {hiddenCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <svg viewBox={VIEWBOX} role="group" aria-label={`Body, ${label.toLowerCase()} view`}>
        {(Object.entries(GEOMETRY[view]) as [RegionId, Shape[]][]).map(([id, shapes]) => (
          <Region key={id} id={id} shapes={shapes} selected={selected.has(id)} onToggle={onToggle} />
        ))}
      </svg>
    </div>
  );
}

type RegionProps = {
  id: RegionId;
  shapes: Shape[];
  selected: boolean;
  onToggle: (regionId: RegionId) => void;
};

function Region({ id, shapes, selected, onToggle }: RegionProps) {
  const label = regionLabel(id);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <g
      className="body-map__region"
      data-region={id}
      role="checkbox"
      aria-checked={selected}
      aria-label={label}
      tabIndex={0}
      onClick={() => onToggle(id)}
      onKeyDown={onKeyDown}
    >
      <title>{label}</title>
      {shapes.map((s, i) =>
        s.kind === 'rect' ? (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} />
        ) : (
          <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />
        ),
      )}
    </g>
  );
}
