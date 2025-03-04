import { test } from 'node:test';
import { jestExpect as expect } from '@jest/expect';
import { getTempDB } from '../../db/getDB.ts';
import { appendSmiles } from '../appendSmiles.ts';

test('appendSmiles', async () => {
  const data = `C
CC
CCC`;
  const db = await getTempDB();
  await appendSmiles(data, db);

  const result = db.selectAllIDCode.all();
  expect(result).toStrictEqual([
    { idCode: 'eF@Hp@' },
    { idCode: 'eM@Hz@' },
    { idCode: 'fH@@' },
  ]);
});
