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

export const validateGuide = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('tags').optional().isArray(),
  body('code_snippet').optional().isString(),
  body('code_language').optional().isString(),
  body('category').optional().isString(),
  validateRequest
];

export const validateGuideWithSteps = [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('tags').optional().isArray(),
  body('code_snippet').optional().isString(),
  body('code_language').optional().isString(),
  body('category').optional().isString(),
  body('steps').optional().isArray(),
  validateRequest
];

export const validateStep = [
  body('guide_id').isUUID().withMessage('Valid guide ID is required'),
  body('step_number').isInt({ min: 1 }).withMessage('Step number must be a positive integer'),
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('start_line').isInt({ min: 0 }).withMessage('Start line must be a non-negative integer'),
  body('end_line').isInt({ min: 0 }).withMessage('End line must be a non-negative integer'),
  validateRequest
];