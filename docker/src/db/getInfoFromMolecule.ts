import { Statement } from 'better-sqlite3';
import { Molecule } from 'openchemlib';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import { MoleculeInfo } from '../MoleculeInfo';

import getDB from './getDB';
import { insertMolecule } from './insertMolecule';
import Debug from 'debug';
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
  const resultFromDB = stmt.get(idCode);
  if (resultFromDB) {
    debug('in cache');

    return improve(resultFromDB);
  }
  return improve(await insertMolecule(idCode, db));
}

function improve(data: any): MoleculeInfo {
  return { ...data, ssIndex: Array.from(new Uint32Array(data.ssIndex)) };
}
