import { join } from 'path';

import Piscina from 'piscina';

const piscina = new Piscina({
  filename: join(__dirname, 'calculateMoleculeInfoFromIDCode.js'),
});

/**
 * @description Multithread import of compounds
 * @param {*} molecule molecule from pubchem file
 * @returns {Promise} result to be imported
 */
export default function calculateMoleculeInfoFromIDCodePromise(idCode: string) {
  return piscina.run(idCode);
}
