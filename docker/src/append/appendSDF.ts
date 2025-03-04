import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

//@ts-expect-error sdf-parser is not typed
import { parse } from 'sdf-parser';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise.ts';
import type { DB } from '../db/getDB.ts';
import idCodeIsPresent from '../db/idCodeIsPresent.ts';
import { insertInfo } from '../db/insertInfo.ts';

const debug = debugLibrary('appendSDF');

export async function appendSDF(text: string, db: DB) {
  let existingMolecules = 0;
  let newMolecules = 0;
  let counter = 0;
  const entries = parse(text).molecules;

  debug('Start append');
  for (const entry of entries) {
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
      await promise
        .then((info) => {
          insertInfo(info, db);
        })
        .catch((error) => {
          console.log(error.toString());
        });
    } catch (error: any) {
      debug(`Error parsing molfile: ${error.toString()}`);
      continue;
    }
    newMolecules++;
  }
  debug(`Existing molecules: ${existingMolecules}`);
  debug(`New molecules: ${newMolecules}`);

  debug('End append');
}
