import { Molecule } from 'openchemlib';
import pino from 'pino';
//@ts-expect-error sdf-parser is not typed
import { MolfileStream } from 'sdf-parser';

import type { DB } from '../db/getDB.ts';

import { appendStream } from './appendStream.ts';

const logger = pino({ messageKey: 'appendSDFStream' });
export async function appendSDFStream(stream: ReadableStream, db: DB) {
  logger.info('Appending SDF stream');

  const textDecoderStream = new TextDecoderStream();

  await appendStream(
    stream.pipeThrough(textDecoderStream).pipeThrough(new MolfileStream()),
    db,
    {
      getMolecule: (entry) => Molecule.fromMolfile(entry),
    },
  );
}
