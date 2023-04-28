import { Statement } from 'better-sqlite3';
import debugLibrary from 'debug';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import { MoleculeInfo } from '../MoleculeInfo';

import getDB from './getDB';
import { insertMolecule } from './insertMolecule';

const debug = debugLibrary('getInfoFromIDCode');

let stmt: Statement;

export async function getInfoFromIDCode(idCode: string): Promise<MoleculeInfo> {
  const db = getDB();
  if (!stmt) {
    stmt = db.prepare('SELECT * FROM molecules WHERE idCode = ?');
  }
  const result = stmt.get(idCode);
  if (result) {
    debug('in cache');
    return improve(result);
  }
  return improve(await insertMolecule(idCode, db));
}

function improve(data: any): MoleculeInfo {
  return { ...data, ssIndex: Array.from(new Uint32Array(data.ssIndex)) };
}
