import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

function RatingStars({ rating = 0, onRate, size = 'md', showValue = false, interactive = true }) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const sizeClass = sizes[size] || sizes.md;
  const isInteractive = interactive && onRate;

  const handleClick = (value) => {
    if (isInteractive) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);

        return (
          <motion.button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => isInteractive && setHoverRating(star)}
            onMouseLeave={() => isInteractive && setHoverRating(0)}
            className={`${isInteractive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
            whileHover={isInteractive ? { scale: 1.2 } : {}}
            whileTap={isInteractive ? { scale: 0.9 } : {}}
            disabled={!isInteractive}
          >
            <Star
              className={`${sizeClass} transition-colors ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'
                }`}
            />
          </motion.button>
        );
      })}

      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-400">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

export default RatingStars;
