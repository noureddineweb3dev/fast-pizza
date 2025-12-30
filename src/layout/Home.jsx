import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Zap, Flame } from 'lucide-react';
import Container from './Container';
import Button from '../ui/Button';

function Home() {
  return (
    <div className="space-y-24">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-linear-to-br from-red-800 to-black text-white">
        <Container className="min-h-[80vh] flex flex-col justify-center gap-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Pizza delivered <br />
            <span className="text-red-400">with Samurai speed</span>
          </motion.h1>

          <p className="max-w-xl text-lg text-gray-200">
            Precision-crafted pizzas. Lightning-fast delivery. One blade. One slice. No delays.
          </p>

          {/* Primary actions */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="bg-red-600 hover:bg-red-700 px-6 py-4 rounded-lg font-semibold flex items-center gap-2"
            >
              <ShoppingBag />
              Order Now
            </Link>

            <Link
              to="/order"
              className="border border-white/30 hover:bg-white/10 px-6 py-4 rounded-lg flex items-center gap-2"
            >
              <Search />
              Track Order
            </Link>
          </div>
        </Container>

        {/* Decorative blade */}
        <div className="absolute right-50 top-1/2 -translate-y-1/2 opacity-20 text-[400px]">🥷</div>
      </section>

      {/* ================= SPEED SECTION ================= */}
      <section>
        <Container>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <Feature
              icon={<Zap className="w-10 h-10" />}
              title="Lightning Fast"
              text="From oven to door in record time."
            />
            <Feature
              icon={<Flame className="w-10 h-10" />}
              title="Perfectly Fired"
              text="High-heat ovens for flawless crust."
            />
            <Feature
              icon={<ShoppingBag className="w-10 h-10" />}
              title="Zero Guessing"
              text="Track your order every step."
            />
          </div>
        </Container>
      </section>

      {/* ================= FEATURED MENU ================= */}
      <section className="bg-gray-50 py-20">
        <Container className="text-center space-y-8">
          <h2 className="text-(--sp-black) text-4xl font-bold">Samurai’s Choice 🍕</h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Our most legendary pizzas, chosen by masters.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <MenuPreview
              title="Ronin Pepperoni"
              sourceURL="../public/images/pizzas/ronin-pepperoni.png"
            />
            <MenuPreview
              title="Katana Margherita"
              sourceURL="../public/images/pizzas/katana-margherita.png"
            />
            <MenuPreview
              title="Shogun Fire"
              sourceURL="../public/images/pizzas/shogun-inferno.png"
            />
          </div>

          <Link to="/menu" className="inline-block mt-8 text-red-600 font-semibold hover:underline">
            View full menu →
          </Link>
        </Container>
      </section>

      {/* ================= BRAND STORY ================= */}
      <section>
        <Container className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Why Pizza Samurai?</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe pizza should be delivered with discipline, precision, and honor. Every
              order is treated like a mission. No shortcuts. No delays.
            </p>
          </div>

          <div className="bg-black text-white rounded-xl p-8 shadow-xl">
            <p className="italic text-lg">“A samurai arrives exactly when the pizza is ready.”</p>
            <p className="mt-4 text-sm opacity-70">— Ancient Delivery Scrolls</p>
          </div>
        </Container>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-red-700 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to slice the hunger?</h2>

        <Link
          to="/menu"
          className="bg-white text-red-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100"
        >
          Order Your Pizza
        </Link>
      </section>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Feature({ icon, title, text }) {
  return (
    <div className="space-y-4">
      <div className="mx-auto w-24 h-24 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function MenuPreview({ title, sourceURL }) {
  return (
    <div className="bg-white text-gray-600 rounded-xl shadow p-6 hover:shadow-lg transition">
      <img src={sourceURL} alt={title} />
      <div className="h-32 bg-gray-200 rounded mb-4" />
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
  );
}

export default Home;
