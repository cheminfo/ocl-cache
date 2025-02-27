import type { Database, Statement } from 'better-sqlite3';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise.ts';
import type { MoleculeInfo } from '../MoleculeInfo.ts';
import { insertInfo } from './insertInfo.ts';

let stmt: Statement;

export async function insertMolecule(
  molecule: string,
  db: Database,
): Promise<MoleculeInfo> {
  const { promise } = await calculateMoleculeInfoFromIDCodePromise(molecule);
  const info = await promise;
  insertInfo(info, db);

  return info;
}
