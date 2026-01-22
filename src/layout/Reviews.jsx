import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';
import Container from './Container';

const REVIEWS = [
    {
        id: 1,
        name: "Akira Tanaka",
        role: "Verified Samurai",
        text: "The fastest delivery I've ever experienced! My pizza arrived hot and perfect. The crust is an absolute masterpiece.",
        rating: 5,
        accent: "text-blue-400"
    },
    {
        id: 2,
        name: "Yuki Sato",
        role: "Flavor Master",
        text: "Amazing crust and toppings. The Shogun Inferno is my new favorite! It brings the heat without losing the flavor.",
        rating: 5,
        accent: "text-red-400"
    },
    {
        id: 3,
        name: "Kenji Nakamura",
        role: "Loyal Customer",
        text: "Great service and delicious food. Will definitely order again. The packaging keeps everything perfectly intact.",
        rating: 4.5,
        accent: "text-purple-400"
    }
];

function ReviewCard({ review, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group h-full"
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors" />

            <div className="relative p-8 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Quote className={`w-8 h-8 ${review.accent}`} />
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center border border-white/10">
                        <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white leading-tight">{review.name}</h4>
                        <span className={`text-xs uppercase tracking-wider font-bold ${review.accent}`}>
                            {review.role}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}
                        />
                    ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic flex-1">
                    "{review.text}"
                </p>
            </div>
        </motion.div>
    );
}

export default function Reviews() {
    return (
        <section className="relative py-24 bg-black overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px]" />

            <Container className="relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            LEGENDS OF THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                TASTE TEST
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Hear from the warriors who have tasted our blade.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, index) => (
                        <ReviewCard key={review.id} review={review} index={index} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
