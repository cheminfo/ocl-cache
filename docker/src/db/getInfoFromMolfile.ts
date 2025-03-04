import { Molecule } from 'openchemlib';

import type { MoleculeInfo } from '../MoleculeInfo';

import { getInfoFromMolecule } from './getInfoFromMolecule';
import type { Database } from 'better-sqlite3';
import { DB } from './getDB';

export function getInfoFromMolfile(
  molfile: string,
  db: DB,
): Promise<MoleculeInfo> {
  const molecule = Molecule.fromMolfile(molfile);
  return getInfoFromMolecule(molecule, db);
}
