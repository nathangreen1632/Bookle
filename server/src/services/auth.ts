import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { Request, Response } from 'express';

const secret = process.env.JWT_SECRET ?? 'yourSuperSecretKey';
const expiration = '2h';

export interface AuthContext {
  user?: { _id: string; email: string; username: string };
  req: Request;
  res: Response;
}

export const authMiddleware = ({ req }: { req: Request }) => {
  let token = req.headers.authorization ?? '';

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    const decoded = jwt.verify(token, secret) as { _id: string; email: string; username: string };
    return { user: decoded };
  } catch (err) {
    console.error('Invalid token');
    throw new AuthenticationError('Invalid token');
  }
};

export const signToken = (user: { _id: string; email: string; username: string }) => {
  return jwt.sign({ _id: user._id, email: user.email, username: user.username }, secret, {
    expiresIn: expiration,
  });
};
