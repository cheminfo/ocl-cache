import debugLibrary from 'debug';

import type { MoleculeInfo } from '../MoleculeInfo';

import { dbInfoToMoleculeInfo } from './dbInfoToMoleculeInfo';
import getDB from './getDB';
import { insertMolecule } from './insertMolecule';

const debug = debugLibrary('getInfoFromIDCode');

export async function getInfoFromIDCode(idCode: string): Promise<MoleculeInfo> {
  const db = await getDB();
  const resultFromDB = db.searchIDCode.get(idCode);
  if (resultFromDB) {
    debug('in cache');
    return dbInfoToMoleculeInfo(resultFromDB);
  }
  return insertMolecule(idCode, db);
}
