import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import Container from './Container';
import Button from '../ui/Button';
import PizzaLogo from '../ui/PizzaLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { getTotalCartQuantity } from '../store/cartSlice';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCartQuantity = useSelector(getTotalCartQuantity);

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Menu', to: '/menu' },
    { name: 'Order', to: '/order' },
  ];

  return (
    <nav className="bg-sp-black shadow-md sticky top-0 z-50">
      <Container className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <PizzaLogo />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-sp-white text-xl hover:text-sp-gold font-medium transition-colors"
            >
              {link.name}
            </NavLink>
          ))}
          <Link to="/cart">
            <Button variant="primary" className="relative">
              <ShoppingCart className="w-6 h-6 mr-2" />
              Cart
              {totalCartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-sp-gold text-sp-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalCartQuantity}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            className="border border-sp-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-sp-black shadow-md"
          >
            <Container className="flex flex-col py-4 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-sp-white hover:text-sp-gold font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}

              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="relative w-full">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {totalCartQuantity > 0 && (
                    <span className="ml-2 bg-sp-gold text-sp-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {totalCartQuantity}
                    </span>
                  )}
                </Button>
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Header;
