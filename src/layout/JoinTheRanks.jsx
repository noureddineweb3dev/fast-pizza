import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Container from './Container';

export default function JoinTheRanks() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Parallax-like feel (static for now but fixed intensity) */}
            <div className="absolute inset-0">
                <img
                    src="/images/pizzas/shogun-inferno.png"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-30 scale-110 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-blue-900/20 mix-blend-overlay" />
            </div>

            <Container className="relative z-10 text-center flex flex-col justify-center h-full w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        JOIN THE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                            RANK AND FILE
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
                        The oven is hot, the blades are sharp. Your mission awaits.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/menu"
                            className="group relative px-12 py-6 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center gap-3"
                        >
                            START YOUR ORDER
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/about"
                            className="px-12 py-6 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold text-xl rounded-full transition-all"
                        >
                            READ MANIFESTO
                        </Link>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
}
