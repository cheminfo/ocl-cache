import { join } from "path";
import { cpus } from "os";
import Piscina from "piscina";

const piscina = new Piscina({
  filename: new URL("calculateMoleculeInfoFromIDCode.mjs", import.meta.url)
    .pathname,
  maxThreads: cpus().length / 2,
  idleTimeout: 10000,
});

/**
 * @description Multithread import of compounds
 * @param idCode
 * @returns result to be imported
 */
export function calculateMoleculeInfoFromIDCodePromise(idCode) {
  return piscina.run(idCode);
}
