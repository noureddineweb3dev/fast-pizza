import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart, getTotalCartPrice, getTotalCartQuantity } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';

function CartPopup({ isOpen, onClose }) {
  const cart = useSelector(getCart);
  const totalPrice = useSelector(getTotalCartPrice);
  const totalQuantity = useSelector(getTotalCartQuantity);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          {/* Popup Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-zinc-900 border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-xl border border-red-500/30">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Your Cart</h2>
                  <p className="text-sm text-gray-400">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                    <ShoppingBag className="w-10 h-10 text-red-500" />
                  </div>
                  <p className="text-white font-bold mb-1">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add some delicious items!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <motion.li
                      key={item.pizzaId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4 p-3 bg-zinc-800/50 rounded-xl border border-white/5"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{item.name}</h3>
                        <p className="text-sm text-gray-400">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="font-bold text-red-500">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4 bg-black/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-black text-red-500">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="space-y-2">
                  <Link to="/cart" onClick={onClose} className="block">
                    <Button variant="secondary" className="w-full !bg-zinc-800 !border-white/10 !text-white hover:!bg-zinc-700">
                      View Full Cart
                    </Button>
                  </Link>

                  <Link to="/order/new" onClick={onClose} className="block">
                    <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                      Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartPopup;
