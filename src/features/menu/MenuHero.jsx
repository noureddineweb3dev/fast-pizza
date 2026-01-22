import { motion } from 'framer-motion';
import Container from '../../layout/Container';

function MenuHero() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-12 border border-white/10 shadow-2xl group">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/pizzas/shogun-inferno.png" // Using an existing asset as background for now, styled to be abstract
          alt="Menu Background"
          className="w-full h-full object-cover opacity-20 blur-sm scale-110 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(220,38,38,0.2),transparent_50%)]" />
      </div>

      <Container className="relative z-10 py-20 md:py-24">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-bold tracking-widest text-xs uppercase backdrop-blur-md"
          >
            Authentic Flavors
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-6 tracking-tight"
          >
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">LEGENDARY</span> <br />
            MENU
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 leading-relaxed border-l-2 border-red-600 pl-6"
          >
            Handcrafted with precision, fired to perfection. Explore our selection of samurai-approved pizzas, sides, and more.
          </motion.p>
        </div>
      </Container>
    </section>
  );
}

export default MenuHero;
