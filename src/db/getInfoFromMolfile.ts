import { Molecule } from 'openchemlib';

import { MoleculeInfo } from '../MoleculeInfo';

import { getInfoFromMolecule } from './getInfoFromMolecule';

export function getInfoFromMolfile(molfile: string): Promise<MoleculeInfo> {
  const molecule = Molecule.fromMolfile(molfile);
  return getInfoFromMolecule(molecule);
}
