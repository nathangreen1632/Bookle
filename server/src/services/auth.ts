import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';
import { ContextFunction } from '@apollo/server';
import { ExpressContextFunctionArgument } from '@apollo/server/express4';

dotenv.config();

interface JwtPayload {
  data: {
    _id: string;
    username: string;
    email: string;
  };
}

export interface AuthContext {
  user: {
    _id: string;
    username: string;
    email: string;
  } | null;
}

export const authenticateToken: ContextFunction<[ExpressContextFunctionArgument], AuthContext> = async ({ req }) => {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '', {
      maxAge: '7d',
    }) as JwtPayload;

    return { user: decoded.data };
  } catch (err) {
    console.error('Invalid token:', err);
    return { user: null };
  }
};

export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET ?? '';

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '7d' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, { path: ['Unauthenticated'] });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}
