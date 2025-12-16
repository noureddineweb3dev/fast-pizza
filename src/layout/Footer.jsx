import { Link } from 'react-router-dom';
import { Facebook, Instagram, X, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import Container from './Container';

function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-gray-300">
      <Container className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-white">SAMURAI PIZZA</h3>
            <p className="mt-2 text-sm text-gray-400">
              Freshly baked pizzas delivered fast and hot.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 font-semibold text-white">Links</h4>
            <ul className="flex space-x-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 font-semibold text-white">Follow</h4>
            <div className="flex space-x-5">
              <SocialIcon href="#" label="Facebook">
                <Facebook className="h-5 w-5" />
              </SocialIcon>

              <SocialIcon href="#" label="Instagram">
                <Instagram className="h-5 w-5" />
              </SocialIcon>

              <SocialIcon href="#" label="X">
                <X className="h-5 w-5" />
              </SocialIcon>
              <SocialIcon href="#" label="Youtube">
                <Youtube className="h-5 w-5" />
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SAMURAI PIZZA. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

function SocialIcon({ href, children, label }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{
        y: -3,
        scale: 1.15,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="text-gray-400 hover:text-white"
    >
      {children}
    </motion.a>
  );
}

export default Footer;
