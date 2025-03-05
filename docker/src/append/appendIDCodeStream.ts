import { Molecule } from 'openchemlib';
import pino from 'pino';

import type { DB } from '../db/getDB.ts';
import { LineStream } from '../utils/LineStream.ts';

import { appendStream } from './appendStream.ts';

const logger = pino({ messageKey: 'appendSmilesStream' });
export async function appendIDCodeStream(stream: ReadableStream, db: DB) {
  logger.info('Appending idCode stream');
  await appendStream(stream.pipeThrough(new LineStream()), db, {
    getMolecule: (entry: string) => Molecule.fromIDCode(entry),
  });
}
