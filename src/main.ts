import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import compress from '@fastify/compress';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import { schema } from './schema';

dotenv.config();

const startServer = async () => {
  const app = await Fastify({ trustProxy: true });

  const apollo = new ApolloServer({
    schema,
    plugins: [fastifyApolloDrainPlugin(app)]
  });

  await apollo.start();

  await app.register(cors);
  await app.register(compress);

  await app.register(fastifyApollo(apollo));

  return app.listen({
    port: parseInt(process.env.PORT || '3000')
  });
};

startServer()
  .then(() => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
