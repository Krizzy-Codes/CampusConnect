const express = require('express');
const router = express.Router();
const { uploadNote, getNotes, upvoteNote, getMyNotes } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { noteValidation } = require('../middleware/validateMiddleware');

router.post('/upload', protect, noteValidation, uploadNote);
router.get('/all', protect, getNotes);
router.get('/my-notes', protect, getMyNotes);
router.patch('/upvote/:noteId', protect, upvoteNote);

module.exports = router;