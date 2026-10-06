import { useState } from 'react';
import { BodyMap } from '../components/BodyMap';
import { REGIONS, type RegionId } from '../domain';

export function App() {
  const [selected, setSelected] = useState<ReadonlySet<RegionId>>(new Set());

  const toggle = (id: RegionId) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Keep the display order stable (curated order, not click order).
  const selectedLabels = REGIONS.filter((r) => selected.has(r.id)).map((r) => r.label);

  return (
    <main className="app">
      <h1>Where do you notice it?</h1>
      <p className="muted">Tap the areas of your body where you feel something right now.</p>
      <BodyMap selected={selected} onToggle={toggle} />
      <p aria-live="polite" className="muted">
        {selectedLabels.length ? selectedLabels.join(', ') : 'Nothing selected yet'}
      </p>
    </main>
  );
}
