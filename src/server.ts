import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import createFastify from 'fastify';

import v1 from './v1/v1.ts';

const devLogger = {
  level: 'info',
  transport: {
    // https://fastify.dev/docs/latest/Reference/Logging/
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
};

const fastify = await createFastify({
  logger: process.env.NODE_ENV === 'production' ? true : devLogger,
});

fastify.register(fastifyCors, {
  maxAge: 86400,
});

fastify.register(fastifySensible);

fastify.get('/', (_, reply) => {
  reply.redirect('/documentation');
});

await fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Cache openchemlib calculation results',
      description: ``,
      version: '1.0.0',
    },
    produces: ['application/json'],
  },
});

await fastify.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

v1(fastify);

await fastify.ready();
fastify.swagger();

fastify.log.info('Listening http://127.0.0.1:20822/');
fastify.listen({ port: 20822, host: '0.0.0.0' }, (err: unknown) => {
  if (err) {
    fastify.log.error(err);
  }
});
