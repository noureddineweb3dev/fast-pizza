import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import RatingStars from '../../ui/RatingStars';
import RatingDialog from '../../ui/RatingDialog';
import { addItem, getCurrentQuantityById } from '../../store/cartSlice';
import { toggleFavorite, isFavorite } from '../../store/favoritesSlice';
import { getPizzaRating } from '../../store/ratingSlice';
import { getPizzaAverageRating, getPizzaRatingCount } from '../../store/globalRatingsSlice';

function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  const { id, name, ingredients, image, unitPrice, soldOut } = pizza;

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
    };

    dispatch(addItem(newItem));
    toast.success(`${name} added to cart`, { id: name });
  }

  function handleToggleFavorite(e) {
    e.stopPropagation();
    dispatch(toggleFavorite(pizza));
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
        whileHover="hover"
        initial="rest"
        animate="rest"
        variants={{
          rest: { y: 0 },
          hover: { y: -6 },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`relative aspect-4/5 overflow-hidden rounded-xl shadow-md hover:shadow-2xl ${
          soldOut ? 'opacity-70 grayscale' : ''
        }`}
      >
        {/* Background Image */}
        <motion.img
          src={image}
          alt={name}
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 },
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {/* Price Badge */}
          <div className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-black shadow">
            {formatCurrency(unitPrice)}
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full shadow transition-colors ${
              isFavorited ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-red-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Rating Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpenRating}
            className={`p-2 rounded-full shadow transition-colors ${
              userRating
                ? 'bg-yellow-400 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-yellow-100'
            }`}
          >
            <Star className={`w-5 h-5 ${userRating ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Sold Out Badge */}
        {soldOut && (
          <div className="absolute top-3 left-3 z-20 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow">
            SOLD OUT
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
          {/* Top */}
          <div>
            <h3 className="text-xl font-bold">{name}</h3>

            {/* Average Rating Display (Always visible if rated) */}
            {ratingCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2"
              >
                <RatingStars rating={averageRating} size="sm" interactive={false} />
                <span className="text-xs text-white/90 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
                </span>
              </motion.div>
            )}

            {/* User's Personal Rating (Show if different from average) */}
            {userRating && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-yellow-300"
              >
                Your rating: {userRating.rating.toFixed(1)} ⭐
              </motion.div>
            )}

            {/* Ingredients */}
            <motion.p
              variants={{
                rest: { opacity: 0, y: 10 },
                hover: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25 }}
              className="mt-2 text-sm text-gray-200"
            >
              {ingredients.join(', ')}
            </motion.p>
          </div>

          {/* Bottom */}
          <div className="flex justify-between items-center">
            {/* Show quantity if in cart */}
            {isInCart && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentQuantity} in cart
              </span>
            )}

            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={soldOut}
              className="ml-auto"
            >
              {soldOut ? 'Sold Out' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Rating Dialog */}
      <RatingDialog
        isOpen={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        pizza={pizza}
      />
    </>
  );
}

export default MenuItem;
