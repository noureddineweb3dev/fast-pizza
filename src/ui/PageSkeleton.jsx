import { motion } from 'framer-motion';

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-48 w-full rounded-[2.5rem] bg-zinc-800/50 border border-white/5" />

      {/* Title Skeleton */}
      <div className="h-8 w-1/3 rounded-xl bg-zinc-800/50" />

      {/* Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-[2rem] overflow-hidden bg-zinc-900/50 border border-white/5"
          >
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-zinc-800/50" />

            {/* Content placeholder */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-6 w-2/3 rounded-lg bg-zinc-800/50" />
                <div className="h-6 w-16 rounded-lg bg-red-900/30" />
              </div>
              <div className="h-4 w-full rounded bg-zinc-800/50" />
              <div className="h-4 w-3/4 rounded bg-zinc-800/50" />
              <div className="h-12 w-full rounded-xl bg-zinc-800/50" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PageSkeleton;
