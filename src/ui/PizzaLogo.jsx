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
      <motion.svg
        viewBox="0 0 120 120"
        className="w-20 h-20"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        {/* HELMET */}
        <path
          d="M20 70 C20 35 100 35 100 70 L90 95 H30 Z"
          fill="#0f0f0f"
          stroke="#7c2d12"
          strokeWidth="3"
        />

        {/* HELMET CREST (PIZZA SLICE) */}
        <path d="M60 15 L40 50 H80 Z" fill="url(#pizza)" stroke="#f59e0b" strokeWidth="2" />

        {/* PEPPERONI */}
        <circle cx="55" cy="40" r="3" fill="#b91c1c" />
        <circle cx="65" cy="42" r="3" fill="#dc2626" />

        {/* EYES */}
        <rect x="35" y="70" width="20" height="6" rx="3" fill="#991b1b" />
        <rect x="65" y="70" width="20" height="6" rx="3" fill="#991b1b" />

        {/* GRADIENTS */}
        <defs>
          <linearGradient id="pizza" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* WORDMARK */}
      <div className="leading-none">
        <div className="text-2xl font-black tracking-wide text-zinc-900">SAMURAI</div>
        <div className="text-2xl font-black tracking-wide text-red-700 text-center">PIZZA</div>
      </div>
    </motion.div>
  );
}
export default PizzaLogo;
