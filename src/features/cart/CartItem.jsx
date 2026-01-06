import { useDispatch } from 'react-redux';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { decreaseItemQuantity, increaseItemQuantity, deleteItem } from '../../store/cartSlice';
import Button from '../../ui/Button';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="py-4 flex items-center justify-between gap-4">
      {/* Pizza info */}
      <div className="flex-1">
        <p className="font-semibold text-sp-black">{name}</p>
        <p className="text-sm text-gray-500">
          {formatCurrency(totalPrice)} ({quantity} × {formatCurrency(totalPrice / quantity)})
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-3">
        {/* Decrease quantity */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => dispatch(decreaseItemQuantity(pizzaId))}
          className="!p-2"
        >
          <Minus className="w-4 h-4" />
        </Button>

        {/* Current quantity */}
        <span className="font-semibold text-sp-black w-8 text-center">{quantity}</span>

        {/* Increase quantity */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => dispatch(increaseItemQuantity(pizzaId))}
          className="!p-2"
        >
          <Plus className="w-4 h-4" />
        </Button>

        {/* Delete item */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(deleteItem(pizzaId))}
          className="!p-2 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </li>
  );
}

export default CartItem;
