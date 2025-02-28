import { test } from 'node:test';
import { jestExpect as expect } from '@jest/expect';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getTempDB } from '../../db/getDB.ts';
import { appendSDF } from '../appendSDF.ts';

test('appendSDF', async () => {
  const data = await readFile(join(import.meta.dirname, 'diol.sdf'), 'utf-8');
  const db = await getTempDB();
  await appendSDF(data, db);

  const stmt = db.prepare('SELECT idCode FROM molecules ');
  const result = stmt.all();
  expect(result).toStrictEqual([
    { idCode: 'gCaHD@aIj`@' },
    { idCode: 'gJQDD@`pBSMT@qB`@' },
    { idCode: 'gJQDL@aPBTuT@qD`@' },
  ]);
});
