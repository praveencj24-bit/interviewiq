import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { HttpError } from './error.js';

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Please log in');
  }

  try {
    req.userId = jwt.verify(token, env.jwtSecret).id;
  } catch {
    throw new HttpError(401, 'Your session has expired, please log in again');
  }
  next();
}
