import type { Database, Statement } from 'better-sqlite3';

import type { DBMoleculeInfo, MoleculeInfo } from '../MoleculeInfo.ts';
import { serialize } from 'bson';
import { DB } from './getDB.ts';

interface SSIndexes {
  ssIndex0: BigInt;
  ssIndex1: BigInt;
  ssIndex2: BigInt;
  ssIndex3: BigInt;
  ssIndex4: BigInt;
  ssIndex5: BigInt;
  ssIndex6: BigInt;
  ssIndex7: BigInt;
}

export function insertInfo(info: MoleculeInfo, db: DB) {
  // 2 issues when we want to store the info in the database
  // 1. Atoms is an object and we need to convert it to a string
  // 2. Need to store the ssIndex as a blob

  // in the DB we prefer to store int64 in order to make substructure preindex search in the future
  const ssIndex64 = new BigInt64Array(info.ssIndex.buffer);
  const ssIndexes: SSIndexes = {
    ssIndex0: ssIndex64[0],
    ssIndex1: ssIndex64[1],
    ssIndex2: ssIndex64[2],
    ssIndex3: ssIndex64[3],
    ssIndex4: ssIndex64[4],
    ssIndex5: ssIndex64[5],
    ssIndex6: ssIndex64[6],
    ssIndex7: ssIndex64[7],
  };

  const stmtData: DBMoleculeInfo = {
    ...info,
    ssIndex: new Uint8Array(info.ssIndex.buffer),
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
