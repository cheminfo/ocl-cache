import { Molecule } from 'openchemlib';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

import calculateMoleculeInfo from './calculateMoleculeInfo';

export default function calculateMoleculeInfoFromIDCode(
  idCode: string,
): InternalMoleculeInfo {
  return calculateMoleculeInfo(Molecule.fromIDCode(idCode));
}
