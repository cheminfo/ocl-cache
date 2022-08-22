import debugLibrary from 'debug';
import { FastifyRequest, FastifyReply } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import { getInfoFromIDCode } from '../db/getInfoFromIDCode';

const debug = debugLibrary('getInfoFromIDCode');

export default function fromSmiles(fastify: FastifyInstance) {
  fastify.get(
    '/v1/fromSmiles',
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
  } catch (e: any) {
    debug(`Error: ${e.stack}`);
    return response.send({ result: {}, log: e.toString() });
  }
}
