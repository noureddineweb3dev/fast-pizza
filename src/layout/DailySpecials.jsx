import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Timer, ArrowRight, Sword } from 'lucide-react';
import Container from './Container';
import { getMenu } from '../services/apiRestaurant';

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 12, minutes: 0, seconds: 0 }; // Reset
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-4 text-2xl font-black tabular-nums tracking-widest text-white/90">
            <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-red-500 text-sm font-bold">:</span>
            <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-red-500 text-sm font-bold">:</span>
            <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5">
                {String(timeLeft.seconds).padStart(2, '0')}
            </div>
        </div>
    );
}

function SpecialCard({ special, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl"
        >
            <div className="absolute inset-0 bg-gray-900 border border-white/10 transition-colors group-hover:border-red-500/50" />

            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${special.accent} opacity-10 blur-[80px] group-hover:opacity-20 transition-opacity duration-500`} />

            <div className="relative grid md:grid-cols-2 h-full">
                <div className="h-48 md:h-full overflow-hidden">
                    <img
                        src={special.image}
                        alt={special.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 md:from-transparent to-transparent md:bg-none" />
                </div>

                <div className="p-8 flex flex-col justify-between">
                    <div>
                        <div className={`inline-flex items-center gap-1 bg-gradient-to-r ${special.accent} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-lg`}>
                            <Sword className="w-3 h-3" /> {special.tag}
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                            {special.name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                            {special.description || special.ingredients?.join(', ')}
                        </p>
                    </div>

                    <div className="flex items-end justify-between border-t border-white/10 pt-6">
                        <div className="flex flex-col">
                            <span className="text-gray-500 line-through text-sm font-medium">
                                €{(special.unitPrice * 1.25).toFixed(2)}
                            </span>
                            <span className="text-3xl font-black text-white">
                                €{special.unitPrice.toFixed(2)}
                            </span>
                        </div>
                        <Link to="/menu" className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function DailySpecials() {
    const [specials, setSpecials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSpecials() {
            try {
                const menu = await getMenu();
                // Find Ronin Combo and Shogun Family Feast
                const ronin = menu.find(item => item.id === 'solo-ronin-combo') || menu.find(item => item.name.includes('Ronin'));
                const shogun = menu.find(item => item.id === 'shogun-family-combo') || menu.find(item => item.name.includes('Shogun'));

                const results = [];
                if (ronin) results.push({ ...ronin, tag: 'Solo Power', accent: 'from-red-600 to-orange-600' });
                if (shogun) results.push({ ...shogun, tag: 'Clan Feast', accent: 'from-blue-600 to-indigo-600' });

                // If not found, just take first two items
                if (results.length < 2) {
                    const others = menu.filter(item => !results.find(r => r.id === item.id)).slice(0, 2 - results.length);
                    results.push(...others.map(o => ({ ...o, tag: 'Special', accent: 'from-purple-600 to-pink-600' })));
                }

                setSpecials(results);
            } catch (err) {
                console.error('Failed to load specials:', err);
            } finally {
                setLoading(false);
            }
        }
        loadSpecials();
    }, []);

    return (
        <section className="relative py-24 bg-black overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20" />

            <Container className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="text-left">
                        <div className="flex items-center gap-2 text-red-500 font-bold tracking-[0.2em] uppercase mb-4 animate-pulse">
                            <Timer className="w-5 h-5" /> Limited Time Offers
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            DAILY <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">BLADE</span> TECH
                        </h2>
                    </div>

                    <div className="flex flex-col items-start md:items-end">
                        <span className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-widest">Offers expire in</span>
                        <CountdownTimer />
                    </div>
                </div>

                {loading ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="h-64 bg-zinc-900/50 rounded-3xl animate-pulse" />
                        <div className="h-64 bg-zinc-900/50 rounded-3xl animate-pulse" />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {specials.map((special, index) => (
                            <SpecialCard key={special.id} special={special} index={index} />
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link to="/menu" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-1">
                        <span className="text-sm font-medium tracking-widest uppercase">View All Combos</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </Container>
        </section>
    );
}
