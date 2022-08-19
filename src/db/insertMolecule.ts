import { Database } from 'better-sqlite3';
import { Molecule } from 'openchemlib';

import calculateMoleculeInfo from '../calculate/calculateMoleculeInfo';

let stmt: any;

export function insertMolecule(molecule: Molecule, db: Database) {
  if (!stmt) {
    stmt = db.prepare(
      'INSERT INTO molecules VALUES (@idCode, @mf, @em, @mw, @noStereoID, @noStereoTautomerID, @logS, @logP, @acceptorCount, @donorCount, @rotatableBondCount, @stereoCenterCount, @polarSurfaceArea, @ssIndex)',
    );
  }

  const info = calculateMoleculeInfo(molecule);
  stmt.run(info);
  return info;
}
