import { useEffect } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, Clock, Zap, CheckCircle, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { getOrder } from '../../services/apiRestaurant';
import { clearCart } from '../../store/cartSlice';
import { addOrderToHistory } from '../../store/orderHistorySlice';
import { addOrderToAdmin } from '../../store/adminSlice';
import { formatCurrency } from '../../utils/helpers';
import { getStatusById } from '../../utils/orderStatuses';
import Container from '../../layout/Container';
import Button from '../../ui/Button';
import { getIsAuthenticated } from '../../store/userSlice';

function Order() {
  const order = useLoaderData();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(getIsAuthenticated);

  const { id, status, priority, priorityPrice, orderPrice, estimatedDelivery, cart, customer, customer_id } = order;
  const statusInfo = getStatusById(status);

  useEffect(() => {
    dispatch(clearCart());
    const historyPayload = {
      id,
      customer: customer || 'Guest',
      status,
      totalPrice: orderPrice + priorityPrice,
      items: cart,
      priority,
      estimatedDelivery,
      createdAt: order.createdAt // Ensure actual date is passed
    };
    dispatch(addOrderToHistory(historyPayload));
    dispatch(addOrderToAdmin({ ...historyPayload, createdAt: order.createdAt || new Date().toISOString() }));
  }, [dispatch, id, status, orderPrice, priorityPrice, cart, priority, estimatedDelivery, customer, order.createdAt]);

  const isPreparing = status === 'preparing';

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-12 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15),transparent_60%)]" />
        <Container className="relative z-10 py-16 md:py-20">
          <Link to="/menu" className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-semibold transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" /> Back to menu
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600/20 rounded-2xl border border-green-500/30">
                <span className="text-3xl">{statusInfo.emoji}</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">{statusInfo.label}</h1>
                <p className="text-gray-400 mt-1">Order #{id}</p>
              </div>
            </div>
            <span className={`px-5 py-2 rounded-full text-sm font-black uppercase tracking-wider ${statusInfo.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              statusInfo.color === 'orange' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                statusInfo.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  statusInfo.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    statusInfo.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      statusInfo.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        statusInfo.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
              }`}>
              {statusInfo.category}
            </span>
          </motion.div>
        </Container>
      </section>

      {!isAuthenticated && !customer_id && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-900/50 p-6 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(234,179,8,0.1),transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Track this order forever!</h3>
                <p className="text-gray-400 text-sm">Create an account to save this order to your history and get exclusive rewards.</p>
              </div>
            </div>
            <Link to="/signup" className="w-full md:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20">
              Create Account
            </Link>
          </div>
        </motion.div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-red-600/20 rounded-xl border border-red-500/30">
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Estimated Delivery</p>
                <p className="text-xl font-black text-white">
                  {new Date(estimatedDelivery).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
            {priority && (
              <div className="flex items-center gap-2 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-orange-400 font-bold">Priority Delivery Enabled</span>
              </div>
            )}
          </motion.div>

          {/* Order Items */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" /> Your Order
            </h2>
            <ul className="space-y-3">
              {cart.map((item) => (
                <li key={item.pizzaId} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                  <span className="text-white font-semibold">{item.quantity}× {item.name}</span>
                  <span className="text-gray-400 font-bold">{formatCurrency(item.totalPrice)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right: Price Summary */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sticky top-32 bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-500" /> Payment Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>Order Price</span>
                <span className="text-white">{formatCurrency(orderPrice)}</span>
              </div>
              {priority && (
                <div className="flex justify-between text-orange-400">
                  <span>Priority Fee</span>
                  <span>{formatCurrency(priorityPrice)}</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-lg font-bold text-white">Total Paid</span>
                <span className="text-2xl font-black text-green-500">{formatCurrency(orderPrice + priorityPrice)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-900/20 rounded-xl border border-green-500/20 text-center">
              <p className="text-green-400 font-bold">Thank you for your order!</p>
              <p className="text-gray-400 text-sm mt-1">Your samurai is preparing your feast.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  if (!order) throw new Response('Order not found', { status: 404 });
  return order;
}

export default Order;
