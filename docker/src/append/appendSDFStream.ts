import { Molecule } from 'openchemlib';
import pino from 'pino';
//@ts-expect-error sdf-parser is not typed
import { iterator } from 'sdf-parser';

import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise.ts';
import type { DB } from '../db/getDB.ts';
import idCodeIsPresent from '../db/idCodeIsPresent.ts';
import { insertInfo } from '../db/insertInfo.ts';

const logger = pino({ messageKey: 'appendSDFStream' });
export async function appendSDFStream(stream: ReadableStream, db: DB) {
  let existingMolecules = 0;
  let newMolecules = 0;
  let counter = 0;

  logger.info('Start append');
  const textDecoder = new TextDecoderStream();

  for await (const entry of iterator(stream.pipeThrough(textDecoder))) {
    counter++;
    if (counter % 1000 === 0) {
      logger.info(
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
        .catch((error: unknown) => {
          logger.error(error?.toString());
        });
    } catch (error: unknown) {
      logger.info(`Error parsing molfile: ${error?.toString()}`);
      continue;
    }
    newMolecules++;
  }

  logger.info(`Existing molecules: ${existingMolecules}`);
  logger.info(`New molecules: ${newMolecules}`);

  logger.info('End append');
}
