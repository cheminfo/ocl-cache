import { Molecule } from 'openchemlib';

import calculateMoleculeInfo from '../calculate/calculateMoleculeInfo';

test('calculateMoleculeInfo', () => {
  const molecule = Molecule.fromSmiles('CCC(=O)C[13CH3].[Cl-]');
  const info = calculateMoleculeInfo(molecule);
});
