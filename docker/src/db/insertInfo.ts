import { serialize } from 'bson';

import type { DBMoleculeInfo, MoleculeInfo } from '../MoleculeInfo.ts';

import type { DB } from './getDB.ts';

interface SSIndexes {
  ssIndex0: bigint;
  ssIndex1: bigint;
  ssIndex2: bigint;
  ssIndex3: bigint;
  ssIndex4: bigint;
  ssIndex5: bigint;
  ssIndex6: bigint;
  ssIndex7: bigint;
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
  } catch (error) {
    console.log(error);
    console.log(`idCode already exists in the database: ${info.idCode}`);
  }
}
