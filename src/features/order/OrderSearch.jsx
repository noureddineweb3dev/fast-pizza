import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, History, ArrowRight } from 'lucide-react';
import Button from '../../ui/Button';
import Container from '../../layout/Container';

function OrderSearch() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

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
      <div className="flex justify-center">
        <Link to="/order/history">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-3 px-6 py-4 bg-zinc-900/50 rounded-2xl border border-white/10 hover:border-red-500/30 transition-colors cursor-pointer">
            <div className="p-2 bg-red-600/20 rounded-xl border border-red-500/30">
              <History className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold">Order History</p>
              <p className="text-gray-400 text-sm">View all your past orders</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 ml-4" />
          </motion.div>
        </Link>
      </div>
    </>
  );
}

export default OrderSearch;
