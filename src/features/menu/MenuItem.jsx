import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Users, Flame, Leaf, Award } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import RatingStars from '../../ui/RatingStars';
import RatingDialog from '../../ui/RatingDialog';
import { addItem, getCurrentQuantityById, increaseItemQuantity, decreaseItemQuantity } from '../../store/cartSlice';
import { toggleFavoriteAsync, isFavorite } from '../../store/favoritesSlice';
import { getPizzaRating } from '../../store/ratingSlice';
import { getPizzaAverageRating, getPizzaRatingCount } from '../../store/globalRatingsSlice';

function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  const { id, name, ingredients, image, unitPrice, soldOut, available, spicy, vegetarian, bestseller } = pizza;

  // Item is unavailable if soldOut OR available is false
  const isUnavailable = soldOut || available === false;

  const [showRatingDialog, setShowRatingDialog] = useState(false);

  // Get current quantity of this pizza in cart
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = currentQuantity > 0;

  // Check if pizza is favorited
  const isFavorited = useSelector(isFavorite(id));

  // Get user's rating for this pizza
  const userRating = useSelector(getPizzaRating(id));

  // Get global average rating and count
  const averageRating = useSelector(getPizzaAverageRating(id));
  const ratingCount = useSelector(getPizzaRatingCount(id));

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
      image, // useful for cart UI
    };

    dispatch(addItem(newItem));
    toast.success(`${name} added to cart`, { id: name });
  }

  function handleIncreaseQuantity() {
    dispatch(increaseItemQuantity(id));
  }

  function handleDecreaseQuantity() {
    dispatch(decreaseItemQuantity(id));
  }

  function handleToggleFavorite(e) {
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(pizza));
    // Toast is handled in slice or we can keep it here if we want custom message, 
    // but the slice might handle errors. The slice doesn't explicitly toast success for add/remove in the thunk (except error).
    // So we can keep toast here for optimistic UI or feedback.
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites', {
      id: `fav-${id}`,
    });
  }

  function handleOpenRating(e) {
    e.stopPropagation();
    setShowRatingDialog(true);
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover="hover"
        variants={{
          hover: { y: -8 },
        }}
        transition={{ type: 'spring', duration: 0.4 }}
        className={`relative group h-full flex flex-col overflow-hidden rounded-[2rem] bg-zinc-900/50 border border-white/5 shadow-xl backdrop-blur-sm ${isUnavailable ? 'grayscale opacity-70' : ''
          }`}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            variants={{
              hover: { scale: 1.1 },
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {soldOut && (
              <span className="self-start rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                Sold Out
              </span>
            )}

            {!soldOut && bestseller && (
              <span className="self-start flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg">
                <Award className="w-3 h-3" />
                Bestseller
              </span>
            )}

            {!soldOut && spicy && (
              <span className="self-start flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                <Flame className="w-3 h-3" />
                Spicy
              </span>
            )}

            {!soldOut && vegetarian && (
              <span className="self-start flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
                <Leaf className="w-3 h-3" />
                Veg
              </span>
            )}
          </div>

          {/* Action Buttons (Top Right) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all ${isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleOpenRating}
              className={`p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all ${userRating
                ? 'bg-yellow-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              <Star className={`w-4 h-4 ${userRating ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 flex flex-col relative z-10">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-xl font-black text-white leading-tight">{name}</h3>
            <span className="shrink-0 text-lg font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-lg">
              {formatCurrency(unitPrice)}
            </span>
          </div>

          {/* Ratings */}
          {ratingCount > 0 ? (
            <div className="flex items-center gap-2 mb-3">
              <RatingStars rating={averageRating} size="xs" interactive={false} />
              <span className="text-xs text-gray-400">({ratingCount})</span>
            </div>
          ) : (
            <div className="mb-3 text-xs text-gray-500 italic">No ratings yet</div>
          )}

          {/* Ingredients */}
          <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-2 italic">
            {ingredients.join(', ')}
          </p>

          <div className="mt-auto">
            <div className="flex items-center justify-between gap-4">
              {isInCart ? (
                <div className="flex items-center justify-between w-full bg-zinc-800/50 rounded-xl border border-white/10 overflow-hidden">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecreaseQuantity}
                    className="px-4 py-3 text-red-400 hover:bg-red-600/20 transition-colors font-bold text-lg"
                  >
                    −
                  </motion.button>
                  <span className="text-white font-black text-lg">{currentQuantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleIncreaseQuantity}
                    className="px-4 py-3 text-green-400 hover:bg-green-600/20 transition-colors font-bold text-lg"
                  >
                    +
                  </motion.button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  disabled={isUnavailable}
                  className="w-full !rounded-xl !py-3 !text-sm shadow-red-900/20"
                >
                  {isUnavailable ? 'Out of Stock' : 'Add to Order'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <RatingDialog
        isOpen={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        pizza={pizza}
      />
    </>
  );
}

export default MenuItem;
