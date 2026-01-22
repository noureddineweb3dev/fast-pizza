import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

function PizzaLogo({ className = 'w-60 h-24' }) {
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ICON */}
      <div className="relative">
        <div className="absolute inset-0 bg-red-600 blur-lg opacity-50 rounded-full animate-pulse" />
        <Sword className="w-8 h-8 text-red-600 relative z-10 transform -rotate-45" />
      </div>

      {/* WORDMARK */}
      <div className="leading-none flex flex-col">
        <span className="text-xl font-black tracking-tighter text-white">SAMURAI</span>
        <span className="text-xs font-bold tracking-[0.2em] text-red-600 uppercase">PIZZA</span>
      </div>
    </motion.div>
  );
}

export default PizzaLogo;
