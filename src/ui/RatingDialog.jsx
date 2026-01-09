import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import RatingStars from './RatingStars';
import Button from './Button';
import { addRating, getPizzaRating } from '../store/ratingSlice';
import { submitGlobalRating } from '../store/globalRatingsSlice';

// Generate a simple user ID
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

  // Load existing rating when dialog opens
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

    // Save to personal ratings
    dispatch(
      addRating({
        pizzaId: pizza.id,
        rating,
        review,
      })
    );

    // Submit to global ratings system
    dispatch(
      submitGlobalRating({
        pizzaId: pizza.id,
        rating,
        review,
        userId,
      })
    );

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
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header with Image */}
              <div className="relative h-48">
                <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>

                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {pizza.name}
                </h3>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Rating {existingRating && '(Editing)'}
                  </label>
                  <RatingStars rating={rating} onRate={setRating} size="xl" showValue />
                </div>

                {/* Review */}
                <div className="space-y-2">
                  <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                    Review (Optional)
                  </label>
                  <textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your thoughts about this pizza..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 text-right">{review.length}/200 characters</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>

                  <Button type="submit" variant="primary" className="flex-1">
                    {existingRating ? 'Update Rating' : 'Submit Rating'}
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
