const { body, param, validationResult } = require('express-validator');

// Validation result check karo
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0].msg 
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('college')
    .trim()
    .notEmpty().withMessage('College is required'),
  validate
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

// Group validations
const groupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Group name is required'),
  validate
];

// Expense validations
const expenseValidation = [
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number')
    .custom(val => val > 0).withMessage('Amount must be greater than 0'),
  body('groupId')
    .notEmpty().withMessage('Group ID is required')
    .isMongoId().withMessage('Invalid Group ID'),
  validate
];

// Item validations
const itemValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Item name is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['lost', 'found']).withMessage('Status must be lost or found'),
  validate
];

// Notice validations
const noticeValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('body')
    .trim()
    .notEmpty().withMessage('Body is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['event', 'urgent', 'general']).withMessage('Invalid category'),
  validate
];

// Note validations
const noteValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required'),
  body('semester')
    .notEmpty().withMessage('Semester is required')
    .isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8'),
  body('fileUrl')
    .notEmpty().withMessage('File URL is required')
    .isURL().withMessage('Please enter a valid URL'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  groupValidation,
  expenseValidation,
  itemValidation,
  noticeValidation,
  noteValidation
};