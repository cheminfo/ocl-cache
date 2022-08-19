const { renameSync } = require('fs');
const { join } = require('path');

const debug = require('debug')('processSmiles');
const { fileListFromPath } = require('filelist-from');

const { appendSDF } = require('../lib/index.js');

async function doAll() {
  const fileList = fileListFromPath(join(__dirname, '../sdf/to_process'));

  for (const file of fileList) {
    debug(`Importing: ${file.name}`);
    await appendSDF(await file.text());
    renameSync(
      file.webkitRelativePath,
      file.webkitRelativePath.replace('to_process', 'processed'),
    );
  }
}

doAll();
