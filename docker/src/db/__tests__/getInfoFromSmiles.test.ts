import { test, expect } from 'vitest';

import { getInfoFromSmiles } from '../getInfoFromSmiles';

test('getInfoFromSmiles', async () => {
  const result = await getInfoFromSmiles('CCOCC');
  expect(result).toMatchInlineSnapshot();
});
