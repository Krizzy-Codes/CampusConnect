const Item = require('../models/Item');

// Item post karo
const postItem = async (req, res) => {
  try {
    const { name, description, location, status, imageUrl } = req.body;

    const item = new Item({
      name,
      description,
      location,
      status,
      imageUrl,
      postedBy: req.userId
    });

    await item.save();
    
    // Socket.io — real-time notification
    const io = req.app.get('io');
    io.emit('newItem', item);

    res.status(201).json({ message: 'Item posted!', item });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Saare items dekho
const getItems = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Item claim karo
const claimItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.isClaimed) {
      return res.status(400).json({ message: 'Item already claimed' });
    }

    item.isClaimed = true;
    item.claimedBy = req.userId;
    await item.save();

    // Socket.io — real-time notification
    const io = req.app.get('io');
    io.emit('itemClaimed', item);

    res.json({ message: 'Item claimed!', item });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apne posted items dekho
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.userId })
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { postItem, getItems, claimItem, getMyItems };