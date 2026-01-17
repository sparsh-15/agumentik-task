import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateUser from './pages/CreateUser';
import ViewUsers from './pages/ViewUsers';
import ProductsManagement from './pages/ProductsManagement';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          
          {/* Admin Routes Only */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/users" element={<ViewUsers />} />
          <Route path="/admin/products" element={<ProductsManagement />} />
          
          {/* Redirect any other routes to admin login */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ToastProvider>
  );
}

export default App;
