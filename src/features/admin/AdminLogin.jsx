import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Lock, Shield, KeyRound, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import { loginAdmin } from '../../store/adminSlice';
import PizzaLogo from '../../ui/PizzaLogo';
function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple Validation
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      const result = await dispatch(loginAdmin({ username, password })).unwrap();

      // Role check (backend also checks but safe to check here too)
      const user = result?.data?.user;
      if (['admin', 'manager', 'staff'].includes(user?.role)) {
        toast.success(`Welcome ${user.fullName} (${user.role})!`);
        // Force full reload to ensure clean state and avoid transition issues
        window.location.replace('/admin/dashboard');
      } else {
        toast.error('Access Denied: You are not authorized');
        setIsLoading(false); // Reset loading if access denied (only needed here if not redirecting)
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(typeof err === 'string' ? err : 'Login failed');
      setIsLoading(false);
    }
    // Note: finally block removed because if we redirect, we don't want to update state on unmounted component.
    // We strictly handle setIsLoading(false) in error/rejection cases above.
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900/80 border border-white/10 rounded-[2rem] shadow-2xl p-8 backdrop-blur-xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="mb-6 hover:scale-105 transition-transform">
            <PizzaLogo className="w-48 h-16" />
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Command Center</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white">Identity Verification</h1>
          <p className="text-gray-400 text-sm mt-1">Enter your credentials to access the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <User className="w-4 h-4 text-red-500" /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all placeholder-gray-600 ${errors.username ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600 focus:border-transparent'}`}
              autoFocus
              disabled={isLoading}
            />
            {errors.username && (
              <div className="flex items-center gap-2 text-xs text-red-500 mt-1 font-bold">
                <AlertCircle className="w-3 h-3" /> {errors.username}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-red-500" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all placeholder-gray-600 ${errors.password ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600 focus:border-transparent'}`}
              disabled={isLoading}
            />
            {errors.password && (
              <div className="flex items-center gap-2 text-xs text-red-500 mt-1 font-bold">
                <AlertCircle className="w-3 h-3" /> {errors.password}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full !py-4 text-lg !rounded-xl relative overflow-hidden group"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" /> Access System
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Website
          </Link>
        </div>
      </motion.div>

      <p className="fixed bottom-4 text-[10px] text-gray-600 font-mono">
        SECURE CONNECTION • ENCRYPTED
      </p>
    </div>
  );
}

export default AdminLogin;
