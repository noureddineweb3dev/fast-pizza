import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { decreaseItemQuantity, increaseItemQuantity, deleteItem } from '../../store/cartSlice';

function CartItem({ item, index }) {
  const dispatch = useDispatch();
  const { pizzaId, name, quantity, totalPrice, unitPrice, image } = item;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-colors"
    >
      {/* Image */}
      <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-zinc-800">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">🍕</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-lg truncate">{name}</h3>
        <p className="text-gray-400 text-sm">
          {quantity} × {formatCurrency(unitPrice || totalPrice / quantity)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1 bg-zinc-800/50 rounded-xl border border-white/10 overflow-hidden">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(decreaseItemQuantity(pizzaId))}
          className="px-3 py-2 text-red-400 hover:bg-red-600/20 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        <span className="text-white font-bold w-8 text-center">{quantity}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(increaseItemQuantity(pizzaId))}
          className="px-3 py-2 text-green-400 hover:bg-green-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <p className="text-lg font-black text-red-500">{formatCurrency(totalPrice)}</p>
      </div>

      {/* Delete */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(deleteItem(pizzaId))}
        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-600/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}

export default CartItem;
