import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Flame, Leaf, Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getFavorites, getFavoritesStatus, clearFavoritesAsync, toggleFavoriteAsync, fetchUserFavorites } from '../../store/favoritesSlice';
import { addItem, getCurrentQuantityById, increaseItemQuantity, decreaseItemQuantity } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import ConfirmDialog from '../../ui/ConfirmDialog';
import Container from '../../layout/Container';

function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector(getFavorites);
  const status = useSelector(getFavoritesStatus);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserFavorites());
  }, [dispatch]);

  const handleClearFavorites = () => {
    dispatch(clearFavoritesAsync());
    toast.success('All favorites cleared', { id: 'clear-favorites' });
    setShowConfirm(false);
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading favorites...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5"
        >
          <Heart className="w-16 h-16 text-zinc-700" />
        </motion.div>

        <h2 className="text-4xl font-black text-white mb-4">No Favorites Yet</h2>

        <p className="text-gray-400 mb-8 max-w-md text-lg">
          Heart the items you love to save them here for quick access later.
        </p>

        <Link to="/menu">
          <Button variant="primary" size="lg" className="!rounded-2xl !px-8 !py-4">
            Browse Menu <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 mb-12 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(220,38,38,0.1),transparent_50%)]" />
        <Container className="relative z-10 py-16 md:py-24">
          <div className="flex items-center justify-between flex-wrap gap-8">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 mb-4"
              >
                <div className="p-3 bg-red-600/10 rounded-2xl border border-red-500/20 text-red-500">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">Your Favorites</h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 text-lg"
              >
                You have saved {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 !rounded-xl !px-6 !py-3"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Favorites Grid */}
      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {favorites.map((pizza, index) => (
            <FavoriteCard
              key={pizza.id}
              pizza={pizza}
              index={index}
              dispatch={dispatch}
            />
          ))}
        </AnimatePresence>
      </motion.ul>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleClearFavorites}
        title="Clear all favorites?"
        message="This will remove all items from your favorites list. This action cannot be undone."
        confirmText="Yes, clear all"
        cancelText="Keep favorites"
        variant="danger"
      />
    </>
  );
}

// FAVORITE CARD COMPONENT
function FavoriteCard({ pizza, index, dispatch }) {
  const { id, name, ingredients, image, unitPrice, spicy, vegetarian, bestseller, soldOut } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = currentQuantity > 0;

  const handleAddToCart = () => {
    dispatch(addItem({
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
      image,
    }));
    toast.success(`${name} added to cart`, { id: name });
  };

  const handleRemove = () => {
    dispatch(toggleFavoriteAsync(pizza));
    // Toast is handled in slice or we can add specific toast here
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group h-full flex flex-col overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-white/10 transition-colors shadow-lg hover:shadow-xl ${soldOut ? 'grayscale opacity-70' : ''
        }`}
    >
      {/* Image */}
      <div className="relative aspect-[5/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {bestseller && (
            <span className="flex items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
              <Award className="w-3 h-3" /> B
            </span>
          )}
          {spicy && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              <Flame className="w-3 h-3" /> Hot
            </span>
          )}
        </div>

        {/* Remove Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRemove}
          className="absolute top-4 right-4 z-20 p-2.5 bg-zinc-900/80 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col relative">
        {/* Price Tag */}
        <div className="absolute -top-6 right-6 px-4 py-2 bg-zinc-800 text-white font-black text-lg rounded-2xl border border-white/10 shadow-xl">
          {formatCurrency(unitPrice)}
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-black text-white leading-tight mb-2">{name}</h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
            {ingredients?.join(', ')}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5">
          {isInCart ? (
            <div className="flex items-center justify-between w-full bg-zinc-950 rounded-xl border border-white/10 overflow-hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(decreaseItemQuantity(id))}
                className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/5 transition-colors font-bold text-lg"
              >
                −
              </motion.button>
              <span className="text-white font-black text-lg">{currentQuantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(increaseItemQuantity(id))}
                className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/5 transition-colors font-bold text-lg"
              >
                +
              </motion.button>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={soldOut}
              className="w-full !rounded-xl !py-3 !text-sm flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {soldOut ? 'Sold Out' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export default Favorites;
