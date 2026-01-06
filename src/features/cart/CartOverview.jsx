import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getTotalCartQuantity, getTotalCartPrice } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';

function CartOverview() {
  // Get data from Redux store
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);

  // Don't show if cart is empty
  if (totalCartQuantity === 0) return null;

  return (
    <div className="bg-sp-black px-4 py-4 sm:px-6 text-sm text-sp-white uppercase flex items-center justify-between">
      <div className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </div>

      <Link to="/cart">
        <Button variant="primary" size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Open cart
        </Button>
      </Link>
    </div>
  );
}

export default CartOverview;
