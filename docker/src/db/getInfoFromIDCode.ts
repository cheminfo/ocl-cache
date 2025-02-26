import { Statement } from 'better-sqlite3';
import debugLibrary from 'debug';

import { DBMoleculeInfo, MoleculeInfo } from '../MoleculeInfo';

import getDB from './getDB';
import { dbInfoToMoleculeInfo } from './dbInfoToMoleculeInfo';
import { insertMolecule } from './insertMolecule';

const debug = debugLibrary('getInfoFromIDCode');

let stmt: Statement;

export async function getInfoFromIDCode(idCode: string): Promise<MoleculeInfo> {
  const db = getDB();
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
