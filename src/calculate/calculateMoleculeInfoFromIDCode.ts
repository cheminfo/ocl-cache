import { Molecule } from 'openchemlib';

import calculateMoleculeInfo from './calculateMoleculeInfo';

export default function calculateMoleculeInfoFromIDCode(idCode: string): any {
  return calculateMoleculeInfo(Molecule.fromIDCode(idCode));
}
