const express = require('express');
const router = express.Router();
const { postNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');
const { noticeValidation } = require('../middleware/validateMiddleware');

router.post('/post', protect, noticeValidation, postNotice);
router.get('/all', protect, getNotices);
router.delete('/delete/:noticeId', protect, deleteNotice);

module.exports = router;