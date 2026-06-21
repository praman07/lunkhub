import { body } from 'express-validator';

export const registerValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const loginValidation = [
    body('identifier')
        .trim()
        .notEmpty()
        .withMessage('Email or username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];