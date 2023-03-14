const { renameSync } = require('fs');
const { join } = require('path');

const debug = require('debug')('processSmiles');
const { fileCollectionFromPath } = require('filelist-utils');

const { appendSmiles } = require('../lib/index.js');

async function doAll() {
  const fileList = await fileCollectionFromPath(
    join(__dirname, '../smiles/to_process'),
  );

  for (const file of fileList) {
    debug(`Importing: ${file.name}`);
    console.time(`Importing: ${file.name}`);
    await appendSmiles(await file.text());
    const filename = file.relativePath.replace(/\.zip\/.*$/, '.zip');
    renameSync(filename, filename.replace('to_process', 'processed'));
    console.timeEnd(`Importing: ${file.name}`);
  }
}

doAll();
