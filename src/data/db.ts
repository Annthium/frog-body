import Dexie, { type EntityTable } from 'dexie';
import type { CheckIn } from '../domain';

export type BodyMapDb = Dexie & {
  checkIns: EntityTable<CheckIn, 'id'>;
};

export function createDb(name = 'bodymap'): BodyMapDb {
  const db = new Dexie(name) as BodyMapDb;
  // Bump the version and add an upgrade() when the schema changes,
  // e.g. emotion -> *emotions (DECISIONS 006).
  db.version(1).stores({
    checkIns: 'id, createdAt, emotion',
  });
  return db;
}
