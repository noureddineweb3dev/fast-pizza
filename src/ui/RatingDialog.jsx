import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import RatingStars from './RatingStars';
import Button from './Button';
import { addRating, getPizzaRating } from '../store/ratingSlice';
import { submitGlobalRating } from '../store/globalRatingsSlice';

function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
}

function RatingDialog({ isOpen, onClose, pizza }) {
  const dispatch = useDispatch();
  const existingRating = useSelector(getPizzaRating(pizza?.id));

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setReview(existingRating.review || '');
    } else {
      setRating(0);
      setReview('');
    }
  }, [existingRating, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating', { id: 'rating' });
      return;
    }

    const userId = getUserId();

    dispatch(addRating({ pizzaId: pizza.id, rating, review }));
    dispatch(submitGlobalRating({ pizzaId: pizza.id, rating, review, userId }));

    toast.success(existingRating ? 'Rating updated!' : 'Rating submitted!', { id: 'rating' });
    onClose();
  };

  if (!pizza) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header with Image */}
              <div className="relative h-48">
                <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black text-white">{pizza.name}</h3>
                  {existingRating && (
                    <span className="inline-flex items-center gap-1 text-yellow-400 text-sm mt-1">
                      <Star className="w-4 h-4 fill-current" />
                      Editing your rating
                    </span>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-300">
                    Your Rating
                  </label>
                  <RatingStars rating={rating} onRate={setRating} size="xl" showValue />
                </div>

                {/* Review */}
                <div className="space-y-2">
                  <label htmlFor="review" className="block text-sm font-bold text-gray-300">
                    Review (Optional)
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 text-right">{review.length}/200</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1 !bg-zinc-800 !border-white/10 !text-white hover:!bg-zinc-700"
                  >
                    Cancel
                  </Button>

                  <Button type="submit" variant="primary" className="flex-1">
                    {existingRating ? 'Update' : 'Submit'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RatingDialog;
