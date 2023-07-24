import { Statement } from 'better-sqlite3';
import debugLibrary from 'debug';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import { MoleculeInfo } from '../MoleculeInfo';

import getDB from './getDB';
import { improveMoleculeInfo } from './improveMoleculeInfo';
import { insertMolecule } from './insertMolecule';

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
    return improveMoleculeInfo(resultFromDB as InternalMoleculeInfo);
  }
  return improveMoleculeInfo(await insertMolecule(idCode, db));
}
