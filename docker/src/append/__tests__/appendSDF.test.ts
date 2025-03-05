import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';

import { jestExpect as expect } from '@jest/expect';

import { getTempDB } from '../../db/getDB.ts';
import { appendSDF } from '../appendSDF.ts';

test('appendSDF', async () => {
  const data = await readFile(join(import.meta.dirname, 'diol.sdf'), 'utf8');
  const db = await getTempDB();
  await appendSDF(data, db);

  const result = db.selectAllIDCode.all();
  expect(result).toStrictEqual([
    { idCode: 'gCaHD@aIj`@' },
    { idCode: 'gJQDD@`pBSMT@qB`@' },
    { idCode: 'gJQDL@aPBTuT@qD`@' },
  ]);
});
