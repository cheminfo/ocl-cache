import { Statement } from 'better-sqlite3';
import debugLibrary from 'debug';

import { MoleculeInfo } from '../MoleculeInfo';

import getDB from './getDB';
import { improve } from './improve';
import { insertMolecule } from './insertMolecule';
import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

const debug = debugLibrary('getInfoFromIDCode');

let stmt: Statement;

export async function getInfoFromIDCode(idCode: string): Promise<MoleculeInfo> {
  const db = getDB();
  if (!stmt) {
    stmt = db.prepare('SELECT * FROM molecules WHERE idCode = ?');
  }
  const resultFromDB = stmt.get(idCode);
  if (resultFromDB) {
    debug('in cache');
    return improve(resultFromDB as InternalMoleculeInfo);
  }
  return improve(await insertMolecule(idCode, db));
}
