import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import { signupUser, getAuthStatus, getAuthError } from '../../store/userSlice';
import Container from '../../layout/Container';

function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(getAuthStatus);
    const isSubmitting = status === 'loading';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !password) return toast.error('Please fill in all fields');

        const result = await dispatch(signupUser({ fullName, email, password }));
        if (signupUser.fulfilled.match(result)) {
            toast.success('Account created!');
            navigate('/');
        } else {
            toast.error(typeof result.payload === 'string' ? result.payload : 'Signup failed');
        }
    };

    return (
        <Container className="py-20 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-zinc-900/50 border border-white/10 rounded-[2rem] shadow-2xl p-8 backdrop-blur-sm"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white">Join the Clan</h1>
                    <p className="text-gray-400 mt-2">Create your samurai account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <User className="w-4 h-4 text-red-500" /> Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="e.g. Miyamoto Musashi"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-red-500" /> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-red-500" /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full !py-4 text-lg !rounded-xl" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <div className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-500 hover:text-red-400 font-bold">Login</Link>
                    </div>
                </form>
            </motion.div>
        </Container>
    );
}

export default Signup;
