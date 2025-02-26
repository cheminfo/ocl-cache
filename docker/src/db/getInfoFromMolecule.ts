import type { Statement } from 'better-sqlite3';
import Debug from 'debug';
import { Molecule } from 'openchemlib';

import type { DBMoleculeInfo, MoleculeInfo } from '../MoleculeInfo.ts';

import getDB from './getDB.ts';
import { dbInfoToMoleculeInfo } from './dbInfoToMoleculeInfo.ts';
import { insertMolecule } from './insertMolecule.ts';

const debug = Debug('getInfoFromMolecule');

let stmt: Statement;

export async function getInfoFromMolecule(
  molecule: Molecule,
): Promise<MoleculeInfo> {
  const db = getDB();
  const idCode = molecule.getIDCode();
  if (!stmt) {
    stmt = db.prepare('SELECT * FROM molecules WHERE idCode = ?');
  }
  const resultFromDB = stmt.get(idCode) as DBMoleculeInfo;
  if (resultFromDB) {
    debug('in cache');
    return dbInfoToMoleculeInfo(resultFromDB);
  }
  return insertMolecule(idCode, db);
}
