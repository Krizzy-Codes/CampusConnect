const express = require('express');
const router = express.Router();
const { addExpense, getGroupExpenses, getBalances, settleExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addExpense);
router.get('/group/:groupId', protect, getGroupExpenses);
router.get('/balances/:groupId', protect, getBalances);
router.patch('/settle/:expenseId', protect, settleExpense);

module.exports = router;