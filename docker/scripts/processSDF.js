const { renameSync } = require('fs');
const { ReadStream } = require('fs');
const { join } = require('path');

const delay = require('delay');
const debug = require('debug')('processSDF');
const { fileCollectionFromPath } = require('filelist-utils');

const { appendSDFStream } = require('../lib/index.js');

async function doAll() {
  let wasWaiting = true;
  const sdfDir = join(__dirname, '../sdf/to_process');
  debug(`Checking for SDF files in: ${sdfDir}`);
  while (true) {
    const fileList = await fileCollectionFromPath(sdfDir);
    for (const file of fileList) {
      wasWaiting = false;
      debug(`Importing: ${file.name}`);
      await appendSDFStream(ReadStream.fromWeb(file.stream()));
      let filename = file.relativePath.replace(/\.zip\/.*$/, '.zip');
      renameSync(filename, filename.replace('to_process', 'processed'));
    }
    if (wasWaiting) {
      debug('Wating for new SDF files');
      wasWaiting = true;
    }
    await delay(10000);
  }
}

doAll();
