import { renameSync, ReadStream } from 'fs';
import { join } from 'path';

import { setTimeout as delay } from 'node:timers/promises';

import debugLib from 'debug';

const debug = debugLib('processSDF');
import { FileCollection } from 'file-collection';

import { appendSDFStream } from '../index.ts';
import getDB from '../db/getDB.ts';

const sdfDir = join(import.meta.dirname, '../sdf/to_process');
debug(`Checking for SDF files in: ${sdfDir}`);

const db = await getDB();

while (true) {
  let wasWaiting = true;
  const fileCollection = new FileCollection();
  await fileCollection.appendPath(sdfDir);
  for (const file of fileCollection) {
    wasWaiting = false;
    debug(`Importing: ${file.name}`);

    await appendSDFStream(file.stream(), db);
    let sourceFile = fileCollection.sources.find(
      (source) => source.uuid === file.sourceUUID,
    );
    if (sourceFile?.relativePath) {
      let path = join(import.meta.dirname, '../sdf/', sourceFile.relativePath);
      renameSync(path, path.replace('to_process', 'processed'));
    }
  }
  if (wasWaiting) {
    debug('Waiting for new SDF files');
    wasWaiting = true;
  }

  await delay(10000);
}
