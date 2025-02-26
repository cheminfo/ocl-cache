import { renameSync } from 'fs';
import { join } from 'path';

import debugLib from 'debug';

import { FileCollection } from 'file-collection';
import { appendSmiles } from '../lib/index.js';

const debug = debugLib('processSmiles');

const fileCollection = new FileCollection();
fileCollection.appendPath(join(__dirname, '../smiles/to_process'));

for (const file of fileCollection) {
  debug(`Importing: ${file.name}`);
  console.time(`Importing: ${file.name}`);
  await appendSmiles(await file.text());
  const filename = file.relativePath.replace(/\.zip\/.*$/, '.zip');
  renameSync(filename, filename.replace('to_process', 'processed'));
  console.timeEnd(`Importing: ${file.name}`);
}
