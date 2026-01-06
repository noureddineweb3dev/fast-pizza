import { motion } from 'framer-motion';

function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
}) {
  // Base styles
  const baseStyles =
    'inline-flex items-center cursor-pointer justify-center rounded-lg font-semibold transition duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  // Size variants
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Color variants
  const variants = {
    primary:
      'bg-red-700 hover:bg-red-800 text-white focus:ring-red-500 focus:ring-2 focus:ring-offset-2',
    secondary:
      'bg-white border border-gray-300 text-sp-black hover:bg-gray-100 focus:ring-gray-400 focus:ring-2',
    ghost: 'bg-transparent text-sp-red hover:bg-sp-red/10',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
