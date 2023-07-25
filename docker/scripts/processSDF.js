const { renameSync } = require('fs');
const { ReadStream } = require('fs');
const { join } = require('path');

const delay = require('delay');
const debug = require('debug')('processSDF');
const { FileCollection } = require('file-collection');

const { appendSDFStream } = require('../lib/index.js');

async function processSDF() {
  const sdfDir = join(__dirname, '../sdf/to_process');
  debug(`Checking for SDF files in: ${sdfDir}`);

  while (true) {
    let wasWaiting = true;
    const fileCollection = new FileCollection();
    await fileCollection.appendPath(sdfDir);
    for (const file of fileCollection) {
      wasWaiting = false;
      debug(`Importing: ${file.name}`);
      await appendSDFStream(ReadStream.fromWeb(file.stream()));
      let sourceFile = fileCollection.sources.find(
        (source) => source.uuid === file.sourceUUID,
      );
      if (sourceFile?.relativePath) {
        let path = join(__dirname, '../sdf/', sourceFile.relativePath);
        renameSync(path, path.replace('to_process', 'processed'));
      }
    }
    if (wasWaiting) {
      debug('Wating for new SDF files');
      wasWaiting = true;
    }

    await delay(10000);
  }
}

processSDF();
