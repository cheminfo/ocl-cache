import { test } from 'node:test';
import { jestExpect as expect } from '@jest/expect';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getTempDB } from '../../db/getDB.ts';
import { appendSDFStream } from '../appendSDFStream.ts';
import { openAsBlob } from 'node:fs';

test('appendSDFStream', async () => {
  const file = await openAsBlob(join(import.meta.dirname, 'diol.sdf'));
  const textDecoderStream = new TextDecoderStream();
  const stream = file.stream().pipeThrough(textDecoderStream);

  const db = await getTempDB();
  await appendSDFStream(stream, db);

  const stmt = db.prepare('SELECT idCode FROM molecules ');
  const result = stmt.all();
  expect(result).toStrictEqual([
    { idCode: 'gCaHD@aIj`@' },
    { idCode: 'gJQDD@`pBSMT@qB`@' },
    { idCode: 'gJQDL@aPBTuT@qD`@' },
  ]);
});

test.only('appendSDFStream compressed file', async () => {
  const file = await openAsBlob(join(import.meta.dirname, 'diol.sdf.gz'));
  const decompressionStream = new DecompressionStream('gzip');
  const textDecoderStream = new TextDecoderStream();
  const stream = file
    .stream()
    .pipeThrough(decompressionStream)
    .pipeThrough(textDecoderStream);

  const db = await getTempDB();
  await appendSDFStream(stream, db);

  const stmt = db.prepare('SELECT idCode FROM molecules ');
  const result = stmt.all();
  console.log(result);
  return;
  1;
  expect(result).toStrictEqual([
    { idCode: 'gCaHD@aIj`@' },
    { idCode: 'gJQDD@`pBSMT@qB`@' },
    { idCode: 'gJQDL@aPBTuT@qD`@' },
  ]);
});
