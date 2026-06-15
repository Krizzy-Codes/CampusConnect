import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Expenses = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [expenseData, setExpenseData] = useState({ description: '', amount: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchExpenses();
      fetchBalances();
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups/my-groups');
      setGroups(res.data);
    } catch (err) {
      toast.error('Failed to fetch groups');
    }
  };

  const fetchExpenses = async () => {
  try {
    const res = await api.get(`/expenses/group/${selectedGroup._id}`);
    setExpenses(res.data);
  } catch (err) {
    toast.error('Failed to fetch expenses');
  }
};

const fetchBalances = async () => {
  try {
    const res = await api.get(`/expenses/balances/${selectedGroup._id}`);
    setBalances(res.data);
  } catch (err) {
    toast.error('Failed to fetch balances');
  }
};

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/groups/create', { name: groupName });
      toast.success('Group created! 🎉');
      setShowGroupForm(false);
      setGroupName('');
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses/add', {
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        groupId: selectedGroup._id
      });
      toast.success('Expense added! 💸');
      setShowExpenseForm(false);
      setExpenseData({ description: '', amount: '' });
      fetchExpenses();
      fetchBalances();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleSettle = async (expenseId) => {
  try {
    await api.patch(`/expenses/settle/${expenseId}`);
    toast.success('Settled! ✅');
    // Force re-fetch
    const expRes = await api.get(`/expenses/group/${selectedGroup._id}`);
    setExpenses(expRes.data);
    const balRes = await api.get(`/expenses/balances/${selectedGroup._id}`);
    setBalances(balRes.data);
  } catch (err) {
    toast.error('Failed to settle');
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-medium">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">Expense Splitter 💸</h1>
        <button
          onClick={() => setShowGroupForm(!showGroupForm)}
          className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
        >
          + New Group
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-6">

        {/* Create Group Form */}
        {showGroupForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Create a Group</h2>
            <form onSubmit={handleCreateGroup} className="flex gap-3">
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Create
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Groups list */}
          <div className="col-span-1">
            <h2 className="font-semibold text-gray-800 mb-3">Your Groups</h2>
            {groups.length === 0 ? (
              <p className="text-gray-500 text-sm">No groups yet — create one!</p>
            ) : (
              <div className="space-y-2">
                {groups.map(group => (
                  <div
                    key={group._id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-4 rounded-xl cursor-pointer transition border ${selectedGroup?._id === group._id ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:border-blue-200'}`}
                  >
                    <p className="font-medium text-gray-800">{group.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{group.members?.length} members</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group details */}
          <div className="col-span-2">
            {!selectedGroup ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Select a group to see expenses
              </div>
            ) : (
              <div className="space-y-4">

                {/* Balances */}
              {Object.keys(balances).length > 0 && (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
    <h3 className="font-semibold text-red-700 mb-2">Outstanding Balances</h3>
    {Object.entries(balances).map(([key, amount]) => (
      <p key={key} className="text-sm text-red-600">
        {key}: ₹{amount.toFixed(2)}
      </p>
    ))}
  </div>
)}

                {/* Add expense button */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Expenses in {selectedGroup.name}</h3>
                  <button
                    onClick={() => setShowExpenseForm(!showExpenseForm)}
                    className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                  >
                    + Add Expense
                  </button>
                </div>

                {/* Add expense form */}
                {showExpenseForm && (
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <form onSubmit={handleAddExpense} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Description (e.g. Pizza)"
                        value={expenseData.description}
                        onChange={e => setExpenseData({...expenseData, description: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Amount (₹)"
                        value={expenseData.amount}
                        onChange={e => setExpenseData({...expenseData, amount: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        Add Expense
                      </button>
                    </form>
                  </div>
                )}

                {/* Expenses list */}
                {expenses.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                    No expenses yet — add one!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map(expense => (
                      <div key={expense._id} className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{expense.description}</p>
                            <p className="text-sm text-gray-500">
                              ₹{expense.amount} • Paid by {expense.paidBy?.name}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSettle(expense._id)}
                            className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-green-100 hover:text-green-600 transition"
                          >
                            Settle
                          </button>
                        </div>
                        <div className="mt-3 space-y-1">
                          {expense.splitAmong?.map(split => (
                            <div key={split._id} className="flex justify-between text-xs text-gray-500">
                              <span>{split.user?.name}</span>
                              <span className={split.settled ? 'text-green-500' : 'text-red-500'}>
                                ₹{split.amount?.toFixed(2)} {split.settled ? '✅' : '⏳'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;