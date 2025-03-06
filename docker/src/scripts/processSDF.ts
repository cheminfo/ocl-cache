import { renameSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { FileCollection } from 'file-collection';
import pino from 'pino';

import getDB from '../db/getDB.ts';
import { appendSDFStream } from '../index.ts';

const parentDir = join(import.meta.dirname, '../../sdf');
const sdfDir = join(parentDir, 'to_process');
const logger = pino({ messageKey: 'processSDF' });

logger.info(`Checking for SDF files in: ${sdfDir}`);

const db = await getDB();

while (true) {
  const fileCollection = new FileCollection();
  await fileCollection.appendPath(sdfDir);
  for (const file of fileCollection) {
    logger.info(`Importing: ${file.name}`);
    await appendSDFStream(file.stream(), db);
    const sourceFile = fileCollection.sources.find(
      (source) => source.uuid === file.sourceUUID,
    );
    if (sourceFile?.relativePath) {
      const path = join(parentDir, sourceFile.relativePath);
      renameSync(path, path.replace('to_process', 'processed'));
    }
  }
  logger.trace('Waiting for new SDF files');
  await delay(10000);
}
