import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCart, getCart } from '../../store/cartSlice';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import Button from '../../ui/Button';
import { ArrowLeft, Trash2 } from 'lucide-react';

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(getCart);

  // Show empty cart if no items
  if (cart.length === 0) return <EmptyCart />;

  function handleClearCart() {
    dispatch(clearCart());
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/menu"
          className="flex items-center gap-2 text-red-700 hover:text-red-800 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to menu
        </Link>

        <h1 className="text-3xl font-bold text-sp-black">Your Cart 🛒</h1>

        <Button variant="ghost" onClick={handleClearCart} className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Clear cart
        </Button>
      </div>

      {/* Cart Items */}
      <ul className="divide-y divide-gray-200 border-b border-gray-200 mb-8">
        {cart.map((item) => (
          <CartItem item={item} key={item.pizzaId} />
        ))}
      </ul>

      {/* Actions */}
      <div className="flex justify-end">
        <Link to="/order/new">
          <Button variant="primary" size="lg">
            Order pizzas
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Cart;
