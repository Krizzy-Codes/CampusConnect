const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validateMiddleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

router.get('/profile', protect, async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

// Dev only — saare users dekho
router.get('/all-users', protect, async (req, res) => {
  const User = require('../models/User');
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;