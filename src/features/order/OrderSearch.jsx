import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, History, ArrowRight, Sparkles } from 'lucide-react';
import { getIsAuthenticated } from '../../store/userSlice';
import Button from '../../ui/Button';
import Container from '../../layout/Container';

function OrderSearch() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = useSelector(getIsAuthenticated);

  function handleSubmit(e) {
    e.preventDefault();
    if (!orderId.trim()) return;
    navigate(`/order/${orderId}`);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-12 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.15),transparent_50%)]" />
        <Container className="relative z-10 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-bold tracking-widest text-xs uppercase backdrop-blur-md">
            <Package className="w-4 h-4" /> Order Tracking
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white mb-4">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Order</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg max-w-md mx-auto mb-8">
            Enter your order ID and let the Pizza Samurai find your feast.
          </motion.p>

          {/* Search Form */}
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onSubmit={handleSubmit} className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Order ID (e.g. SDDS0001)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 text-lg font-semibold tracking-wider"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="!rounded-xl !py-4 !px-6" disabled={!orderId.trim()}>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.form>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-500 text-sm mt-4">
            Your order ID is shown after checkout
          </motion.p>
        </Container>
      </section>

      {/* Quick Link */}
      <div className="flex flex-col items-center gap-6">


        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-2xl relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-900/50 p-6 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(234,179,8,0.1),transparent_50%)]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white mb-1">Track history, get rewards!</h3>
                  <p className="text-gray-400 text-sm">Create an account to keep your orders in one place.</p>
                </div>
              </div>
              <Link to="/signup" className="w-full md:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20">
                Sign Up Now
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default OrderSearch;
