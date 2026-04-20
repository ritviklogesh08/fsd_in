import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const getRole = () => {
  try {
    return JSON.parse(localStorage.getItem('user'))?.role;
  } catch {
    return null;
  }
};

function App() {
  const role = getRole();

  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={role === 'ADMIN' ? '/admin' : '/dashboard'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute allowedRoles={["USER"]}><UserDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>}
        />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </div>
  );
}

export default App;
