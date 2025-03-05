import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';

dotenv.config();

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token ?? req.query.token ?? req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET ?? '', { maxAge: '7d' });
    req.user = data;
  } catch (err) {
    console.log(err);
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET;

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '7d' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, { path: ['Unauthenticated'] });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}