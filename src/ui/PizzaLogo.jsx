import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

function PizzaLogo({ className = 'w-60 h-24' }) {
  return (
    <motion.div
      className={`flex items-center gap-2 group cursor-pointer ${className}`}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* ICON */}
      <div className="relative">
        <motion.div
          variants={{
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 0.5, scale: 1, transition: { duration: 1 } },
            hover: { opacity: 0.8, scale: 1.2, filter: 'blur(20px)' }
          }}
          className="absolute inset-0 bg-red-600 blur-lg rounded-full"
        />
        <motion.div
          variants={{
            initial: { x: -50, rotate: -135, opacity: 0 },
            animate: { x: 0, rotate: -45, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
            hover: { rotate: 0, scale: 1.1, filter: 'drop-shadow(0 0 8px rgba(220,38,38,0.8))' }
          }}
        >
          <Sword className="w-10 h-10 text-white fill-red-600 relative z-10" />
        </motion.div>
      </div>

      {/* WORDMARK */}
      <div className="leading-none flex flex-col">
        <motion.span
          variants={{
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0, transition: { delay: 0.3 } }
          }}
          className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-sm"
        >
          SAMURAI
        </motion.span>
        <motion.span
          variants={{
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0, transition: { delay: 0.4 } }
          }}
          className="text-xs font-bold tracking-[0.3em] text-red-600 uppercase group-hover:tracking-[0.5em] transition-all duration-300"
        >
          PIZZA
        </motion.span>
      </div>
    </motion.div>
  );
}

export default PizzaLogo;
