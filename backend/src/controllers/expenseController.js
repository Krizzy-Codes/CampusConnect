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

    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('splitAmong.user', 'name');

    const balances = {};

    expenses.forEach(expense => {
      const paidBy = expense.paidBy._id.toString();
      const paidByName = expense.paidBy.name;

      expense.splitAmong.forEach(split => {
        const owesId = split.user._id.toString();
        const owesName = split.user.name;
        if (owesId === paidBy) return;
        if (!split.settled) {
          const key = `${owesName} owes ${paidByName}`;
          if (!balances[key]) balances[key] = 0;
          balances[key] += split.amount;
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

    console.log("Logged user:", req.userId);

    expense.splitAmong.forEach(split => {
      console.log(
        split.user.toString(),
        req.userId,
        split.user.toString() === req.userId
      );
    });

    expense.splitAmong = expense.splitAmong.map(split => {
      if (split.user.toString() === req.userId) {
        split.settled = true;
      }
      return split;
    });

    await expense.save();

    res.json({ message: "Settled!", expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addExpense, getGroupExpenses, getBalances, settleExpense };