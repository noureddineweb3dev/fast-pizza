import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Zap, Flame, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Container from './Container';
import RatingStars from '../ui/RatingStars';
import SamuraiChoice from './SamuraiChoice';
import BrandStory from './BrandStory';
import DailySpecials from './DailySpecials';
import Reviews from './Reviews';
import FAQ from './FAQ';
import JoinTheRanks from './JoinTheRanks';

const EMBERS_DATA = [...Array(15)].map((_, i) => ({
  id: i,
  y: [0, -200 - Math.random() * 300],
  x: [0, (Math.random() - 0.5) * 150],
  duration: 3 + Math.random() * 5,
  delay: Math.random() * 10,
  left: `${Math.random() * 100}% `,
}));

function Home() {
  const { user } = useSelector((state) => state.user);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.title = "Samurai Pizza | Forged in Fire";
    // Enable snap scrolling for home page
    document.documentElement.classList.add('home-scroll-snap');

    return () => {
      document.documentElement.classList.remove('home-scroll-snap');
    };
  }, []);

  const SectionWrapper = ({ children, className = "" }) => (
    <section className="h-screen w-full snap-start flex items-center justify-center p-4">
      <div className={`w-full h-full max-h-[95vh] overflow-y-auto flex flex-col justify-center rounded-[2.5rem] shadow-xl border border-white/5 relative bg-black ${className}`}>
        {children}
      </div>
    </section>
  );

  return (
    <>
      {/* Global Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* ================= HERO ================= */}
      <section className="h-screen w-full snap-start pt-28 pb-4 px-4 flex items-center justify-center">
        <div className="relative w-full h-full overflow-hidden bg-black text-white rounded-[2.5rem] shadow-[0_0_50px_rgba(220,38,38,0.2)] border border-white/10 group flex flex-col justify-center">
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-sp-black to-black" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(153,27,27,0.6),transparent_60%)]" />

          {/* Ember Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {EMBERS_DATA.map((ember) => (
              <motion.div
                key={ember.id}
                animate={{
                  y: ember.y,
                  x: ember.x,
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                }}
                transition={{
                  duration: ember.duration,
                  repeat: Infinity,
                  delay: ember.delay,
                  ease: 'easeOut',
                }}
                className="absolute w-1 h-1 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full blur-[0.5px] shadow-[0_0_15px_rgba(251,146,60,0.9)]"
                style={{
                  left: ember.left,
                  bottom: '-20px',
                }}
              />
            ))}
          </div>

          <Container className="grid md:grid-cols-2 items-center gap-8 md:gap-16 relative z-10 w-full h-full px-6 lg:px-12">
            <div className="flex flex-col justify-center space-y-6 md:space-y-8 text-left h-full py-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 bg-red-600/10 backdrop-blur-2xl px-4 py-1.5 rounded-full border border-red-500/30 shadow-inner shadow-red-500/10 w-fit"
              >
                <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span className="text-[10px] md:text-xs font-black tracking-[0.25em] uppercase text-red-400">
                  FORGED IN FIRE & SPEED
                </span>
              </motion.div>

              <div className="relative">
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="text-6xl md:text-8xl lg:text-[7.5rem] font-black leading-[0.85] tracking-tighter italic select-none"
                >
                  SLICE <br />
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    WITHOUT
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.5, ease: 'circOut' }}
                      className="absolute -right-8 top-1/2 w-[110%] h-3 bg-white/30 -rotate-3 origin-left blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    />
                  </span>{' '}
                  <br />
                  MERCY
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-md text-lg md:text-xl text-gray-400 leading-relaxed font-medium border-l-2 border-red-900/50 pl-6"
              >
                Precision-cut recipes delivered with the unwavering discipline of a master. The
                ultimate pizza mission begins at your command.
              </motion.p>

              {/* Primary actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6"
              >
                <Link
                  to="/menu"
                  className="group relative flex items-center gap-4 bg-red-600 hover:bg-red-700 px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(220,38,38,0.3)]"
                >
                  <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-125" />
                  <span>COMMENCE ORDER</span>
                </Link>


                <Link
                  to={user ? "/order/history" : "/order/track"}
                  className="group flex items-center gap-3 border-2 border-white/10 hover:border-white/30 backdrop-blur-md px-10 py-5 rounded-2xl font-bold transition-all hover:bg-white/5 shadow-xl"
                >
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  <span>{user ? "ORDER HISTORY" : "TRACK MISSION"}</span>
                </Link>
              </motion.div>
            </div>

            {/* Hero Image / Animation */}
            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 15 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 40, damping: 12, delay: 0.2 }}
              className="relative hidden md:flex items-center justify-center h-full"
            >
              <div className="relative w-full max-w-lg lg:max-w-xl aspect-square flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-red-600/30 blur-[120px] rounded-full scale-110 animate-pulse" />

                <motion.img
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  src="/images/pizzas/shogun-inferno.png"
                  alt="Shogun Inferno Pizza"
                  className="relative z-10 w-full drop-shadow-[0_45px_65px_rgba(0,0,0,0.8)] object-contain"
                />

                {/* Floating Floating Badges */}
                <motion.div
                  animate={{ y: [0, -25, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="absolute top-10 right-0 lg:-right-4 bg-gradient-to-br from-gray-900 to-black backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-3xl z-20 flex flex-col items-center"
                >
                  <span className="text-yellow-500 font-black text-2xl">⭐ 5.0</span>
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                    Elite Rating
                  </span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 25, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-20 left-0 lg:-left-8 bg-red-600 p-4 rounded-2xl shadow-2xl z-20"
                >
                  <Flame className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </Container>

          {/* Slash Accent Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ x: '-100%', y: '100%' }}
              animate={{ x: '100%', y: '-100%' }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 1 }}
              className="w-[300%] h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px] rotate-[35deg] absolute top-1/2 left-0 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            />
          </div>
        </div>
      </section>

      {/* ================= SPEED SECTION ================= */}
      <SectionWrapper>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

        <Container className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
              The Samurai Way
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Three principles that define our legendary service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <EnhancedFeature
              icon={<Zap className="w-12 h-12" />}
              title="Lightning Fast"
              text="From oven to door in record time."
              metric="15-30 min"
              delay={0.1}
              accentColor="from-yellow-500 to-orange-500"
            />
            <EnhancedFeature
              icon={<Flame className="w-12 h-12" />}
              title="Perfectly Fired"
              text="High-heat ovens for flawless crust."
              metric="450°C+"
              delay={0.2}
              accentColor="from-red-500 to-pink-500"
            />
            <EnhancedFeature
              icon={<ShoppingBag className="w-12 h-12" />}
              title="Zero Guessing"
              text="Track your order every step."
              metric="Live GPS"
              delay={0.3}
              accentColor="from-blue-500 to-cyan-500"
            />
          </div>
        </Container>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
      </SectionWrapper>

      {/* ================= FEATURED MENU ================= */}
      <SectionWrapper>
        <SamuraiChoice />
      </SectionWrapper>

      {/* ================= BRAND STORY ================= */}
      <SectionWrapper>
        <BrandStory />
      </SectionWrapper>

      {/* ================= DAILY SPECIALS ================= */}
      <SectionWrapper>
        <DailySpecials />
      </SectionWrapper>

      {/* ================= REVIEWS ================= */}
      <SectionWrapper>
        <Reviews />
      </SectionWrapper>

      {/* ================= FAQ ================= */}
      <SectionWrapper>
        <FAQ />
      </SectionWrapper>

      {/* ================= CTA ================= */}
      <SectionWrapper>
        <JoinTheRanks />
      </SectionWrapper>
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

function EnhancedFeature({ icon, title, text, metric, delay, accentColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden">
        {/* Animated gradient accent */}
        <div className={`absolute top - 0 left - 0 right - 0 h - 1 bg - gradient - to - r ${accentColor} transform origin - left scale - x - 0 group - hover: scale - x - 100 transition - transform duration - 500`} />

        {/* Icon with glow */}
        <div className="relative mb-6">
          <div className={`absolute inset - 0 bg - gradient - to - r ${accentColor} opacity - 20 blur - xl rounded - full scale - 150`} />
          <div className={`relative w - 20 h - 20 flex items - center justify - center rounded - xl bg - gradient - to - br ${accentColor} text - white shadow - lg`}>
            {icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-4 leading-relaxed">{text}</p>

        {/* Metric badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
          <div className={`w - 2 h - 2 rounded - full bg - gradient - to - r ${accentColor} animate - pulse`} />
          <span className="text-white font-bold text-sm">{metric}</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}



export default Home;
