import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import { HttpError } from '../middleware/error.js';

function signToken(user) {
  return jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) {
    throw new HttpError(409, 'An account with this email already exists');
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: signToken(user), user });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  // same message for both cases so the response does not reveal which emails exist
  if (!user || !(await user.checkPassword(password))) {
    throw new HttpError(401, 'Wrong email or password');
  }
  res.json({ token: signToken(user), user });
}

export async function getMe(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new HttpError(401, 'This account no longer exists');
  }
  res.json(user);
}
