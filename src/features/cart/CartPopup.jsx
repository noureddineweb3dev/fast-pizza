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
          {/* Backdrop/Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Popup Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-sp-black">Your Cart</h2>
                <p className="text-sm text-gray-600">
                  {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Close cart"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mt-2">Add some delicious pizzas!</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.pizzaId} className="flex gap-4 pb-4 border-b border-gray-100">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sp-black">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="font-bold text-sp-black">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer with Total and Actions */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold text-sp-black">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link to="/cart" onClick={onClose} className="block">
                    <Button variant="secondary" className="w-full">
                      View Full Cart
                    </Button>
                  </Link>

                  <Link to="/order/new" onClick={onClose} className="block">
                    <Button variant="primary" className="w-full">
                      Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
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
