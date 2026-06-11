const Group = require('../models/Group');

// Group banao
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = new Group({
      name,
      description,
      members: [req.userId],
      createdBy: req.userId
    });

    await group.save();
    res.status(201).json({ message: 'Group created!', group });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apne saare groups dekho
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.userId })
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.json(groups);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Group mein member add karo
const addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(userId);
    await group.save();

    res.json({ message: 'Member added!', group });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createGroup, getMyGroups, addMember };