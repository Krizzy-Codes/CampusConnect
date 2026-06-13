import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CampusConnect</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hey, {user?.name}! 👋</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/expenses')}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-l-4 border-blue-500"
          >
            <div className="text-3xl mb-3">💸</div>
            <h3 className="font-semibold text-gray-800">Expense Splitter</h3>
            <p className="text-sm text-gray-500 mt-1">Split bills with friends</p>
          </div>

          <div
            onClick={() => navigate('/lost-found')}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-l-4 border-green-500"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-800">Lost & Found</h3>
            <p className="text-sm text-gray-500 mt-1">Find lost items on campus</p>
          </div>

          <div
            onClick={() => navigate('/notices')}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-l-4 border-yellow-500"
          >
            <div className="text-3xl mb-3">📢</div>
            <h3 className="font-semibold text-gray-800">Noticeboard</h3>
            <p className="text-sm text-gray-500 mt-1">Campus announcements</p>
          </div>

          <div
            onClick={() => navigate('/notes')}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition border-l-4 border-purple-500"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-800">Notes & PYQs</h3>
            <p className="text-sm text-gray-500 mt-1">Share study material</p>
          </div>
        </div>

        {/* User info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Your Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">College</p>
              <p className="font-medium">{user?.college}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;