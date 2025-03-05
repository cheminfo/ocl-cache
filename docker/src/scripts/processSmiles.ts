import { renameSync } from 'node:fs';
import { join } from 'node:path';

import { FileCollection } from 'file-collection';
import pino from 'pino';

import getDB from '../db/getDB.ts';
import { appendSmiles } from '../index.ts';

const logger = pino({ messageKey: 'processSmiles' });

const fileCollection = new FileCollection();
await fileCollection.appendPath(
  join(import.meta.dirname, '../../smiles/to_process'),
);

const db = await getDB();

for (const file of fileCollection) {
  logger.info(`Importing: ${file.name}`);
  const text = await file.text();
  await appendSmiles(text, db);
  const filename = file.relativePath.replace(/\.zip\/.*$/, '.zip');
  renameSync(filename, filename.replace('to_process', 'processed'));
  logger.info(`End importing: ${file.name}`);
}
