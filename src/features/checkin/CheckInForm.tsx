import { useMemo, useState, type FormEvent } from 'react';
import { BodyMap } from '../../components/BodyMap';
import type { CheckIn } from '../../domain';
import { EmotionWheel } from './EmotionWheel';
import { SensationList } from './SensationList';
import {
  EMPTY_DRAFT,
  NOTE_MAX_LENGTH,
  buildCheckIn,
  canSave,
  toggleRegion,
  updateSensation,
  type CheckInDraft,
} from './draft';
import './CheckIn.css';

type Props = {
  onSave: (checkIn: CheckIn) => Promise<void>;
};

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function CheckInForm({ onSave }: Props) {
  const [draft, setDraft] = useState<CheckInDraft>(EMPTY_DRAFT);
  const [status, setStatus] = useState<Status>('idle');

  const selected = useMemo(() => new Set(draft.sensations.map((s) => s.regionId)), [draft.sensations]);

  const edit = (patch: (d: CheckInDraft) => Partial<CheckInDraft>) => {
    setDraft((d) => ({ ...d, ...patch(d) }));
    // Any edit after saving starts a fresh check-in, so clear the old message.
    setStatus((s) => (s === 'saving' ? s : 'idle'));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSave(draft) || status === 'saving') return;
    setStatus('saving');
    try {
      await onSave(buildCheckIn(draft));
      setDraft(EMPTY_DRAFT);
      setStatus('saved');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form className="checkin" onSubmit={submit}>
      <EmotionWheel value={draft.emotion} onChange={(emotion) => edit(() => ({ emotion }))} />

      <fieldset>
        <legend>Where do you notice it?</legend>
        <p className="muted">Tap any areas where you feel something. Optional.</p>
        <BodyMap selected={selected} onToggle={(id) => edit((d) => ({ sensations: toggleRegion(d.sensations, id) }))} />
        <SensationList
          sensations={draft.sensations}
          onChange={(id, patch) => edit((d) => ({ sensations: updateSensation(d.sensations, id, patch) }))}
          onRemove={(id) => edit((d) => ({ sensations: toggleRegion(d.sensations, id) }))}
        />
      </fieldset>

      <fieldset>
        <legend>Anything to add?</legend>
        <input
          type="text"
          className="text-input"
          aria-label="Note"
          placeholder="Optional note"
          maxLength={NOTE_MAX_LENGTH}
          value={draft.note}
          onChange={(e) => {
            const note = e.target.value;
            edit(() => ({ note }));
          }}
        />
        <p className="muted checkin__count">
          {draft.note.length}/{NOTE_MAX_LENGTH}
        </p>
      </fieldset>

      <button type="submit" className="primary-button" disabled={!canSave(draft) || status === 'saving'}>
        {status === 'saving' ? 'Saving…' : 'Save check-in'}
      </button>
      <p className="checkin__status" role="status">
        {status === 'saved' && 'Saved. Thanks for checking in.'}
        {status === 'error' && "Couldn't save. Please try again."}
        {status === 'idle' && !canSave(draft) && <span className="muted">Choose how you're feeling to save.</span>}
      </p>
    </form>
  );
}
