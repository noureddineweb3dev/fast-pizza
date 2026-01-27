import { Link } from 'react-router-dom';
import { Facebook, Instagram, X, Youtube, Sword, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="relative bg-black text-gray-400 border-t border-white/10 overflow-hidden snap-start">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20" />

      {/* Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[128px] pointer-events-none" />

      <Container className="relative z-10 pt-20 pb-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <Sword className="w-6 h-6 text-red-600" />
              SAMURAI<span className="text-red-600">PIZZA</span>
            </h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Ancient traditions meets modern speed. The sharpest flavors, delivered with honor.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" label="Facebook"><Facebook className="w-5 h-5" /></SocialIcon>
              <SocialIcon href="#" label="Instagram"><Instagram className="w-5 h-5" /></SocialIcon>
              <SocialIcon href="#" label="X"><X className="w-5 h-5" /></SocialIcon>
              <SocialIcon href="#" label="Youtube"><Youtube className="w-5 h-5" /></SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Navigation</h4>
            <ul className="space-y-4 text-sm">
              <FooterLink to="/">Home Base</FooterLink>
              <FooterLink to="/menu">Full Menu</FooterLink>
              <FooterLink to="/order/history">Order History</FooterLink>
              <FooterLink to="/about">Our Story</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Contact Base</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                <span>123 Dojo Street, <br />Kyoto District, NY 10012</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <span>+1 (800) SAMURAI</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                <span>sensei@samuraipizza.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Join the Clan</h4>
            <p className="text-xs mb-4">Get exclusive offers and secret menu updates.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-red-600 transition-colors"
              />
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600">
          <p>© {new Date().getFullYear()} SAMURAI PIZZA. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="hover:text-red-500 hover:pl-2 transition-all duration-300 flex items-center gap-1">
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, children, label }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ y: -4, color: '#DC2626' }}
      className="bg-white/5 p-2 rounded-full border border-white/5 hover:border-red-600/50 transition-colors"
    >
      {children}
    </motion.a>
  );
}
