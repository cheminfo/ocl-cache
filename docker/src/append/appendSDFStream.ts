import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';
import { cpus } from 'os';

//@ts-expect-error sdf-parser is not typed
import { iterator } from 'sdf-parser';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise';
import getDB from '../db/getDB';
import idCodeIsPresent from '../db/idCodeIsPresent';
import { insertInfo } from '../db/insertInfo';

const debug = debugLibrary('appendSDF');
const maxTasks = cpus().length * 2;

export async function appendSDFStream(stream: ReadableStream) {
  const db = getDB();

  const idCodes: string[] = [];
  let existingMolecules = 0;
  let newMolecules = 0;
  let counter = 0;
  debug('Start append');
  for await (let entry of iterator(stream)) {
    counter++;
    if (counter % 1000 === 0) {
      debug(
        `Existing molecules: ${existingMolecules} - New molecules: ${newMolecules}`,
      );
    }

    try {
      const idCode = Molecule.fromMolfile(entry.molfile).getIDCode();
      if (idCodeIsPresent(idCode, db)) {
        existingMolecules++;
        continue;
      }
      const { promise } = await calculateMoleculeInfoFromIDCodePromise(idCode);
      promise
        .then((info) => {
          insertInfo(info, db);
        })
        .catch((err) => {
          console.log(err.toString());
        });
    } catch (e: any) {
      debug('Error parsing molfile: ' + e.toString());
      continue;
    }
    newMolecules++;
  }

  debug(`Existing molecules: ${existingMolecules}`);
  debug(`New molecules: ${newMolecules}`);

  debug('End append');
}

async function promiseAll(tasks: Promise<any>[]) {
  const results = await Promise.allSettled(tasks);
  // const fulfilled = results.filter(result => result.status === "fulfilled")
  const rejected = results.filter((result) => result.status === 'rejected');
  for (const entry of rejected) {
    //@ts-expect-error property should exist
    debug('Rejected: ' + entry.reason);
  }
}
