import { formatCurrency } from '../../utils/helpers';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';

function MenuItem({ pizza }) {
  const { name, ingredients, imageUrl, unitPrice, soldOut } = pizza;
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      variants={{
        rest: { y: 0 },
        hover: { y: -6 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative aspect-4/5 overflow-hidden rounded-xl shadow-md hover:shadow-2xl"
    >
      {/* Background Image */}
      <motion.img
        src={imageUrl}
        alt={name}
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.05 },
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
        {/* Top */}
        <div>
          <h3 className="text-xl font-bold">{name}</h3>

          {/* Ingredients (hover only) */}
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
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{formatCurrency(unitPrice.toFixed(2))}</span>

          <Button variant="primary">Add to Cart</Button>
        </div>
      </div>
    </motion.div>
  );
}
export default MenuItem;
