import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getTotalCartQuantity, getTotalCartPrice } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';

function CartOverview() {
  // Get data from Redux store
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);

  // Don't show if cart is empty
  if (totalCartQuantity === 0) return null;

  return (
    <div className="bg-sp-black border-t border-sp-red/30 px-4 py-4 sm:px-6 text-sm text-sp-white uppercase flex items-center justify-between sticky bottom-0 shadow-lg">
      <div className="space-x-4 font-semibold text-sp-white sm:space-x-6">
        <span>
          {totalCartQuantity} {totalCartQuantity === 1 ? 'pizza' : 'pizzas'}
        </span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </div>

      <Link
        to="/cart"
        className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        Open cart
      </Link>
    </div>
  );
}

export default CartOverview;
