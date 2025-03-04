import type { Statement , Database } from 'better-sqlite3';
import Debug from 'debug';
import type { Molecule } from 'openchemlib';

import type { DBMoleculeInfo, MoleculeInfo } from '../MoleculeInfo.ts';

import { dbInfoToMoleculeInfo } from './dbInfoToMoleculeInfo.ts';
import type { DB } from './getDB.ts';
import { insertMolecule } from './insertMolecule.ts';

const debug = Debug('getInfoFromMolecule');

export async function getInfoFromMolecule(
  molecule: Molecule,
  db: DB,
): Promise<MoleculeInfo> {
  const idCode = molecule.getIDCode();
  const resultFromDB = db.searchIDCode.get(idCode);

  if (resultFromDB) {
    debug('in cache');
    return dbInfoToMoleculeInfo(resultFromDB);
  }
  return insertMolecule(idCode, db);
}
