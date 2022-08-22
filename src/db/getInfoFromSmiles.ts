import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

import { getInfoFromMolecule } from './getInfoFromMolecule';

const debug = debugLibrary('getInfoFromSmiles');

export function getInfoFromSmiles(smiles: string) {
  debug(smiles);
  const molecule = Molecule.fromSmiles(smiles);
  return getInfoFromMolecule(molecule);
}
