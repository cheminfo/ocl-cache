import { cpus } from 'os';
import { join } from 'path';
import { AbortController } from 'abort-controller';
import Piscina from 'piscina';
import delay from 'delay';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';
import calculateMoleculeInfo from './calculateMoleculeInfo';
import calculateMoleculeInfoFromIDCode from './calculateMoleculeInfoFromIDCode';

const nbCPU = cpus().length;

const piscina = new Piscina({
  filename: join(__dirname, 'calculateMoleculeInfoFromIDCode.js'),
  minThreads: nbCPU,
  maxThreads: nbCPU,
  idleTimeout: 1000,
});

/**
 * @description Multithread import of compounds
 * @param idCode
 * @returns result to be imported
 */
export default async function calculateMoleculeInfoFromIDCodePromise(
  idCode: string,
): Promise<InternalMoleculeInfo> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 60000);

  // if in the queue we have over twice the number of cpu we wait
  while (piscina.queueSize > nbCPU * 2) {
    await delay(1);
  }
  try {
    const info = await piscina.run(idCode, { signal: abortController.signal });
    clearTimeout(timeout);
    return info;
  } catch (e) {
    return calculateMoleculeInfoFromIDCode(idCode, { ignoreTautomer: true });
  }
}
