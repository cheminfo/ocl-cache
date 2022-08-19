import { Molecule } from 'openchemlib';

import { getInfoFromMolecule } from './getInfoFromMolecule';

export function getInfoFromSmiles(smiles: string) {
  const molecule = Molecule.fromSmiles(smiles);
  return getInfoFromMolecule(molecule);
}
