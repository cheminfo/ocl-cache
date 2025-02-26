import type { Database, Statement } from 'better-sqlite3';

import type { MoleculeInfo } from '../MoleculeInfo.ts';

let stmt: Statement;

export function insertInfo(info: MoleculeInfo, db: Database) {
  // 2 issues when we want to store the info in the database
  // 1. Atoms is an object and we need to convert it to a string
  // 2. Need to store the ssIndex as a blob

  if (!stmt) {
    stmt = db.prepare(
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @charge, @noStereoID, @noStereoTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @ssIndex, @nbFragments , @unsaturation, @atoms)',
    );
  }

  const stmtData = {
    ...info,
    // convert Uint8Array(64) to number[] to be able to store it in sqlite
    ssIndex: Buffer.from(info.ssIndex),
    atoms: JSON.stringify(info.atoms),
  };

  try {
    stmt.run(stmtData);
  } catch (e) {
    console.log(`idCode already exists in the database: ${info.idCode}`);
  }
}
