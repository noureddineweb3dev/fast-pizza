import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, Trash2, History, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders, clearOrderHistory } from '../../store/orderHistorySlice';
import { formatCurrency } from '../../utils/helpers';
import { getStatusById } from '../../utils/orderStatuses';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';
import Container from '../../layout/Container';

function OrderHistory() {
  const dispatch = useDispatch();
  const orders = useSelector(getAllOrders);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearHistory = () => {
    dispatch(clearOrderHistory());
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-red-600/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30"
        >
          <History className="w-16 h-16 text-red-500" />
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-3">No Order History</h2>
        <p className="text-gray-400 mb-8 max-w-md">You haven't placed any orders yet. Start exploring our menu!</p>
        <Link to="/menu"><Button variant="primary" size="lg">Browse Menu</Button></Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-12 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(220,38,38,0.15),transparent_50%)]" />
        <Container className="relative z-10 py-16 md:py-20">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-2xl border border-red-500/30">
                <History className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white">Order History</h1>
                <p className="text-gray-400 mt-1">{orders.length} total orders</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Button variant="ghost" onClick={() => setShowConfirm(true)} className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-600/10">
                <Trash2 className="w-4 h-4" /> Clear History
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Orders */}
      <motion.div layout className="space-y-4">
        <AnimatePresence mode="popLayout">
          {orders.map((order, index) => (
            <OrderHistoryCard key={order.id} order={order} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleClearHistory} title="Clear order history?" message="This will permanently delete all your order history. This action cannot be undone." confirmText="Yes, clear history" cancelText="Keep history" variant="danger" />
    </>
  );
}

function OrderHistoryCard({ order, index }) {
  const { id, date, status, totalPrice, items, priority } = order;
  const statusInfo = getStatusById(status);
  const orderDate = new Date(date);
  const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const statusColors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    zinc: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }} className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm hover:border-white/20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-black text-white">Order #{id}</h3>
            {priority && (
              <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full border border-orange-500/30">
                <Zap className="w-3 h-3" /> Priority
              </span>
            )}
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusColors[statusInfo.color] || 'bg-gray-500/20 text-gray-400'}`}>
              <span className="text-sm">{statusInfo.emoji}</span> {statusInfo.label}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-3">{formattedDate} at {formattedTime}</p>
          <div className="flex flex-wrap gap-2">
            {items.slice(0, 3).map((item, idx) => (
              <span key={idx} className="px-3 py-1 bg-zinc-800/50 text-gray-300 text-sm rounded-full border border-white/5">
                {item.quantity}× {item.name}
              </span>
            ))}
            {items.length > 3 && <span className="px-3 py-1 bg-zinc-800/50 text-gray-400 text-sm rounded-full border border-white/5">+{items.length - 3} more</span>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-2xl font-black text-red-500">{formatCurrency(totalPrice)}</p>
          <Link to={`/order/${id}`}>
            <Button variant="secondary" size="sm" className="!bg-zinc-800 !border-white/10 !text-white hover:!bg-zinc-700 flex items-center gap-2">
              View <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderHistory;
