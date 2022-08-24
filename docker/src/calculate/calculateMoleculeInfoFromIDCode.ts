import { Molecule } from 'openchemlib';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

import calculateMoleculeInfo from './calculateMoleculeInfo';

export default function calculateMoleculeInfoFromIDCode(
  idCode: string,
): InternalMoleculeInfo {
  const info = calculateMoleculeInfo(Molecule.fromIDCode(idCode));
  // surprisingly in some cases the idCode is not 'stable' and if we recreate the idCode we don't obtain the same code
  info.idCode = idCode;

  return info;
}
