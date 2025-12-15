import { motion } from 'motion/react';

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
    'inline-flex items-center justify-center rounded-lg font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Size variants
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Color variants
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-red-600 focus:ring-red-500',
    secondary:
      'bg-white border border-gray-300 text-[var(--color-text)] hover:bg-gray-100 focus:ring-gray-400',
    ghost:
      'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 focus:ring-[var(--color-primary)]/50',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}
export default Button;
