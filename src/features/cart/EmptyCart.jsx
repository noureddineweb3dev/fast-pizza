import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import Button from '../../ui/Button';

function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-32 h-32 bg-red-600/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30"
      >
        <ShoppingBag className="w-16 h-16 text-red-500" />
      </motion.div>

      {/* Message */}
      <h2 className="text-3xl font-black text-white mb-3">Your Cart is Empty</h2>

      <p className="text-gray-400 mb-8 max-w-md">
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
