const express = require('express');
const router = express.Router();
const { createGroup, getMyGroups, addMember } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');
const { groupValidation } = require('../middleware/validateMiddleware');

router.post('/create', protect, groupValidation, createGroup);
router.get('/my-groups', protect, getMyGroups);
router.post('/add-member', protect, addMember);

module.exports = router;