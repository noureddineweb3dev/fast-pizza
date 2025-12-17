import { motion } from 'framer-motion';
function PizzaLogo({ className = 'w-60 h-24' }) {
  return (
    <motion.div
      className={`flex items-center  ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* ICON */}
      <motion.img
        viewBox="0 0 120 120"
        className="w-40 h-20"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        src="/public/samuraipizza.png"
        alt="Samurai Pizza Logo"
      ></motion.img>

      {/* WORDMARK */}
      <div className="leading-none">
        <div className="text-2xl font-black tracking-wide text-(--sp-gold)">SAMURAI</div>
        <div className="text-2xl font-black tracking-wide text-red-700 text-center">PIZZA</div>
      </div>
    </motion.div>
  );
}
export default PizzaLogo;
