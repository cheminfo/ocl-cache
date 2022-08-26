import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';
import pAll from 'p-all';
import { cpus } from 'os';

//@ts-expect-error sdf-parser is not typed
import { iterator } from 'sdf-parser';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise';
import getDB from '../db/getDB';
import idCodeIsPresent from '../db/idCodeIsPresent';
import { insertInfo } from '../db/insertInfo';

const debug = debugLibrary('appendSDF');

export async function appendSDFStream(stream: ReadableStream) {
  const db = getDB();

  const idCodes: string[] = [];
  let existingMolecules = 0;
  let newMolecules = 0;
  let counter = 0;
  const tasks: Promise<any>[] = []
  debug('Start append');
  for await (let entry of iterator(stream)) {
    counter++;
    if (counter % 1000 === 0) {
      debug(
        `Existing molecules: ${existingMolecules} - New molecules: ${newMolecules}`,
      );
    }

    const idCode = Molecule.fromMolfile(entry.molfile).getIDCode();
    if (idCodeIsPresent(idCode, db)) {
      existingMolecules++;
      continue;
    }
    tasks.push(
      calculateMoleculeInfoFromIDCodePromise(idCode).then(info => {
        insertInfo(info, db);
      })
    )

    newMolecules++;

    if (tasks.length > 1000) {

      await Promise.all(tasks)

      debug(`Added ${newMolecules} molecules`);
      tasks.length = 0;
    }
  }

  await Promise.all(tasks)


  debug(`Existing molecules: ${existingMolecules}`);
  debug(`New molecules: ${newMolecules}`);

  debug('End append');
}
