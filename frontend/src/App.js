import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LostFound from './pages/LostFound';
import Notices from './pages/Notices';
import Notes from './pages/Notes';
import Expenses from './pages/Expenses';
import Profile from './pages/Profile';

// Protected route
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/lost-found" element={
  <ProtectedRoute>
    <LostFound />
  </ProtectedRoute>
} />
<Route path="/notices" element={
  <ProtectedRoute>
    <Notices />
  </ProtectedRoute>
} />
<Route path="/notes" element={
  <ProtectedRoute>
    <Notes />
  </ProtectedRoute>
} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
        <Route path="/expenses" element={
  <ProtectedRoute>
    <Expenses />
  </ProtectedRoute>
} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;