import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', location: '', status: 'lost'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/items/all${filter ? `?status=${filter}` : ''}`);
      setItems(res.data);
    } catch (err) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items/post', formData);
      toast.success('Item posted! ✅');
      setShowForm(false);
      setFormData({ name: '', description: '', location: '', status: 'lost' });
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    }
  };

  const handleClaim = async (itemId) => {
    try {
      await api.patch(`/items/claim/${itemId}`);
      toast.success('Item claimed! 🎉');
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-medium">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">Lost & Found 🔍</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
        >
          + Post Item
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {/* Post Item Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Post an Item</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Item name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition"
              >
                Post Item
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['', 'lost', 'found'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'}`}
            >
              {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Items list */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">No items yet. Post one!</p>
        ) : (
          <div className="grid gap-4">
            {items.map(item => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {item.status}
                      </span>
                      {item.isClaimed && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">
                          Claimed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1">📍 {item.location} • Posted by {item.postedBy?.name}</p>
                  </div>
                  {!item.isClaimed && (
                    <button
                      onClick={() => handleClaim(item._id)}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      Claim
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

export default LostFound;