import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

//@ts-expect-error sdf-parser is not typed
import { parse } from 'sdf-parser';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise';
import getDB from '../db/getDB';
import idCodeIsPresent from '../db/idCodeIsPresent';
import { insertInfo } from '../db/insertInfo';

const debug = debugLibrary('appendSDF');

export async function appendSDF(text: string) {
  const db = getDB();
  const actions = [];
  const entries = parse(text).molecules;
  debug('Start append');
  for (let entry of entries) {
    const idCode = Molecule.fromMolfile(entry.molfile).getIDCode();

    if (idCodeIsPresent(idCode, db)) continue;
    actions.push(
      calculateMoleculeInfoFromIDCodePromise(idCode).then((info: any) => {
        insertInfo(info, db);
      }),
    );
  }
  debug(`Need to process: ${actions.length} smiles`);
  await Promise.all(actions);
  debug('End append');
}
