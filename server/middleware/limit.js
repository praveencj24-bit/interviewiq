import { rateLimit } from 'express-rate-limit';

// Every AI route costs money and quota, so each user gets 30 AI calls per 15 minutes.
// It runs after requireAuth, so the key is the user id rather than the IP address.
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => req.userId,
  handler: (req, res) => {
    res.status(429).json({ message: 'You have made too many AI requests. Please wait a few minutes and try again.' });
  },
});
