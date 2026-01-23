import { motion } from 'framer-motion';
import { Sword, Flame, Target, Users, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../../layout/Container';
import Button from '../../ui/Button';

const VALUES = [
    { icon: Flame, title: 'Forged in Fire', description: 'Every pizza is crafted in our legendary wood-fired ovens, reaching temperatures that bring out flavors worthy of a samurai feast.' },
    { icon: Target, title: 'Precision', description: 'Like a master swordsman, we measure every ingredient with unwavering accuracy. No shortcuts, no compromises.' },
    { icon: Heart, title: 'Passion', description: 'Our love for pizza runs deep. Each creation is a labor of love, made by artisans who treat dough like a sacred art.' },
    { icon: Shield, title: 'Quality', description: 'We source only the finest ingredients. Fresh mozzarella, San Marzano tomatoes, and herbs from our own gardens.' },
];

const TIMELINE = [
    { year: '2018', event: 'The First Slice', description: 'Samurai Pizza was born in a small kitchen with one dream: to revolutionize delivery pizza.' },
    { year: '2020', event: 'The Dojo Expands', description: 'We opened our flagship location, featuring a traditional wood-fired oven imported from Naples.' },
    { year: '2022', event: 'Digital Katana', description: 'Launched our online ordering system, bringing the samurai experience directly to your door.' },
    { year: '2024', event: 'The Legend Grows', description: 'Now serving thousands of loyal samurai across the region, with new flavors and adventures.' },
];

function About() {
    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-black mb-16 border border-white/10 shadow-2xl">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.3),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(234,88,12,0.2),transparent_50%)]" />
                </div>
                <Container className="relative z-10 py-24 md:py-32 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-bold tracking-widest text-xs uppercase backdrop-blur-md">
                        <Sword className="w-4 h-4" /> Our Manifesto
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-6">
                        THE WAY OF THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">PIZZA</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        In the ancient art of pizza making, there are no shortcuts. Only honor, precision, and the relentless pursuit of perfection.
                    </motion.p>
                </Container>
            </section>

            {/* Values */}
            <section className="mb-16">
                <Container>
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-black text-white text-center mb-12">
                        Our <span className="text-red-500">Code</span>
                    </motion.h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {VALUES.map((value, i) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 bg-zinc-900/50 rounded-[2rem] border border-white/5 hover:border-red-500/30 transition-all"
                            >
                                <div className="w-14 h-14 mb-4 bg-red-600/20 rounded-2xl border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <value.icon className="w-7 h-7 text-red-500" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">{value.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Timeline */}
            <section className="mb-16">
                <Container>
                    <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-black text-white text-center mb-12">
                        Our <span className="text-red-500">Journey</span>
                    </motion.h2>

                    <div className="relative max-w-3xl mx-auto">
                        {/* Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-red-600 via-red-600/50 to-transparent hidden md:block" />

                        <div className="space-y-8">
                            {TIMELINE.map((item, i) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="shrink-0 w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-900/30">
                                        {item.year.slice(2)}
                                    </div>
                                    <div className="flex-1 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-black text-white mb-1">{item.event}</h3>
                                        <p className="text-gray-400 text-sm">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <section className="mb-8">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-red-600 to-orange-600 p-12 text-center"
                    >
                        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Join the Ranks?</h2>
                            <p className="text-white/80 mb-8 max-w-xl mx-auto">Experience the legend for yourself. Order now and taste what true pizza mastery is all about.</p>
                            <Link to="/menu">
                                <Button variant="secondary" size="lg" className="!bg-white !text-red-600 hover:!bg-gray-100 !rounded-xl">
                                    Explore Our Menu
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </Container>
            </section>
        </>
    );
}

export default About;
