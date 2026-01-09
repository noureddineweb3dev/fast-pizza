import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Lock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import { adminLogin } from '../../store/adminSlice';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      toast.error('Please enter password', { id: 'admin-login' });
      return;
    }

    // Try to login
    dispatch(adminLogin({ password }));

    // Check if login was successful
    if (password === 'admin123') {
      toast.success('Login successful!', { id: 'admin-login' });
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid password', { id: 'admin-login' });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-sp-black">Admin Login</h1>
          <p className="text-gray-600 mt-2">Enter password to access dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 font-medium text-gray-900">
              <Lock className="w-5 h-5 text-red-600" />
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />
          </div>

          <Button type="submit" variant="primary" className="w-full text-lg">
            Login
          </Button>
        </form>

        {/* Demo Hint */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            <strong>Demo Password:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
