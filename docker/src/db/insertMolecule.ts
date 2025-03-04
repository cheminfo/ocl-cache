import type { Database, Statement } from 'better-sqlite3';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise.ts';
import type { MoleculeInfo } from '../MoleculeInfo.ts';
import { insertInfo } from './insertInfo.ts';
import { DB } from './getDB.ts';

export async function insertMolecule(
  molecule: string,
  db: DB,
): Promise<MoleculeInfo> {
  const { promise } = await calculateMoleculeInfoFromIDCodePromise(molecule);
  const info = await promise;
  insertInfo(info, db);

  return info;
}
