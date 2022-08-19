const { renameSync } = require('fs');
const { join } = require('path');

const debug = require('debug')('processSmiles');
const { fileListFromPath } = require('filelist-from');

const { appendSmiles } = require('../lib/index.js');

async function doAll() {
  const fileList = fileListFromPath(join(__dirname, '../smiles/to_process'));

  for (const file of fileList) {
    debug(`Importing: ${file.name}`);
    await appendSmiles(await file.text());
    renameSync(
      file.webkitRelativePath,
      file.webkitRelativePath.replace('to_process', 'processed'),
    );
  }
}

doAll();
