import { QUALITIES, regionLabel, type Intensity, type QualityId, type RegionId, type Sensation } from '../../domain';

type Props = {
  sensations: Sensation[];
  onChange: (regionId: RegionId, patch: Partial<Sensation>) => void;
  onRemove: (regionId: RegionId) => void;
};

const INTENSITIES: { value: Intensity; label: string }[] = [
  { value: 1, label: 'Mild' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Strong' },
];

/** Optional intensity and quality for each selected region. */
export function SensationList({ sensations, onChange, onRemove }: Props) {
  if (sensations.length === 0) {
    return <p className="muted">Nothing selected. That's fine too.</p>;
  }

  return (
    <ul className="sensation-list">
      {sensations.map((s) => {
        const label = regionLabel(s.regionId);
        return (
          <li key={s.regionId} className="sensation">
            <div className="sensation__head">
              <span className="sensation__name">{label}</span>
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove ${label}`}
                onClick={() => onRemove(s.regionId)}
              >
                ×
              </button>
            </div>
            <div className="sensation__fields">
              <div className="segmented" role="group" aria-label={`${label} intensity`}>
                {INTENSITIES.map((i) => (
                  <button
                    key={i.value}
                    type="button"
                    aria-pressed={s.intensity === i.value}
                    onClick={() => onChange(s.regionId, { intensity: s.intensity === i.value ? undefined : i.value })}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
              <select
                className="select"
                aria-label={`${label} quality`}
                value={s.quality ?? ''}
                onChange={(e) =>
                  onChange(s.regionId, { quality: (e.target.value || undefined) as QualityId | undefined })
                }
              >
                <option value="">Feels like…</option>
                {QUALITIES.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
