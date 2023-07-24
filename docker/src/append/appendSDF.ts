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
  let existingMolecules = 0;
  let newMolecules = 0;
  let counter = 0;
  const entries = parse(text).molecules;
  debug('Start append');
  for (let entry of entries) {
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
      debug(`Error parsing molfile: ${e.toString()}`);
      continue;
    }
    newMolecules++;
  }
  debug(`Existing molecules: ${existingMolecules}`);
  debug(`New molecules: ${newMolecules}`);

  debug('End append');
}
