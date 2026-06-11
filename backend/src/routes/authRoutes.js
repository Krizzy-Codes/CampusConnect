const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Protected route — sirf logged in users
router.get('/profile', protect, async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

module.exports = router;