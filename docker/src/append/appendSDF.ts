import { cpus } from 'os';

import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';
import pAll from 'p-all';

//@ts-expect-error sdf-parser is not typed
import { parse } from 'sdf-parser';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise';
import getDB from '../db/getDB';
import idCodeIsPresent from '../db/idCodeIsPresent';
import { insertInfo } from '../db/insertInfo';

const debug = debugLibrary('appendSDF');

export async function appendSDF(text: string) {
  const db = getDB();
  const tasks = [];
  const entries = parse(text).molecules;
  debug('Start append');
  for (let entry of entries) {
    const idCode = Molecule.fromMolfile(entry.molfile).getIDCode();
    debug('Processing: ' + entry.PUBCHEM_COMPOUND_CID);
    if (idCodeIsPresent(idCode, db)) continue;
    tasks.push(() =>
      calculateMoleculeInfoFromIDCodePromise(idCode)
        .then((info: any) => {
          insertInfo(info, db);
        })
        .catch((err) => {
          console.log(err.toString());
        }),
    );
  }
  debug(`Need to process: ${tasks.length} entries`);
  await pAll(tasks, { concurrency: cpus().length * 2 });

  await Promise.all(tasks);
  debug('End append');
}
