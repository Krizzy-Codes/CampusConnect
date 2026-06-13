const express = require('express');
const router = express.Router();
const { postItem, getItems, claimItem, getMyItems } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const { itemValidation } = require('../middleware/validateMiddleware');

router.post('/post', protect, itemValidation, postItem);
router.get('/all', protect, getItems);
router.get('/my-items', protect, getMyItems);
router.patch('/claim/:itemId', protect, claimItem);

module.exports = router;