import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Lock, Shield, KeyRound, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import { loginAdmin } from '../../store/adminSlice';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter credentials', { id: 'admin-login' });
      return;
    }

    try {
      const result = await dispatch(loginAdmin({ email, password })).unwrap();

      // Role check (backend also checks but safe to check here too)
      if (['admin', 'manager', 'staff'].includes(result.user.role)) {
        toast.success(`Welcome ${result.user.fullName} (${result.user.role})!`);
        navigate('/admin/dashboard');
      } else {
        toast.error('Access Denied: You are not authorized');
      }
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900/50 border border-white/10 rounded-[2rem] shadow-2xl p-8 backdrop-blur-sm"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-600/20 rounded-2xl border border-red-500/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
              <Mail className="w-4 h-4 text-red-500" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
              <KeyRound className="w-4 h-4 text-red-500" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full !py-4 text-lg !rounded-xl">
            <Lock className="w-5 h-5 mr-2" /> Login
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
