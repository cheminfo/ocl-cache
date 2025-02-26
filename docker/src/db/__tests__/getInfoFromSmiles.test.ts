import { test } from 'node:test';
import { jestExpect as expect } from '@jest/expect';

import { getInfoFromSmiles } from '../getInfoFromSmiles.ts';

test('getInfoFromSmiles', async () => {
  const result = await getInfoFromSmiles('CCOCC');

  expect(result).toStrictEqual({
    idCode: 'gJQ@@eKU@@',
    mf: 'C4H10O',
    em: 74.07316494187,
    mw: 74.12175605181704,
    charge: 0,
    noStereoID: 'gJQ@@eKU@@',
    noStereoTautomerID: 'gJQ@@eKU@@',
    logS: -0.9049999713897705,
    logP: 0.8846999406814575,
    acceptorCount: 1,
    donorCount: 0,
    rotatableBondCount: 2,
    stereoCenterCount: 0,
    polarSurfaceArea: 9.229999542236328,
    ssIndex: Int32Array.from([64, 8192, 0, 0, 0]),
    nbFragments: 1,
    unsaturation: 0,
    atoms: { C: 4, H: 10, O: 1 },
  });
});
