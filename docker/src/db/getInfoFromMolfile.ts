import type { Database } from 'better-sqlite3';
import { Molecule } from 'openchemlib';

import type { MoleculeInfo } from '../MoleculeInfo';

import type { DB } from './getDB';
import { getInfoFromMolecule } from './getInfoFromMolecule';

export function getInfoFromMolfile(
  molfile: string,
  db: DB,
): Promise<MoleculeInfo> {
  const molecule = Molecule.fromMolfile(molfile);
  return getInfoFromMolecule(molecule, db);
}
