import debugLibrary from 'debug';
import { FastifyRequest, FastifyReply } from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';

import { getInfoFromMolfile } from '../db/getInfoFromMolfile';

const debug = debugLibrary('getInfoFromSmiles');

export default function fromMolfile(fastify: FastifyInstance) {
  fastify.get(
    '/v1/fromMolfile',
    {
      schema: {
        summary: 'Retrieve information from a molfile',
        description: '',
        querystring: {
          molfile: {
            type: 'string',
            description: 'Molfile',
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
    const result = await getInfoFromMolfile(body.molfile);
    return await response.send({ result });
  } catch (e: any) {
    debug(`Error: ${e.stack}`);
    return response.send({ result: {}, log: e.toString() });
  }
}
