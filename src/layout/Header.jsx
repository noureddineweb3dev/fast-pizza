import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Sword } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './Container';
import Button from '../ui/Button';
import PizzaLogo from '../ui/PizzaLogo';
import CartPopup from '../features/cart/CartPopup';
import { getTotalCartQuantity } from '../store/cartSlice';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Menu', to: '/menu' },
    { name: 'Favorites', to: '/favorites' },
    { name: 'Orders', to: '/order/history' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen
          ? 'bg-black/95 backdrop-blur-md border-b border-red-900/20 py-2'
          : 'bg-gradient-to-b from-black/90 to-transparent py-4'
          }`}
      >
        <Container className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <PizzaLogo className="w-48 h-18" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm font-bold uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-white hover:scale-105'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <div className="h-6 w-px bg-white/10 mx-2" />

            {/* Cart Button */}
            <CartButton totalCartQuantity={totalCartQuantity} onClick={() => setIsCartOpen(true)} />

            <Link to="/admin/login" className="text-xs font-bold text-gray-600 hover:text-red-900 uppercase tracking-widest px-3 py-1 border border-transparent hover:border-red-900/30 rounded-full transition-all">
              Owner
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalCartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black">
                  {totalCartQuantity}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </Container>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl"
            >
              <Container className="flex flex-col py-6 space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-bold transition-all ${isActive
                        ? 'bg-red-600/10 text-red-500 pl-6'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <Sword className="w-5 h-5 fill-current" />}
                        {link.name}
                      </>
                    )}
                  </NavLink>
                ))}
                <div className="h-px bg-white/10 my-4" />
                <Link to="/admin/login" className="px-4 py-3 text-sm font-bold text-gray-600 uppercase tracking-widest text-center">
                  Owner Access
                </Link>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Cart Popup */}
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Header;

function CartButton({ totalCartQuantity, onClick }) {
  const [isBumped, setIsBumped] = useState(false);

  useEffect(() => {
    if (totalCartQuantity === 0) return;
    setIsBumped(true);
    const timer = setTimeout(() => setIsBumped(false), 300);
    return () => clearTimeout(timer);
  }, [totalCartQuantity]);

  return (
    <button
      onClick={onClick}
      className={`group relative p-2 text-gray-300 hover:text-white transition-all duration-300 ${isBumped ? 'scale-125 text-red-500' : ''
        }`}
    >
      <ShoppingCart className={`w-6 h-6 transition-transform group-hover:scale-110 ${isBumped ? 'fill-red-500/20' : ''}`} />
      <AnimatePresence>
        {totalCartQuantity > 0 && (
          <motion.span
            key="cart-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-gradient-to-br from-red-600 to-orange-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-black shadow-[0_0_10px_rgba(220,38,38,0.6)]"
          >
            {totalCartQuantity}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
