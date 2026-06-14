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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  CampusConnect
</h1>
        <div className="flex items-center gap-4">
          <span
            onClick={() => navigate('/profile')}
            className="text-gray-600 cursor-pointer hover:text-blue-600 transition"
          >
            Hey, {user?.name}! 👋
          </span>
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
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Your Profile</h3>
            <div className="space-y-4">
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
                <p className="font-medium">{user?.college || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff&size=80`}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.bio || 'No bio yet'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{user?.branch || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semester</p>
                <p className="font-medium">{user?.semester ? `Semester ${user.semester}` : 'Not set'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Edit Profile →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;