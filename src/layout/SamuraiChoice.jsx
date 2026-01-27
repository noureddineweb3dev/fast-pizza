import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Star, ChevronRight, ArrowRight } from 'lucide-react';
import Container from './Container';
import { getMenu } from '../services/apiRestaurant';

function PizzaCard({ pizza, index }) {
  const accentColors = {
    pizza: 'from-red-600 to-orange-500',
    side: 'from-yellow-500 to-orange-500',
    drink: 'from-blue-500 to-cyan-500',
    dessert: 'from-pink-500 to-purple-500',
    combo: 'from-green-500 to-emerald-500',
  };
  const accent = accentColors[pizza.category] || 'from-red-600 to-orange-500';

  const tags = [];
  if (pizza.bestseller) tags.push('Best Seller');
  if (pizza.spicy) tags.push('Spicy');
  if (pizza.vegetarian) tags.push('Vegetarian');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-[2rem] transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1" />

      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[2rem]`} />

      <div className="relative h-full border border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-[2rem] overflow-hidden p-4 flex flex-col">
        <div className="relative h-32 md:h-40 w-full mb-2 overflow-hidden rounded-2xl bg-black/20 shrink-0">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-br ${accent} opacity-20 blur-3xl rounded-full`} />

          <motion.img
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            src={pizza.image}
            alt={pizza.name}
            className="relative w-full h-full object-contain drop-shadow-2xl z-10"
          />

          {tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-20">
              {tags.map(tag => (
                <span key={tag} className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="absolute top-2 right-2 z-20">
            <div className={`flex items-center gap-1.5 bg-gradient-to-r ${accent} px-2 py-1 rounded-full`}>
              <span className="text-white font-black text-xs">€{pizza.unitPrice || pizza.price}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
            {pizza.name}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
            {pizza.description || pizza.ingredients?.join(', ')}
          </p>

          <div className="mt-auto">
            <Link
              to="/menu"
              className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group/btn"
            >
              <span className="font-bold text-white tracking-wide">Order Now</span>
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
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const menu = await getMenu();
        // Priority: 1. Explicitly featured, 2. Bestsellers, 3. Regular pizzas
        const featuredItems = menu.filter(item => item.featured && item.available !== false);
        const bestsellers = menu.filter(item => item.bestseller && item.available !== false && !item.featured);
        const pizzas = menu.filter(item => item.category === 'pizza' && item.available !== false && !item.featured && !item.bestseller);

        const featured = [...featuredItems, ...bestsellers, ...pizzas].slice(0, 3);
        setFeaturedItems(featured);
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 w-full h-full flex flex-col justify-center">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
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
              className="text-4xl md:text-5xl font-black text-white leading-tight"
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

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-zinc-900/50 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 w-full">
            {featuredItems.map((pizza, index) => (
              <PizzaCard key={pizza.id} pizza={pizza} index={index} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
