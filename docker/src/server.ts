import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import Fastify from 'fastify';

import v1 from './v1/v1.js';
import debugLibrary from 'debug';
const debug = debugLibrary('server');

async function doAll() {
  const fastify = Fastify({
    logger: false,
  });

  fastify.register(fastifyCors, {
    maxAge: 86400,
  });

  fastify.register(fastifySensible);

  fastify.get('/', (_, reply) => {
    reply.redirect('/documentation');
  });

  await fastify.register(fastifySwagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Cache openchemlib calculation results',
        description: ``,
        version: '1.0.0',
      },
      produces: ['application/json'],
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    exposeRoute: true,
  });

  v1(fastify);

  await fastify.ready();
  fastify.swagger();

  debug('Listening http://127.0.0.1:20822/');
  fastify.listen({ port: 20822, host: '0.0.0.0' }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
}

doAll();
