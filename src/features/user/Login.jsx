import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import { loginUser, getAuthStatus, getAuthError } from '../../store/userSlice';
import { switchUserContext } from '../../store/ratingSlice';
import { isValidEmail, isValidPhone, isValidPassword } from '../../utils/validation';
import Container from '../../layout/Container';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(getAuthStatus);
    const error = useSelector(getAuthError);
    const isSubmitting = status === 'loading';

    const validateField = (name, value) => {
        let result = { valid: true, error: null };
        if (name === 'identifier') {
            // Identifier can be email OR phone
            const emailValid = isValidEmail(value);
            const phoneValid = isValidPhone(value);
            if (!emailValid.valid && !phoneValid.valid) {
                result = { valid: false, error: 'Please enter a valid email or phone number' };
            }
        }
        if (name === 'password') result = isValidPassword(value);
        return result;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        const validation = validateField(name, value);
        setErrors({ ...errors, [name]: validation.error });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'identifier') setIdentifier(value);
        if (name === 'password') setPassword(value);

        if (touched[name]) {
            const validation = validateField(name, value);
            setErrors({ ...errors, [name]: validation.error });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation before submit
        const idVal = validateField('identifier', identifier);
        const passVal = validateField('password', password);

        setErrors({ identifier: idVal.error, password: passVal.error });
        setTouched({ identifier: true, password: true });

        if (!idVal.valid || !passVal.valid) return;

        const result = await dispatch(loginUser({ identifier, password }));
        if (loginUser.fulfilled.match(result)) {
            // Switch rating context to the logged-in customer
            const customerId = result.payload.data.user.id;
            dispatch(switchUserContext(customerId));

            toast.success('Welcome back!');
            navigate('/');
        } else {
            toast.error(typeof result.payload === 'string' ? result.payload : 'Login failed');
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
                    <h1 className="text-3xl font-black text-white">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-red-500" /> Email or Phone
                        </label>
                        <input
                            name="identifier"
                            type="text"
                            value={identifier}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition ${errors.identifier && touched.identifier ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'}`}
                            placeholder="you@example.com or +1 234..."
                        />
                        {errors.identifier && touched.identifier && (
                            <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                                <AlertCircle className="w-4 h-4" /> {errors.identifier}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-red-500" /> Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition ${errors.password && touched.password ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'}`}
                            placeholder="••••••••"
                        />
                        {errors.password && touched.password && (
                            <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                                <AlertCircle className="w-4 h-4" /> {errors.password}
                            </div>
                        )}
                    </div>

                    <Button type="submit" variant="primary" className="w-full !py-4 text-lg !rounded-xl" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Login'} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <div className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-red-500 hover:text-red-400 font-bold">Sign up</Link>
                    </div>
                </form>
            </motion.div>
        </Container>
    );
}

export default Login;
