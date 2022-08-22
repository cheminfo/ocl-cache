import { FastifyInstance } from 'fastify/types/instance';

import fromIDCode from './fromIDCode';
import fromMolfile from './fromMolfile.js';
import fromSmiles from './fromSmiles.js';

export default function v1(fastify: FastifyInstance) {
  fromSmiles(fastify);
  fromMolfile(fastify);
  fromIDCode(fastify);
}
