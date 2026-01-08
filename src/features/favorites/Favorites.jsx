import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getFavorites, clearFavorites, removeFromFavorites } from '../../store/favoritesSlice';
import { addItem } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';

function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector(getFavorites);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
    toast.success('All favorites cleared', { id: 'clear-favorites' });
  };

  const handleAddToCart = (pizza) => {
    const newItem = {
      pizzaId: pizza.id,
      name: pizza.name,
      quantity: 1,
      unitPrice: pizza.unitPrice,
      totalPrice: pizza.unitPrice,
    };

    dispatch(addItem(newItem));
    toast.success(`${pizza.name} added to cart`, { id: pizza.name });
  };

  const handleRemoveFavorite = (pizzaId, pizzaName) => {
    dispatch(removeFromFavorites(pizzaId));
    toast.success(`${pizzaName} removed from favorites`, { id: `remove-${pizzaId}` });
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-16 h-16 text-gray-400" />
        </div>

        <h2 className="text-3xl font-bold text-sp-black mb-3">No Favorites Yet</h2>

        <p className="text-gray-600 mb-8 max-w-md">
          Start adding your favorite pizzas to create your personal collection!
        </p>

        <Link to="/menu">
          <Button variant="primary" size="lg">
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sp-black flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-600 fill-current" />
              Your Favorites
            </h1>
            <p className="text-gray-600 mt-1">{favorites.length} pizzas</p>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </Button>
        </div>

        {/* Favorites Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((pizza, index) => (
            <FavoriteCard
              key={pizza.id}
              pizza={pizza}
              index={index}
              onAddToCart={handleAddToCart}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClearFavorites}
        title="Clear all favorites?"
        message="This will remove all pizzas from your favorites list. This action cannot be undone."
        confirmText="Yes, clear all"
        cancelText="Keep favorites"
        variant="danger"
      />
    </>
  );
}

// FAVORITE CARD COMPONENT

function FavoriteCard({ pizza, index, onAddToCart, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Remove Button */}
        <button
          onClick={() => onRemove(pizza.id, pizza.name)}
          className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-sp-black">{pizza.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {pizza.ingredients?.join(', ') || 'Delicious pizza'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-xl font-bold text-sp-black">{formatCurrency(pizza.unitPrice)}</span>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(pizza)}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default Favorites;
