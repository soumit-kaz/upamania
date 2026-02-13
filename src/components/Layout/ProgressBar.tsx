'use client';

import { motion } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProgressBar() {
  const { currentSection, getProgress } = useProgress();
  const progress = getProgress();

  // Don't show on loading screen
  if (currentSection === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-4 left-4 right-4 z-40 max-w-md mx-auto"
    >
      {/* Progress Container */}
      <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
        <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
          {/* Progress Fill */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ width: '50%' }}
          />
        </div>
      </div>

      {/* Progress Text */}
      <div className="flex items-center justify-between mt-2 px-2">
        <span className="text-white/60 text-xs">
          {progress.completed} / {progress.total} moments
        </span>
        <div className="flex items-center gap-1">
          <Heart
            className={cn(
              'w-3 h-3',
              progress.percentage > 0 ? 'text-pink-400' : 'text-white/40'
            )}
            fill={progress.percentage > 0 ? 'currentColor' : 'none'}
          />
          <span className="text-white/60 text-xs">{progress.percentage}%</span>
        </div>
      </div>
    </motion.div>
  );
}
