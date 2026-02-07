import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Lock, LogIn, ArrowRight, Phone, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';
import { signupUser, getAuthStatus, getAuthError } from '../../store/userSlice';
import { switchUserContext } from '../../store/ratingSlice';
import { isValidEmail, isValidPhone, isValidPassword, isValidName, isValidAddress } from '../../utils/validation';
import Container from '../../layout/Container';

function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector(getAuthStatus);
    const isSubmitting = status === 'loading';

    const validateField = (name, value) => {
        let result = { valid: true, error: null };
        switch (name) {
            case 'fullName': result = isValidName(value); break;
            case 'email': if (value) result = isValidEmail(value); break;
            case 'phone': if (value) result = isValidPhone(value); break;
            case 'password': result = isValidPassword(value); break;
            case 'address': if (value) result = isValidAddress(value); break;
            default: break;
        }
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
        if (name === 'fullName') setFullName(value);
        if (name === 'email') setEmail(value);
        if (name === 'phone') setPhone(value);
        if (name === 'password') setPassword(value);
        if (name === 'address') setAddress(value);

        if (touched[name]) {
            const validation = validateField(name, value);
            setErrors({ ...errors, [name]: validation.error });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final Validation
        const nameVal = validateField('fullName', fullName);
        const passVal = validateField('password', password);
        const emailVal = email ? validateField('email', email) : { valid: true };
        const phoneVal = phone ? validateField('phone', phone) : { valid: true };

        // Check at least one contact method
        let generalError = null;
        if (!email && !phone) {
            generalError = 'Please provide either Email or Phone';
        }

        setErrors({
            fullName: nameVal.error,
            password: passVal.error,
            email: emailVal.error,
            phone: phoneVal.error,
            general: generalError
        });
        setTouched({ fullName: true, password: true, email: true, phone: true, address: true });

        if (!nameVal.valid || !passVal.valid || !emailVal.valid || !phoneVal.valid || generalError) {
            if (generalError) toast.error(generalError);
            return;
        }

        const result = await dispatch(signupUser({ fullName, email, phone, password, address }));
        if (signupUser.fulfilled.match(result)) {
            // Switch rating context to the new customer
            const customerId = result.payload.data.user.id;
            dispatch(switchUserContext(customerId));

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
                            name="fullName"
                            type="text"
                            value={fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition ${errors.fullName && touched.fullName ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'}`}
                            placeholder="e.g. Miyamoto Musashi"
                        />
                        {errors.fullName && touched.fullName && (
                            <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                                <AlertCircle className="w-4 h-4" /> {errors.fullName}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-red-500" /> Email <span className="text-gray-500 text-xs">(Optional if Phone provided)</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition ${errors.email && touched.email ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && touched.email && (
                            <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                                <AlertCircle className="w-4 h-4" /> {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-500" /> Phone <span className="text-gray-500 text-xs">(Optional if Email provided)</span>
                        </label>
                        <input
                            name="phone"
                            type="tel"
                            value={phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition ${errors.phone && touched.phone ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'}`}
                            placeholder="+1 234 567 890"
                        />
                        {errors.phone && touched.phone && (
                            <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                                <AlertCircle className="w-4 h-4" /> {errors.phone}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" /> Delivery Address <span className="text-gray-500 text-xs">(Optional)</span>
                        </label>
                        <textarea
                            name="address"
                            value={address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition ${errors.address && touched.address ? 'border-red-500 focus:ring-red-600' : 'border-white/10 focus:ring-red-600'} min-h-[80px]`}
                            placeholder="123 Samurai St, Dojo City"
                        />
                        {errors.address && touched.address && (
                            <div className="flex items-center gap-2 text-sm text-red-500 mt-1">
                                <AlertCircle className="w-4 h-4" /> {errors.address}
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
