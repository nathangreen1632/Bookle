import { BookDocument, User } from '../models/index.js';
import { AuthenticationError, signToken } from '../services/auth.js';

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
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

      const user = await User.findById(context.user._id);

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      return user.toObject({ virtuals: true });
    },
  },

  Mutation: {
    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AuthenticationError('Email already exists. Please log in.');
      }

      const user = await User.create({
        username,
        email,
        password,
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

      console.log('Context User:', context.user);
      console.log('Saving Book:', book);


      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        {
          $addToSet: {
            savedBooks: {
              bookId: book.bookId,
              title: book.title,
              authors: book.authors,
              description: book.description,
              image: book.image,
              link: book.link,
            },
          },
        },
        { new: true }
      );

      console.log('Updated User:', updatedUser);

      return updatedUser;
    },

    removeBook: async (_parent: unknown, { bookId }: RemoveBookArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id, // <- Important
        {
          $pull: { savedBooks: { bookId } },
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new AuthenticationError('User not found');
      }
      return updatedUser.toObject({ virtuals: true });
    },
  },
};

export default resolvers;
