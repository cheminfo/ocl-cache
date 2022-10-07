import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise';
import getDB from '../db/getDB';
import idCodeIsPresent from '../db/idCodeIsPresent';
import { insertInfo } from '../db/insertInfo';

const debug = debugLibrary('appendSmiles');

export async function appendSmiles(text: string) {
  const db = getDB();
  const actions = [];
  const smilesArray = text.split(/\r?\n/);
  debug('Start append');
  for (let smiles of smilesArray) {
    const idCode = Molecule.fromSmiles(smiles).getIDCode();

    if (idCodeIsPresent(idCode, db)) continue;
    actions.push(
      calculateMoleculeInfoFromIDCodePromise(idCode)
        .then((info: any) => {
          insertInfo(info, db);
        })
        .catch((err) => {
          console.log(err.toString());
        }),
    );
  }
  debug(`Need to process: ${actions.length} smiles`);
  await Promise.all(actions);
  debug('End append');
}
