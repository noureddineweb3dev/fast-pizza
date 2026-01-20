import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Zap, Flame, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Container from './Container';
import RatingStars from '../ui/RatingStars';

function Home() {
  return (
    <div className="space-y-24">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-800 to-black text-white rounded-xl">
        <Container className="min-h-[80vh] flex flex-col justify-center gap-10 py-12">
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
              className="bg-red-600 hover:bg-red-700 px-6 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <ShoppingBag />
              Order Now
            </Link>

            <Link
              to="/order"
              className="border border-white/30 hover:bg-white/10 px-6 py-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Search />
              Track Order
            </Link>
          </div>
        </Container>

        {/* Decorative blade */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 text-[400px] pointer-events-none">
          🥷
        </div>
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
      <section className="bg-gray-50 py-20 rounded-xl">
        <Container className="text-center space-y-8">
          <h2 className="text-sp-black text-4xl font-bold">Samurai's Choice 🍕</h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Our most legendary pizzas, chosen by masters.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
            <MenuPreview
              title="Ronin Pepperoni"
              sourceURL="/images/pizzas/ronin-pepperoni.png"
              rating={4.9}
            />
            <MenuPreview
              title="Katana Margherita"
              sourceURL="/images/pizzas/katana-margherita.png"
              rating={4.8}
            />
            <MenuPreview
              title="Shogun Fire"
              sourceURL="/images/pizzas/shogun-inferno.png"
              rating={5.0}
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
          <div className="text-sp-black">
            <h2 className="text-4xl font-bold mb-4">Why Pizza Samurai?</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe pizza should be delivered with discipline, precision, and honor. Every
              order is treated like a mission. No shortcuts. No delays.
            </p>
          </div>

          <div className="bg-black text-white rounded-xl p-8 shadow-xl">
            <p className="italic text-lg">"A samurai arrives exactly when the pizza is ready."</p>
            <p className="mt-4 text-sm opacity-70">— Ancient Delivery Scrolls</p>
          </div>
        </Container>
      </section>

      {/* ================= DAILY SPECIALS ================= */}
      <section className="bg-red-50 py-20 rounded-xl border-2 border-red-200">
        <Container className="text-center space-y-8">
          <h2 className="text-sp-black text-4xl font-bold">⚔️ Daily Blade Specials ⚔️</h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Limited-time offers sharper than a katana. Get them before they vanish!
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <SpecialCard
              title="Family Combo Deal"
              image="/images/combos/shogun-family.png"
              description="Large pizza + 2 sides + drinks"
              originalPrice="$45.99"
              specialPrice="$34.99"
            />
            <SpecialCard
              title="Solo Warrior Special"
              image="/images/combos/solo-ronin.png"
              description="Medium pizza + drink + free delivery"
              originalPrice="$28.99"
              specialPrice="$22.99"
            />
          </div>

          <Link
            to="/menu"
            className="inline-block mt-8 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-transform hover:scale-105 active:scale-95 transition-all"
          >
            See all specials →
          </Link>
        </Container>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-gray-50 py-20 rounded-xl">
        <Container className="text-center space-y-8">
          <h2 className="text-sp-black text-4xl font-bold">What Our Customers Say</h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Hear from warriors who have tasted our blades.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              name="Akira Tanaka"
              rating={5}
              text="The fastest delivery I've ever experienced! My pizza arrived hot and perfect."
            />
            <Testimonial
              name="Yuki Sato"
              rating={5}
              text="Amazing crust and toppings. The Shogun Inferno is my new favorite!"
            />
            <Testimonial
              name="Kenji Nakamura"
              rating={4.5}
              text="Great service and delicious food. Will definitely order again."
            />
          </div>
        </Container>
      </section>

      {/* ================= FAQ ================= */}
      <section>
        <Container className="max-w-3xl">
          <h2 className="text-sp-black text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            <FAQItem
              question="How fast is 'Samurai Speed'?"
              answer="We aim to deliver every pizza within 30 minutes. Our couriers are trained in the art of efficient navigation to ensure your pizza arrives hot and fresh."
            />
            <FAQItem
              question="Do you offer gluten-free crust?"
              answer="Yes! We offer a specialized gluten-free crust for most of our pizzas. Just select the option when customizing your order in the menu."
            />
            <FAQItem
              question="Can I track my order in real-time?"
              answer="Absolutely. Once your order is placed, you can use our 'Track Order' feature to see exactly where your pizza is, from the oven to your doorstep."
            />
            <FAQItem
              question="What is the 'Shogun Inferno'?"
              answer="It's our spiciest pizza, featuring habanero-infused sauce, spicy pepperoni, and jalapeños. It's only for the bravest warriors!"
            />
          </div>
        </Container>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-red-700 text-white text-center rounded-xl">
        <h2 className="text-4xl font-bold mb-6">Ready to slice the hunger?</h2>

        <Link
          to="/menu"
          className="inline-block bg-white text-red-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
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
      <h3 className="text-xl font-semibold text-sp-black">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

function MenuPreview({ title, sourceURL, rating }) {
  return (
    <div className="bg-white text-gray-600 rounded-xl shadow p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
      <img src={sourceURL} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-sp-black">{title}</h3>
        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-sm font-bold">
          ⭐ {rating.toFixed(1)}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">A masterclass in flavor and precision.</p>
      <Link
        to="/menu"
        className="mt-auto text-red-600 font-semibold text-sm hover:text-red-700 transition-colors"
      >
        Order Now →
      </Link>
    </div>
  );
}

function Testimonial({ name, rating, text }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-center justify-center mb-4">
        <RatingStars rating={rating} size="sm" interactive={false} showValue />
      </div>
      <p className="text-gray-600 mb-4 italic">"{text}"</p>
      <p className="font-semibold text-sp-black">— {name}</p>
    </div>
  );
}

function SpecialCard({ title, image, description, originalPrice, specialPrice }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center border border-red-100 hover:border-red-300 transition-colors">
      <div className="w-full md:w-1/2 h-48 md:h-full bg-gray-100">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 w-full md:w-1/2 text-left flex flex-col justify-between h-full">
        <div>
          <div className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold mb-2 uppercase tracking-wider">
            Limited Time
          </div>
          <h3 className="text-xl font-bold text-sp-black mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 line-through text-lg">{originalPrice}</span>
          <span className="text-red-600 font-bold text-2xl">{specialPrice}</span>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-semibold text-sp-black flex items-center gap-3">
          <HelpCircle className="text-red-500 w-5 h-5" />
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="text-gray-400" />
        ) : (
          <ChevronDown className="text-gray-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="py-4 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
