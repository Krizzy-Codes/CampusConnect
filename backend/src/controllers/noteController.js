const Note = require('../models/Note');

// Note upload karo
const uploadNote = async (req, res) => {
  try {
    const { title, subject, semester, fileUrl } = req.body;

    const note = new Note({
      title,
      subject,
      semester,
      fileUrl,
      uploadedBy: req.userId
    });

    await note.save();
    res.status(201).json({ message: 'Note uploaded!', note });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Saare notes dekho — filter by subject/semester
const getNotes = async (req, res) => {
  try {
    const { subject, semester } = req.query;

    const filter = {};
    if (subject) filter.subject = subject;
    if (semester) filter.semester = parseInt(semester);

    const notes = await Note.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ upvotes: -1, createdAt: -1 });

    res.json(notes);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Note upvote karo
const upvoteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const alreadyUpvoted = note.upvotes.includes(req.userId);

    if (alreadyUpvoted) {
      // Upvote remove karo
      note.upvotes = note.upvotes.filter(
        id => id.toString() !== req.userId
      );
    } else {
      // Upvote add karo
      note.upvotes.push(req.userId);
    }

    await note.save();
    res.json({ 
      message: alreadyUpvoted ? 'Upvote removed!' : 'Upvoted!', 
      upvotes: note.upvotes.length 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apne uploaded notes dekho
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ uploadedBy: req.userId })
      .sort({ createdAt: -1 });

    res.json(notes);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadNote, getNotes, upvoteNote, getMyNotes };