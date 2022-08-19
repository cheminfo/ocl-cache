import { Statement } from 'better-sqlite3';
import { Molecule } from 'openchemlib';

import getDB from './getDB';
import { insertMolecule } from './insertMolecule';

let stmt: Statement;

export function getInfoFromMolecule(molecule: Molecule) {
  const db = getDB();
  const idCode = molecule.getIDCode();
  if (!stmt) {
    stmt = db.prepare('SELECT * FROM molecules WHERE idCode = ?');
  }
  const result = stmt.get(idCode);
  if (result) return;
  return insertMolecule(molecule, db);
}
