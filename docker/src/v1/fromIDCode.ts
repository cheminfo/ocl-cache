import debugLibrary from 'debug';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { FastifyInstance } from 'fastify/types/instance';

import { getInfoFromIDCode } from '../db/getInfoFromIDCode';

const debug = debugLibrary('getInfoFromIDCode');

export default function fromIDCode(fastify: FastifyInstance) {
  fastify.get(
    '/v1/fromIDCode',
    {
      schema: {
        summary: 'Retrieve information from idCode',
        description: '',
        querystring: {
          idCode: {
            type: 'string',
            description: 'idCode',
          },
        },
      },
    },
    getInfo,
  );
}

async function getInfo(request: FastifyRequest, response: FastifyReply) {
  const body: any = request.query;
  try {
    const result = await getInfoFromIDCode(body.idCode);
    return await response.send({ result });
  } catch (error: any) {
    debug(`Error: ${error.stack}`);
    return response.send({ result: {}, log: error.toString() });
  }
}
