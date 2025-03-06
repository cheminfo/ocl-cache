import { renameSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { FileCollection } from 'file-collection';
import pino from 'pino';

import { appendSmilesStream } from '../append/appendSmilesStream.ts';
import getDB from '../db/getDB.ts';

const logger = pino({ messageKey: 'processSmiles' });

const parentDir = join(import.meta.dirname, '../../smiles');
const smilesDir = join(parentDir, 'to_process');

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

    if (file?.relativePath) {
      const path = join(parentDir, file.relativePath);
      renameSync(path, path.replace('to_process', 'processed'));
    }
  }
  logger.trace('Waiting for new SMILES files');
  await delay(10000);
}
