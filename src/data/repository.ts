import type { CheckIn } from '../domain';
import type { BodyMapDb } from './db';

export type ExportFile = {
  app: 'bodymap';
  exportedAt: number; // epoch ms
  checkIns: CheckIn[];
};

/**
 * All data access goes through this interface so the storage engine stays
 * swappable (DECISIONS 005).
 */
export type CheckInRepository = {
  addCheckIn(checkIn: CheckIn): Promise<void>;
  /** Newest first. */
  listCheckIns(): Promise<CheckIn[]>;
  deleteAll(): Promise<void>;
  exportAll(): Promise<ExportFile>;
};

export function createDexieRepository(db: BodyMapDb): CheckInRepository {
  const listCheckIns = () => db.checkIns.orderBy('createdAt').reverse().toArray();

  return {
    async addCheckIn(checkIn) {
      await db.checkIns.add(checkIn);
    },
    listCheckIns,
    async deleteAll() {
      await db.checkIns.clear();
    },
    async exportAll() {
      return { app: 'bodymap', exportedAt: Date.now(), checkIns: await listCheckIns() };
    },
  };
}
