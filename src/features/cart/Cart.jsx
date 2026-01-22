import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clearCart, getCart, getTotalCartQuantity, getTotalCartPrice } from '../../store/cartSlice';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';
import Container from '../../layout/Container';
import { ArrowLeft, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(getCart);
  const totalQuantity = useSelector(getTotalCartQuantity);
  const totalPrice = useSelector(getTotalCartPrice);
  const [showConfirm, setShowConfirm] = useState(false);

  if (cart.length === 0) return <EmptyCart />;

  function handleClearCart() {
    dispatch(clearCart());
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-12 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(220,38,38,0.15),transparent_50%)]" />
        <Container className="relative z-10 py-16 md:py-20">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to menu
              </Link>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-red-600/20 rounded-2xl border border-red-500/30">
                  <ShoppingBag className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white">Your Cart</h1>
                  <p className="text-gray-400 mt-1">{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</p>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-600/10"
              >
                <Trash2 className="w-4 h-4" />
                Clear cart
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <CartItem item={item} key={item.pizzaId} index={index} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-32 bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm"
          >
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Items ({totalQuantity})</span>
                <span className="text-white font-semibold">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>
                <span className="text-green-400 font-semibold">FREE</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-black text-red-500">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <Link to="/order/new" className="block">
              <Button variant="primary" size="lg" className="w-full !rounded-xl !py-4 text-lg">
                Proceed to Checkout
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClearCart}
        title="Clear your cart?"
        message="This will remove all items from your cart. This action cannot be undone."
        confirmText="Yes, clear cart"
        cancelText="Keep items"
        variant="danger"
      />
    </>
  );
}

export default Cart;
