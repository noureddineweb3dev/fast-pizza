import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, MapPin, Clock, ChefHat, Package } from 'lucide-react';
import { getIsAuthenticated } from '../../store/userSlice';
import Button from '../../ui/Button';
import Container from '../../layout/Container';

function OrderSearch() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = useSelector(getIsAuthenticated);

  const isValid = orderId.length === 10 && orderId.startsWith('SAP');

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    navigate(`/order/${orderId}`);
  }

  // Auto-format input to uppercase
  const handleChange = (e) => {
    let val = e.target.value.toUpperCase();
    if (val.length <= 10) setOrderId(val);
  };

  const steps = [
    { icon: <Package className="w-4 h-4" />, label: 'Order' },
    { icon: <ChefHat className="w-4 h-4" />, label: 'Prep' },
    { icon: <Clock className="w-4 h-4" />, label: 'Bake' },
    { icon: <MapPin className="w-4 h-4" />, label: 'Deliv' },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <Container className="w-full max-w-4xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Search */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-left">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter">
              FIND YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">FEAST.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-sm">
              Enter the <span className="text-white font-bold">10-digit ID</span> from your receipt (e.g. SAP1234567).
            </p>

            <form onSubmit={handleSubmit} className="relative max-w-md group">
              <div className="absolute inset-0 bg-red-600/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative flex items-center">
                <Search className="absolute left-5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="SAP..."
                  value={orderId}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 text-xl font-mono tracking-widest uppercase transition-colors"
                />
                <Button
                  type="submit"
                  disabled={!isValid}
                  className={`absolute right-2 p-2 rounded-xl transition-all ${isValid ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-zinc-800 text-zinc-600'}`}
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-zinc-600 mt-2 ml-2 h-4">
                {orderId && !orderId.startsWith('SAP') ? 'Must start with "SAP"' :
                  orderId && orderId.length < 10 ? `${10 - orderId.length} characters remaining` : ''}
              </p>
            </form>

            <div className="mt-12 flex items-center gap-8 opacity-50">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="p-1.5 bg-zinc-800 rounded-lg text-gray-400">{step.icon}</div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{step.label}</span>
                  {i < steps.length - 1 && <div className="h-px w-4 bg-zinc-800" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Signup (Conditional) or Decorative */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="hidden lg:block">
            {!isAuthenticated ? (
              <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 p-8 text-center">
                <div className="absolute top-0 right-0 p-24 bg-red-600/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl text-yellow-500 mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Track Faster Next Time</h3>
                <p className="text-gray-400 mb-8 mx-auto max-w-xs">Create an account to save your order history and unlock exclusive rewards.</p>
                <Link to="/signup" className="inline-block w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl transition-transform hover:scale-[1.02]">
                  Create Account
                </Link>
              </div>
            ) : (
              // If authenticated, show a nice decorative element or order history quick link
              <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 p-8 flex items-center justify-center aspect-square">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]" />
                <div className="text-center opacity-30">
                  <Package className="w-24 h-24 mx-auto text-red-500 mb-4" />
                  <p className="font-bold text-lg">READY TO TRACK</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

export default OrderSearch;
