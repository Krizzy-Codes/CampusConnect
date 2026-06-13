const express = require('express');
const router = express.Router();
const { postItem, getItems, claimItem, getMyItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.post('/post', protect, postItem);
router.get('/all', protect, getItems);
router.get('/my-items', protect, getMyItems);
router.patch('/claim/:itemId', protect, claimItem);

module.exports = router;