import { Database, Statement } from 'better-sqlite3';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise';

let stmt: Statement;

export async function insertMolecule(
  molecule: string,
  db: Database,
): Promise<InternalMoleculeInfo> {
  if (!stmt) {
    stmt = db.prepare(
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @charge, @noStereoID, @noStereoTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @ssIndex, @nbFragments, @unsaturation, @atoms)',
    );
  }
  const { promise } = await calculateMoleculeInfoFromIDCodePromise(molecule);
  const info = await promise;

  const stmtData = {
    ...info,
    // convert Uint8Array(64) to number[] to be able to store it in sqlite
    ssIndex: Buffer.from(info.ssIndex),
    atoms: JSON.stringify(info.atoms),
  };

  stmt.run(stmtData);
  return info;
}
