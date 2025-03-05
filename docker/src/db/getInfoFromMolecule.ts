import debugLibrary from 'debug';
import type { Molecule } from 'openchemlib';

import type { MoleculeInfo } from '../MoleculeInfo.ts';

import { dbInfoToMoleculeInfo } from './dbInfoToMoleculeInfo.ts';
import type { DB } from './getDB.ts';
import { insertMolecule } from './insertMolecule.ts';

const debug = debugLibrary('getInfoFromMolecule');

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
