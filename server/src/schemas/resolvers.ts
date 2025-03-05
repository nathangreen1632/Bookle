import {BookDocument, User} from '../models/index.js';
import {AuthenticationError, signToken} from '../services/auth.js';

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginArgs {
  email: string;
  password: string;
}

interface RemoveBookArgs {
  bookId: string;
}

interface SaveBookArgs {
  book: BookDocument;
}

interface Context {
  user?: typeof User.prototype;
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return User.findById(context.user.id);
    },
  },

  Mutation: {
    addUser: async (_parent: unknown, { input }: AddUserArgs) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new AuthenticationError("Email already exists. Please log in.");
      }

      const user = await User.create({
        username: input.username,
        email: input.email,
        password: input.password,
      });

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },


    login: async (_parent: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: unknown, { book }: SaveBookArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return User.findByIdAndUpdate(
        context.user.id,
        {$addToSet: {savedBooks: book}},
        {new: true}
      );
    },

    removeBook: async (_parent: unknown, { bookId }: RemoveBookArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      return User.findByIdAndUpdate(
        context.user.id,
        {$pull: {savedBooks: {bookId}}},
        {new: true}
      );
    },
  },
};

export default resolvers;
