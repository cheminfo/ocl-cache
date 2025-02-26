import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

import type { MoleculeInfo } from '../MoleculeInfo.ts';

import { getInfoFromMolecule } from './getInfoFromMolecule.ts';

const debug = debugLibrary('getInfoFromSmiles');
export function getInfoFromSmiles(smiles: string): Promise<MoleculeInfo> {
  debug(smiles);
  const molecule = Molecule.fromSmiles(smiles);
  return getInfoFromMolecule(molecule);
}
