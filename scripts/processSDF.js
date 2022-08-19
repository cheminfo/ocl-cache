const { renameSync } = require('fs');
const { join } = require('path');

const debug = require('debug')('processSmiles');
const { fileListFromPath } = require('filelist-utils');

const { appendSDF } = require('../lib/index.js');

async function doAll() {
  const fileList = await fileListFromPath(join(__dirname, '../sdf/to_process'));

  for (const file of fileList) {
    debug(`Importing: ${file.name}`);
    await appendSDF(await file.text());
    const filename = file.webkitRelativePath.replace(/\.zip\/.*$/, '.zip');
    renameSync(filename, filename.replace('to_process', 'processed'));
  }
}

doAll();
