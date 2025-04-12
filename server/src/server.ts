import express, { Express, Request, Response } from 'express';
import path from 'node:path';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { connect } from 'mongoose';
import dotenv from 'dotenv';

import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  await connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/bookle');

  const PORT: number = parseInt(process.env.PORT ?? '4000', 10);
  const app: Express = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async (args) => authenticateToken(args),
    }) as unknown as express.RequestHandler
  );

  if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.resolve(process.cwd(), 'client/dist');

    app.use(express.static(clientBuildPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🚀 GraphQL playground at http://localhost:${PORT}/graphql`);
  });
};

await startApolloServer();
