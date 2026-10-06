import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { CheckIn } from '../domain';
import { createDb, type BodyMapDb } from './db';
import { createDexieRepository, type CheckInRepository } from './repository';

const checkIn = (id: string, createdAt: number, overrides: Partial<CheckIn> = {}): CheckIn => ({
  id,
  createdAt,
  emotion: 'calm',
  sensations: [],
  schemaVersion: 1,
  ...overrides,
});

let db: BodyMapDb;
let repo: CheckInRepository;

beforeEach(() => {
  db = createDb(`test-${crypto.randomUUID()}`);
  repo = createDexieRepository(db);
});

afterEach(async () => {
  await db.delete();
});

describe('Dexie repository', () => {
  it('saves a check-in and reads it back unchanged', async () => {
    const saved = checkIn('a', 1000, {
      emotion: 'anxious',
      sensations: [{ regionId: 'chest', intensity: 2, quality: 'tight' }],
      note: 'before the meeting',
    });
    await repo.addCheckIn(saved);
    expect(await repo.listCheckIns()).toEqual([saved]);
  });

  it('lists newest first', async () => {
    await repo.addCheckIn(checkIn('old', 1000));
    await repo.addCheckIn(checkIn('new', 3000));
    await repo.addCheckIn(checkIn('mid', 2000));
    expect((await repo.listCheckIns()).map((c) => c.id)).toEqual(['new', 'mid', 'old']);
  });

  it('rejects a duplicate id', async () => {
    await repo.addCheckIn(checkIn('a', 1000));
    await expect(repo.addCheckIn(checkIn('a', 2000))).rejects.toThrow();
  });

  it('deletes everything', async () => {
    await repo.addCheckIn(checkIn('a', 1000));
    await repo.addCheckIn(checkIn('b', 2000));
    await repo.deleteAll();
    expect(await repo.listCheckIns()).toEqual([]);
  });

  it('exports all check-ins', async () => {
    await repo.addCheckIn(checkIn('a', 1000));
    const file = await repo.exportAll();
    expect(file.app).toBe('bodymap');
    expect(file.checkIns.map((c) => c.id)).toEqual(['a']);
  });
});
