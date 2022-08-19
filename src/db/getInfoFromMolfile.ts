import { Molecule } from 'openchemlib';

import { getInfoFromMolecule } from './getInfoFromMolecule';

export function getInfoFromMolfile(molfile: string) {
  const molecule = Molecule.fromMolfile(molfile);
  return getInfoFromMolecule(molecule);
}
