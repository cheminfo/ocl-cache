import { cpus } from 'os';
import { join } from 'path';

import Piscina from 'piscina';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

const piscina = new Piscina({
  filename: join(__dirname, 'calculateMoleculeInfoFromIDCode.js'),
  minThreads: cpus().length,
  maxThreads: cpus().length,
  idleTimeout: 1000,
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

  return Promise.resolve().then(() => piscina.run(idCode));
}
