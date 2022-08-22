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
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @noStereoID, @noStereoTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @ssIndex)',
    );
  }
  const info = await calculateMoleculeInfoFromIDCodePromise(molecule);
  stmt.run(info);
  return info;
}
