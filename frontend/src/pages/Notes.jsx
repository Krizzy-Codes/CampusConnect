import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ subject: '', semester: '' });
  const [formData, setFormData] = useState({
    title: '', subject: '', semester: '', fileUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, [filters]);

  const fetchNotes = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.semester) params.append('semester', filters.semester);
      const res = await api.get(`/notes/all?${params}`);
      setNotes(res.data);
    } catch (err) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notes/upload', { ...formData, semester: parseInt(formData.semester) });
      toast.success('Note uploaded! 📚');
      setShowForm(false);
      setFormData({ title: '', subject: '', semester: '', fileUrl: '' });
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload');
    }
  };

  const handleUpvote = async (noteId) => {
    try {
      const res = await api.patch(`/notes/upvote/${noteId}`);
      toast.success(res.data.message);
      fetchNotes();
    } catch (err) {
      toast.error('Failed to upvote');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-medium">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">Notes & PYQs 📚</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-purple-600 transition"
        >
          + Upload Note
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Upload a Note</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Subject (e.g. DSA, DBMS)"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="number"
                placeholder="Semester (1-8)"
                value={formData.semester}
                onChange={e => setFormData({...formData, semester: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min={1} max={8}
                required
              />
              <input
                type="url"
                placeholder="File URL (Google Drive / PDF link)"
                value={formData.fileUrl}
                onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition"
              >
                Upload Note
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Filter by subject"
            value={filters.subject}
            onChange={e => setFilters({...filters, subject: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={filters.semester}
            onChange={e => setFilters({...filters, semester: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
          <button
            onClick={() => setFilters({ subject: '', semester: '' })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear filters
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes yet. Upload one!</p>
        ) : (
          <div className="grid gap-4">
            {notes.map(note => (
              <div key={note._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{note.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{note.subject}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Sem {note.semester}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Uploaded by {note.uploadedBy?.name}</p>
                  </div>
             <div className="flex flex-col items-end gap-2">
  <a
    href={note.fileUrl}
    target="_blank"
    rel="noreferrer"
    className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-600 transition"
  >
    Download
  </a>
  <button
    onClick={() => handleUpvote(note._id)}
    className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition"
  >
    👍 {note.upvotes?.length || 0}
  </button>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;