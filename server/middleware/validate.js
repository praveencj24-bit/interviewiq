import { HttpError } from './error.js';
import { DIFFICULTIES } from '../models/Interview.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bodyOf(req) {
  const body = req.body;
  return body && typeof body === 'object' && !Array.isArray(body) ? body : {};
}

function checkText(value, label, min, max) {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string') {
    throw new HttpError(400, `${label} must be text`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new HttpError(400, `${label} is required`);
  }
  if (trimmed.length < min || trimmed.length > max) {
    throw new HttpError(400, `${label} must be between ${min} and ${max} characters`);
  }
  return trimmed;
}

function checkEmail(value) {
  const email = checkText(value, 'Email', 3, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    throw new HttpError(400, 'Email is not valid');
  }
  return email;
}

export function checkRegister(req, res, next) {
  const body = bodyOf(req);
  const { password } = body;
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    throw new HttpError(400, 'Password must be 8 to 72 characters');
  }
  req.body = {
    name: checkText(body.name, 'Name', 1, 60),
    email: checkEmail(body.email),
    password,
  };
  next();
}

export function checkLogin(req, res, next) {
  const body = bodyOf(req);
  if (typeof body.password !== 'string' || !body.password) {
    throw new HttpError(400, 'Password is required');
  }
  req.body = { email: checkText(body.email, 'Email', 3, 254).toLowerCase(), password: body.password };
  next();
}

export function checkAnalysisInput(req, res, next) {
  req.body = { jobDescription: checkText(bodyOf(req).jobDescription, 'Job description', 50, 8000) };
  next();
}

export function checkInterviewInput(req, res, next) {
  const body = bodyOf(req);
  if (!DIFFICULTIES.includes(body.difficulty)) {
    throw new HttpError(400, `Difficulty must be one of: ${DIFFICULTIES.join(', ')}`);
  }
  req.body = { role: checkText(body.role, 'Role', 2, 80), difficulty: body.difficulty };
  next();
}

export function checkAnswer(req, res, next) {
  const body = bodyOf(req);
  if (!Number.isInteger(body.questionIndex) || body.questionIndex < 0 || body.questionIndex > 4) {
    throw new HttpError(400, 'questionIndex must be a number from 0 to 4');
  }
  req.body = { questionIndex: body.questionIndex, answer: checkText(body.answer, 'Answer', 1, 3000) };
  next();
}
