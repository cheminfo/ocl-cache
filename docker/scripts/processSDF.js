const { renameSync, existsSync, mkdirSync } = require('fs');
const { ReadStream } = require('fs');
const { join } = require('path');

const delay = require('delay');
const debug = require('debug')('processSDF');
const { fileCollectionFromPath } = require('filelist-utils');

const { appendSDFStream } = require('../lib/index.js');

 async function processSDF() {
  let wasWaiting = true;
  const sdfDir = join(__dirname, '../sdf/to_process');
  debug(`Checking for SDF files in: ${sdfDir}`);
  while (true) {
    const fileList = await fileCollectionFromPath(sdfDir, { ungzip: { gzipExtensions: [] } });
    for (const file of fileList) {
      wasWaiting = false;
      debug(`Importing: ${file.name}`);
     debug(file)
      await appendSDFStream(ReadStream.from(file.stream()));
      let filePath=join(sdfDir,file.name);
      if(!existsSync(sdfDir.replace('to_process', 'processed'))){
        mkdirSync(sdfDir.replace('to_process', 'processed'));
      
      }
      renameSync(`${filePath}`, `${filePath.replace('to_process', 'processed')}`);
      
    }
    if (wasWaiting) {
      debug('Wating for new SDF files');
      wasWaiting = true;
    }

    await delay(10000);
  }
}

processSDF();
