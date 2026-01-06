import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../../ui/Button';

function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Icon */}
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
      </div>

      {/* Message */}
      <h2 className="text-3xl font-bold text-sp-black mb-3">Your cart is empty</h2>

      <p className="text-gray-600 mb-8 max-w-md">
        Looks like the Pizza Samurai hasn't collected any slices yet. Time to explore our menu!
      </p>

      {/* Action button */}
      <Link to="/menu">
        <Button variant="primary" size="lg">
          Browse Menu
        </Button>
      </Link>
    </div>
  );
}

export default EmptyCart;
