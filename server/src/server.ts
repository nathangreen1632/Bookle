import express, { Express } from 'express';
import path from 'node:path';
import { expressMiddleware } from '@apollo/server/express4';
import { fileURLToPath } from 'node:url';
import type { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await connect(process.env.MONGODB_URI ?? '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);

  const PORT: number = parseInt(process.env.PORT ?? '4000', 10);
  const app: Express = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, { context: async (args) => authenticateToken(args) }));

  // Serve up static assets
  if (process.env.NODE_ENV === 'production') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }
  // Start the API server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
};

await startApolloServer();
