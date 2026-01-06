import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';

function MenuItem({ pizza }) {
  const { name, ingredients, image, price } = pizza;
  function handleAddToCart() {
    toast.success(`${name} added to cart`, { id: name });
  }

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
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
      {/* Price Badge */}
      <div className="absolute top-3 right-3 z-20 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-black shadow">
        {formatCurrency(price.toFixed(2))}
      </div>
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
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
export default MenuItem;
