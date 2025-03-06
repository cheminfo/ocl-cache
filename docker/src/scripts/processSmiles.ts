import { renameSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { FileCollection } from 'file-collection';
import pino from 'pino';

import { appendSmilesStream } from '../append/appendSmilesStream.ts';
import getDB from '../db/getDB.ts';

const logger = pino({ messageKey: 'processSmiles' });

const smilesDir = join(import.meta.dirname, '../../smiles/to_process');

logger.info(`Checking for SMILES files in: ${smilesDir}`);

const db = await getDB();

while (true) {
  const fileCollection = new FileCollection();
  await fileCollection.appendPath(smilesDir);

  for (const file of fileCollection) {
    logger.info(`Importing: ${file.name}`);
    await appendSmilesStream(file.stream(), db);
    const filename = file.relativePath.replace(/\.zip\/.*$/, '.zip');
    renameSync(filename, filename.replace('to_process', 'processed'));
    logger.info(`End importing: ${file.name}`);
  }
  logger.trace('Waiting for new SMILES files');
  await delay(10000);
}
