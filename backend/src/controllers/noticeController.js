const Notice = require('../models/Notice');

// Notice post karo
const postNotice = async (req, res) => {
  try {
    const { title, body, category } = req.body;

    const notice = new Notice({
      title,
      body,
      category,
      postedBy: req.userId
    });

    await notice.save();

    // Socket.io — real-time
    const io = req.app.get('io');
    io.emit('newNotice', notice);

    res.status(201).json({ message: 'Notice posted!', notice });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Saari notices dekho
const getNotices = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const notices = await Notice.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(notices);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Notice delete karo
const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;

    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    if (notice.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notice.deleteOne();
    res.json({ message: 'Notice deleted!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { postNotice, getNotices, deleteNotice };