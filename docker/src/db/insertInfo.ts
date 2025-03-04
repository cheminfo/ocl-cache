import type { Database, Statement } from 'better-sqlite3';

import type { MoleculeInfo } from '../MoleculeInfo.ts';
import { serialize } from 'bson';
import { DB } from './getDB.ts';

export function insertInfo(info: MoleculeInfo, db: DB) {
  // 2 issues when we want to store the info in the database
  // 1. Atoms is an object and we need to convert it to a string
  // 2. Need to store the ssIndex as a blob

  // in the DB we prefer to store int64 in order to make substructure preindex search in the future
  const ssIndex64 = new BigInt64Array(info.ssIndex.buffer);
  const ssIndexes: Record<string, BigInt> = {};
  for (let i = 0; i < ssIndex64.length; i++) {
    ssIndexes[`ssIndex${i}`] = ssIndex64[i];
  }

  const stmtData = {
    ...info,
    atoms: serialize(info.atoms),
    ...ssIndexes,
  };

  try {
    db.insertInfo.run(stmtData);
  } catch (e) {
    console.log(e);
    console.log(`idCode already exists in the database: ${info.idCode}`);
  }
}
