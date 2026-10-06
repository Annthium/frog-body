import { createDb } from './db';
import { createDexieRepository } from './repository';

export type { CheckInRepository, ExportFile } from './repository';

/** The app-wide repository, backed by IndexedDB. */
export const repository = createDexieRepository(createDb());
