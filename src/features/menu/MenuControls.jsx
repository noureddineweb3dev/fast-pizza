import { motion } from 'framer-motion';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
    { id: 'all', label: 'All Items' },
    { id: 'pizza', label: 'Pizzas' },
    { id: 'side', label: 'Sides' },
    { id: 'drink', label: 'Drinks' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'combo', label: 'Combos' },
];

const SORT_OPTIONS = [
    { id: 'default', label: 'Default' },
    { id: 'rating-high', label: 'Highest Rated' },
    { id: 'rating-low', label: 'Lowest Rated' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
];

function MenuControls({ activeCategory, onCategoryChange, sortBy, onSortChange }) {
    const [isSortOpen, setIsSortOpen] = useState(false);

    const activeSortLabel = SORT_OPTIONS.find(opt => opt.id === sortBy)?.label;

    return (
        <div className="sticky top-24 z-30 mb-8">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Category Filter (Horizontal Scroll) */}
                <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    <div className="flex items-center gap-2 px-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`relative px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id
                                        ? 'text-white shadow-lg shadow-red-900/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {activeCategory === cat.id && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-xl -z-10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative w-full md:w-64 px-2">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-white transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-400">Sort by: <span className="text-white ml-1">{activeSortLabel}</span></span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSortOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsSortOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-2 left-2 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => {
                                            onSortChange(opt.id);
                                            setIsSortOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
                                    >
                                        <span className={sortBy === opt.id ? 'text-red-500 font-bold' : 'text-gray-300'}>
                                            {opt.label}
                                        </span>
                                        {sortBy === opt.id && <Check className="w-4 h-4 text-red-500" />}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MenuControls;
