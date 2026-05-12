import rateLimit from 'express-rate-limit';

export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, code: 'RATE_LIMIT', message: 'Too many registration attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const votingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, code: 'RATE_LIMIT', message: 'Too many vote attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, code: 'RATE_LIMIT', message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
