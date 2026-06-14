import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '', body: '', category: 'general'
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, [filter]);

  const fetchNotices = async () => {
    try {
      const res = await api.get(`/notices/all${filter ? `?category=${filter}` : ''}`);
      setNotices(res.data);
    } catch (err) {
      toast.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices/post', formData);
      toast.success('Notice posted! 📢');
      setShowForm(false);
      setFormData({ title: '', body: '', category: 'general' });
      fetchNotices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post notice');
    }
  };

  const handleDelete = async (noticeId) => {
    try {
      await api.delete(`/notices/delete/${noticeId}`);
      toast.success('Notice deleted!');
      fetchNotices();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const categoryColors = {
    urgent: 'bg-red-100 text-red-600',
    event: 'bg-blue-100 text-blue-600',
    general: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-medium">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">Noticeboard 📢</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-yellow-600 transition"
        >
          + Post Notice
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Post a Notice</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <textarea
                placeholder="Notice body"
                value={formData.body}
                onChange={e => setFormData({...formData, body: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={3}
                required
              />
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="general">General</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
              >
                Post Notice
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['', 'general', 'event', 'urgent'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
            >
              {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : notices.length === 0 ? (
          <p className="text-center text-gray-500">No notices yet!</p>
        ) : (
          <div className="grid gap-4">
            {notices.map(notice => (
              <div key={notice._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[notice.category]}`}>
                        {notice.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{notice.body}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Posted by {notice.postedBy?.name} • {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {notice.postedBy?._id === user?.id && (
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="text-red-400 hover:text-red-600 ml-4 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;