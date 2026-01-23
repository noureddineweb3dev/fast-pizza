import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Lock, Shield, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import { adminLogin } from '../../store/adminSlice';
import Container from '../../layout/Container';

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

    dispatch(adminLogin({ password }));

    if (password === 'admin123') {
      toast.success('Login successful!', { id: 'admin-login' });
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid password', { id: 'admin-login' });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900/50 border border-white/10 rounded-[2rem] shadow-2xl p-8 backdrop-blur-sm"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-600/20 rounded-2xl border border-red-500/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Admin Access</h1>
          <p className="text-gray-400 mt-2">Enter password to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-bold text-gray-300">
              <KeyRound className="w-4 h-4 text-red-500" />
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />
          </div>

          <Button type="submit" variant="primary" className="w-full !py-4 text-lg !rounded-xl">
            <Lock className="w-5 h-5 mr-2" />
            Login
          </Button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-gray-400">
            <span className="text-gray-500">Demo:</span> <code className="text-red-400">admin123</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
