import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateUser from './pages/CreateUser';
import ViewUsers from './pages/ViewUsers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        
        {/* Admin Routes Only */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/users" element={<ViewUsers />} />
        
        {/* Redirect any other routes to admin login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
