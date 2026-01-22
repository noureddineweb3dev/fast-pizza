import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Star, ChevronRight, ArrowRight } from 'lucide-react';
import Container from './Container';

const CHOICE_PIZZAS = [
  {
    id: 1,
    title: 'Ronin Pepperoni',
    description: 'Double cure pepperoni, hot honey drizzle, and crushed red pepper flakes.',
    image: '/images/pizzas/ronin-pepperoni.png',
    rating: 4.9,
    tags: ['Best Seller', 'Spicy'],
    accent: 'from-orange-500 to-red-600',
  },
  {
    id: 2,
    title: 'Katana Margherita',
    description: 'San Marzano tomato sauce, buffalo mozzarella, fresh basil, and extra virgin olive oil.',
    image: '/images/pizzas/katana-margherita.png',
    rating: 4.8,
    tags: ['Vegetarian', 'Classic'],
    accent: 'from-green-500 to-emerald-600',
  },
  {
    id: 3,
    title: 'Shogun Inferno',
    description: 'Spicy lovin\' with chorizo, jalapeños, chili oil, and our signature ghost pepper sauce.',
    image: '/images/pizzas/shogun-inferno.png',
    rating: 5.0,
    tags: ['Very Hot', 'Signature'],
    accent: 'from-red-600 to-rose-700',
  },
];

function PizzaCard({ pizza, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-[2rem] transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1" />
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${pizza.accent} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[2rem]`} />
      
      <div className="relative h-full border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-[2rem] overflow-hidden p-6 flex flex-col">
        {/* Image Area */}
        <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl bg-black/20">
            {/* Background elements behind pizza */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-br ${pizza.accent} opacity-20 blur-3xl rounded-full`} />
            
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              src={pizza.image}
              alt={pizza.title}
              className="relative w-full h-full object-contain drop-shadow-2xl z-10"
            />
            
            {/* Tags */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
              {pizza.tags.map(tag => (
                <span key={tag} className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Rating Pulse */}
            <div className="absolute top-3 right-3 z-20">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-sm">{pizza.rating}</span>
              </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
            {pizza.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
            {pizza.description}
          </p>
          
          <div className="mt-auto">
             <Link
                to="/menu"
                className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group/btn"
              >
                <span className="font-bold text-white tracking-wide">Order Request</span>
                <span className="bg-white/10 rounded-lg p-2 group-hover/btn:bg-red-600 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SamuraiChoice() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden bg-black">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-red-500 font-bold tracking-[0.2em] mb-4"
              >
                <Flame className="w-5 h-5" />
                <span className="uppercase text-sm">Chef's Selection</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white leading-tight"
              >
                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">SAMURAI</span><br />
                CHOICE
              </motion.h2>
            </div>

            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
            >
              <Link to="/menu" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                <span className="font-medium">View Full Menu</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CHOICE_PIZZAS.map((pizza, index) => (
            <PizzaCard key={pizza.id} pizza={pizza} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
