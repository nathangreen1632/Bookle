import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { authMiddleware } from './services/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers, // This must be passed correctly
  context: ({ req }: { req: express.Request }) => authMiddleware({ req }),
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app: app as unknown as Parameters<typeof server.applyMiddleware>[0]['app'] });

  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost/bookle', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

await startServer();
