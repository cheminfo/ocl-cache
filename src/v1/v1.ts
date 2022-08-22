import { FastifyInstance } from 'fastify/types/instance';

import fromSmiles from './fromSmiles.js';

export default function v1(fastify: FastifyInstance) {
  fromSmiles(fastify);
}
