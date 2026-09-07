const { body, validationResult } = require('express-validator');

// Validation rules for creating a user (all fields required)
const createUserValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('A valid email is required')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation rules for updating a user (fields optional, but validated if present)
const updateUserValidationRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('A valid email is required')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Middleware that checks the validation result and returns a 400 error if invalid
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

module.exports = {
  createUserValidationRules,
  updateUserValidationRules,
  validate,
};
