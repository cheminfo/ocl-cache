import { openAsBlob } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { getTempDB } from '../../db/getDB.ts';
import { appendSmilesStream } from '../appendSmilesStream.ts';

test('appendSmilesStream', { timeout: 30000 }, async () => {
  const blob = await openAsBlob(join(import.meta.dirname, 'smiles.txt'));

  const db = await getTempDB();
  await appendSmilesStream(blob.stream(), db);

  const result = db.selectAllIDCode.all();

  expect(result).toStrictEqual([
    { idCode: 'eF@Hp@' },
    { idCode: 'eM@Hz@' },
    { idCode: 'fH@@' },
  ]);

  const result2 = db.searchIDCode.get('eM@Hz@');

  expect(result2).toMatchObject({
    idCode: 'eM@Hz@',
    mf: 'C3H8',
    em: 44.06260025784,
    mw: 44.095733722651964,
    charge: 0,
    noStereoID: 'eM@Hz@',
    noStereoTautomerID: 'eM@Hz@',
    failedTautomerID: 0,
    logS: -1.2539999783039093,
    logP: 1.4315999746322632,
    acceptorCount: 0,
    donorCount: 0,
    rotatableBondCount: 0,
    stereoCenterCount: 0,
    polarSurfaceArea: 0,
    nbFragments: 1,
    unsaturation: 0,
    ssIndex0: 1082130432,
    ssIndex1: 0,
    ssIndex2: 0,
    ssIndex3: 0,
    ssIndex4: 0,
    ssIndex5: 0,
    ssIndex6: 0,
    ssIndex7: 0,
  });
});
