import { body } from 'express-validator';
import { validateRequest } from './index';

export const validateSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 }),
  body('profession').optional().trim(),
  body('bio').optional().trim(),
  validateRequest
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }),
  validateRequest
];