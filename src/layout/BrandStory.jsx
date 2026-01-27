import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Container from './Container';

export default function BrandStory() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const parallaxY = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const rotateVar = useTransform(scrollYProgress, [0, 1], [5, -5]);

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-sp-black text-white">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />

            {/* Decorative Kanji/Elements */}
            <div className="absolute top-10 right-10 text-[20rem] font-black text-white/[0.03] select-none pointer-events-none leading-none z-0">
                侍
            </div>

            <Container className="relative z-20 grid md:grid-cols-2 gap-10 items-center content-center h-full">
                {/* Text Content */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-sm font-bold tracking-[0.3em] text-red-500 uppercase mb-4">
                            Our Philosophy
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-black leading-tight mb-4">
                            THE WAY OF THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                                SLICE
                            </span>
                        </h3>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-4 text-base md:text-lg text-gray-400 leading-relaxed"
                    >
                        <p>
                            In a world of mass-produced mediocrity, we choose the path of the artisan.
                            Pizza Samurai wasn't born in a boardroom; it was forged in the heat of
                            unwavering discipline.
                        </p>
                        <p>
                            We believe that every ingredient has a spirit, and every dough
                            requires patience. We don't just "make" pizza. We honor it.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative p-6 mt-6 border-l-4 border-red-600 bg-white/5 backdrop-blur-sm rounded-r-2xl"
                    >
                        <p className="text-xl italic font-serif text-white mb-4">
                            "A samurai arrives exactly when the pizza is ready. Discipline is the secret ingredient."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-xl">
                                🥋
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">Grandmaster Dough</p>
                                <p className="text-red-500 text-xs tracking-wider uppercase">Founder</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Visual Content */}
                <div className="relative h-[500px] hidden md:block">
                    <motion.div
                        style={{ y: parallaxY, rotate: rotateVar }}
                        className="absolute inset-0 z-10"
                    >
                        {/* Main Image Frame */}
                        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent mix-blend-overlay z-10" />
                            <img
                                src="/images/pizzas/shogun-inferno.png"
                                alt="Artisan Pizza"
                                className="w-full h-full object-cover scale-125 hover:scale-110 transition-transform duration-[2s]"
                            />
                        </div>
                    </motion.div>

                    {/* Floating elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute -bottom-10 -left-10 z-20 bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md max-w-xs"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-3xl">🔥</span>
                            <div>
                                <h4 className="font-bold text-white">450°C Stone Oven</h4>
                                <p className="text-xs text-gray-400">Traditional Technique</p>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 w-3/4 animate-pulse" />
                        </div>
                    </motion.div>
                </div>
            </Container>
        </div>
    );
}
