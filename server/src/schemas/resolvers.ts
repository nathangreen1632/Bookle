import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { GraphQLContext } from '../types/GraphQLContext.js';

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (context.user) {
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('Not authenticated');
    },
  },

  Mutation: {
    login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken({
        _id: (user._id as string),
        email: user.email,
        username: user.username,
      });

      return { token, user };
    },

    addUser: async (
      _parent: unknown,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const user = await User.create({ username, email, password });
      const token = signToken({
        _id: (user._id as string),
        email: user.email,
        username: user.username,
      });

      return { token, user };
    },

    saveBook: async (
      _parent: unknown,
      { book }: { book: { bookId: string; authors?: string[]; title: string; description?: string; image?: string; link?: string } },
      context: GraphQLContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedBooks: book } },
        { new: true, runValidators: true }
      );
    },

    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;