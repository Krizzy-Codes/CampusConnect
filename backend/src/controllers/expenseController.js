const Expense = require('../models/Expense');
const Group = require('../models/Group');

// Expense add karo
const addExpense = async (req, res) => {
  try {
    const { description, amount, groupId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Split equally among all members
    const splitAmount = amount / group.members.length;
    const splitAmong = group.members.map(memberId => ({
      user: memberId,
      amount: splitAmount,
      settled: memberId.toString() === req.userId ? true : false
    }));

    const expense = new Expense({
      description,
      amount,
      paidBy: req.userId,
      group: groupId,
      splitAmong
    });

    await expense.save();
    res.status(201).json({ message: 'Expense added!', expense });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Group ke saare expenses dekho
const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email')
      .populate('splitAmong.user', 'name email');

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Balance calculate karo — who owes whom
const getBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId });

    const balances = {};

    expenses.forEach(expense => {
      const paidBy = expense.paidBy.toString();

      expense.splitAmong.forEach(split => {
        const owes = split.user.toString();
        if (owes === paidBy) return;
        if (!split.settled) {
          if (!balances[owes]) balances[owes] = {};
          if (!balances[owes][paidBy]) balances[owes][paidBy] = 0;
          balances[owes][paidBy] += split.amount;
        }
      });
    });

    res.json(balances);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Expense settle karo
const settleExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.splitAmong = expense.splitAmong.map(split => {
      if (split.user.toString() === req.userId) {
        split.settled = true;
      }
      return split;
    });

    await expense.save();
    res.json({ message: 'Settled!', expense });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addExpense, getGroupExpenses, getBalances, settleExpense };