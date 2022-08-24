import { join } from 'path';
import { cpus } from 'os';
import Piscina from 'piscina';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

const piscina = new Piscina({
  filename: join(__dirname, 'calculateMoleculeInfoFromIDCode.js'),
  maxThreads: cpus().length / 2,
  idleTimeout: 10000,
});

/**
 * @description Multithread import of compounds
 * @param idCode
 * @returns result to be imported
 */
export default function calculateMoleculeInfoFromIDCodePromise(
  idCode: string,
): Promise<InternalMoleculeInfo> {
  return piscina.run(idCode);
}
