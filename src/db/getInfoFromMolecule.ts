import { Statement } from 'better-sqlite3';
import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

import getDB from './getDB';
import { insertMolecule } from './insertMolecule';

const debug = debugLibrary('getInfoFromMolecule');

let stmt: Statement;

export function getInfoFromMolecule(molecule: Molecule) {
  const db = getDB();
  const idCode = molecule.getIDCode();
  if (!stmt) {
    stmt = db.prepare('SELECT * FROM molecules WHERE idCode = ?');
  }
  const result = stmt.get(idCode);
  if (result) {
    debug('in cache');
    return improve(result);
  }
  return improve(insertMolecule(molecule, db));
}

function improve(data: any) {
  data.ssIndex = Array.from(new Uint32Array(data.ssIndex));
  return data;
}
