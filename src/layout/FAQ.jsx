import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Sword } from 'lucide-react';
import Container from './Container';

const FAQS = [
    {
        question: "How fast is the 'Samurai Speed'?",
        answer: "Our specialized couriers train in efficient navigation. We aim for 30 minutes or less, but we prioritize safety and quality. The pizza arrives hot, or we offer a refund."
    },
    {
        question: "Do you really use a 450°C oven?",
        answer: "Yes. Our custom-built stone ovens reach blistering temperatures to flash-cook the dough, creating that perfect leopard-spotted crust in just 90 seconds."
    },
    {
        question: "Is there a Gluten-Free option?",
        answer: "Absolutely. We offer a rice-flour based Ancient Grain crust that is gluten-free. However, please note our kitchen processes wheat flour."
    },
    {
        question: "What makes the 'Shogun Inferno' so spicy?",
        answer: "We use a proprietary blend of Ghost Pepper oil, crushed Habaneros, and spicy Chorizo. It measures roughly 50,000 Scoville units. Proceed with caution."
    }
];

function FAQItem({ question, answer, isOpen, onClick }) {
    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-6 flex items-center justify-between text-left group transition-colors hover:text-red-500"
            >
                <span className="text-lg md:text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                    {question}
                </span>
                <div className={`p-2 rounded-full border border-white/10 group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5 text-gray-400 group-hover:text-red-500" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-400 leading-relaxed text-lg border-l-2 border-red-500/50 pl-4 ml-2">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

            <Container className="relative z-10 h-full flex flex-col justify-center">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
                    {/* Left Side: Header */}
                    <div className="lg:col-span-4">
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 text-red-500 font-bold tracking-widest uppercase mb-4">
                                <Sword className="w-5 h-5" /> Knowledge Base
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                COMMON <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                                    QUERIES
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                Everything you need to know about our craft, our speed, and our honor code.
                            </p>

                            <div className="hidden lg:block relative h-64 w-full rounded-2xl overflow-hidden grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                                <img src="/images/pizzas/ronin-pepperoni.png" alt="FAQ" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Accordion */}
                    <div className="lg:col-span-8 bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/5">
                        {FAQS.map((faq, index) => (
                            <FAQItem
                                key={index}
                                {...faq}
                                isOpen={index === openIndex}
                                onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
