import workerPool from 'workerpool';

const url = new URL('improveFixStereo.mjs', import.meta.url);
//const url = new URL('improveCompound.js', import.meta.url);

const pool = workerPool.pool(url.pathname);
/**
 * @description execute the improveSubstance.js script with n-1 cores workers
 * @returns {Promise} execution of the pool
 */
export default async function improve(idCode) {
  return pool.exec('improveFixStereo', [idCode]);
}
