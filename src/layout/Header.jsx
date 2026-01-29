import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Sword } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './Container';
import Button from '../ui/Button';
import PizzaLogo from '../ui/PizzaLogo';
import CartPopup from '../features/cart/CartPopup';
import { getTotalCartQuantity } from '../store/cartSlice';
import { logout } from '../store/userSlice';
import { switchUserContext } from '../store/ratingSlice';

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

  const { user } = useSelector((state) => state.user);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Menu', to: '/menu' },
    { name: 'Favorites', to: '/favorites' },
    { name: 'Orders', to: user ? '/order/history' : '/order/track' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            width: scrolled ? '90%' : '100%',
            maxWidth: scrolled ? '1200px' : '100%',
            borderRadius: scrolled ? '50px' : '0px',
            y: scrolled ? 10 : 0
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`
            transition-all duration-500
            ${scrolled
              ? 'bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
              : 'bg-transparent'
            }
          `}
        >
          <div className={`px-6 md:px-12 h-20 flex items-center justify-between`}>
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <PizzaLogo className="w-40 h-16" />
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative text-sm font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative z-10 py-2">
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              ))}

              <div className="h-8 w-px bg-white/10 mx-4" />

              {/* Cart Button */}
              <CartButton totalCartQuantity={totalCartQuantity} onClick={() => setIsCartOpen(true)} />

              {/* Auth Controls */}
              <AuthControls />
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
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden rounded-b-[50px]"
              >
                <div className="flex flex-col py-6 px-4 space-y-2">
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Cart Popup */}
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}


function AuthControls() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (user) {
    return (
      <div className="flex items-center gap-3 ml-4">
        <div className="hidden lg:block text-right">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Samurai</p>
          <p className="text-sm text-white font-bold">{user.full_name.split(' ')[0]}</p>
        </div>
        <button
          onClick={() => { dispatch(logout()); dispatch(switchUserContext(null)); }}
          className="text-xs font-bold text-red-500 hover:text-white border border-red-500/30 hover:bg-red-600 hover:border-red-600 px-3 py-1.5 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 ml-4">
      <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
        Login
      </Link>
      <Link to="/signup" className="text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5">
        Join
      </Link>
    </div>
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
