import calculateMoleculeInfo from '../calculateMoleculeInfo';
import { Molecule } from 'openchemlib';
import { readFileSync } from 'fs';
import { join } from 'path';
import calculateMoleculeInfoFromIDCode from '../calculateMoleculeInfoFromIDCode';

const molfile = readFileSync(join(__dirname, 'molfile.txt'), 'utf8');

test('should first', () => {
  const molecule = Molecule.fromMolfile(molfile);
  const idCode = molecule.getIDCode();
  const info = calculateMoleculeInfoFromIDCode(idCode);
  console.log(info);
});
