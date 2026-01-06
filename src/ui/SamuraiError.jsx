import { useRouteError, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function SamuraiError() {
  const error = useRouteError();

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-red-50 to-yellow-50 text-center p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Samurai Pizza Katana Pizza Slice */}
      <motion.div
        className="w-48 h-48 mb-8 relative"
        animate={{ rotate: [0, 20, -20, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      >
        <div className="w-48 h-48 bg-yellow-400 rounded-full shadow-2xl relative overflow-hidden">
          {/* Pizza toppings as circles */}
          <div className="absolute w-12 h-12 bg-red-500 rounded-full top-8 left-10 animate-pulse"></div>
          <div className="absolute w-10 h-10 bg-green-600 rounded-full top-20 left-28 animate-pulse"></div>
          <div className="absolute w-10 h-10 bg-green-600 rounded-full top-26 left-4 animate-pulse"></div>
          <div className="absolute w-8 h-8 bg-red-600 rounded-full top-28 left-16 animate-pulse"></div>
          <div className="absolute w-9 h-9 bg-red-600 rounded-full top-34 left-28 animate-pulse"></div>
        </div>
      </motion.div>

      {/* Big 404 */}
      <h1 className="text-8xl font-extrabold text-red-700 mb-4 animate-bounce">404</h1>

      {/* Subtitle */}
      <p className="text-2xl font-semibold text-gray-800 mb-2">
        The Samurai Pizza got lost in battle!
      </p>

      {/* Optional error info */}
      {error?.status && <p className="text-sm text-gray-500 mb-4">Error code: {error.status}</p>}

      <p className="text-lg max-w-xl text-gray-700 mb-6">
        Our fearless Pizza Samurai was delivering at lightning speed but ended up in the wrong dojo.
        Don't worry — we can guide you back to safety.
      </p>

      {/* Go Home Button */}
      <Link
        to="/"
        className="inline-block px-8 py-4 bg-red-700 text-white font-bold rounded-full shadow-lg hover:bg-red-800 transition transform hover:scale-105"
      >
        Return to Dojo
      </Link>
    </motion.div>
  );
}

export default SamuraiError;
