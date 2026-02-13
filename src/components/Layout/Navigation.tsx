'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { CONSTANTS } from '@/config/constants';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    currentSection,
    nextSection,
    previousSection,
    canGoNext,
    canGoPrevious,
    goToSection,
    isSectionUnlocked,
    isSectionCompleted,
  } = useProgress();

  // Don't show navigation on loading screen
  if (currentSection === 0) return null;

  return (
    <>
      {/* Navigation Arrows */}
      <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 sm:gap-3">
        {/* Previous Section */}
        <motion.button
          onClick={previousSection}
          disabled={!canGoPrevious()}
          className={cn(
            'p-2 sm:p-3 rounded-full backdrop-blur-md border transition-all duration-300 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center',
            canGoPrevious()
              ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
              : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
          )}
          whileHover={canGoPrevious() ? { scale: 1.1 } : {}}
          whileTap={canGoPrevious() ? { scale: 0.9 } : {}}
          aria-label="Previous section"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Section Menu */}
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Section menu"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Next Section */}
        <motion.button
          onClick={nextSection}
          disabled={!canGoNext()}
          className={cn(
            'p-2 sm:p-3 rounded-full backdrop-blur-md border transition-all duration-300 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center',
            canGoNext()
              ? 'bg-pink-500/80 border-pink-400/50 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/30'
              : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
          )}
          whileHover={canGoNext() ? { scale: 1.1 } : {}}
          whileTap={canGoNext() ? { scale: 0.9 } : {}}
          aria-label="Next section"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>

      {/* Section Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-[320px] bg-gradient-to-b from-dark/95 to-dark/90 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-dark/80 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Our Journey
                </h2>
                <motion.button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>

              {/* Section List */}
              <div className="p-4 space-y-2">
                {CONSTANTS.SECTIONS.slice(1).map((name, index) => {
                  const sectionIndex = index + 1;
                  const isUnlocked = isSectionUnlocked(sectionIndex);
                  const isCompleted = isSectionCompleted(sectionIndex);
                  const isCurrent = currentSection === sectionIndex;

                  return (
                    <motion.button
                      key={sectionIndex}
                      onClick={() => {
                        if (isUnlocked) {
                          goToSection(sectionIndex);
                          setIsMenuOpen(false);
                        }
                      }}
                      className={cn(
                        'w-full p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3',
                        isUnlocked
                          ? 'hover:bg-white/10 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed',
                        isCurrent && 'bg-pink-500/20 border border-pink-500/30'
                      )}
                      whileHover={isUnlocked ? { x: 5 } : {}}
                    >
                      {/* Status Icon */}
                      <span
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                          isCompleted
                            ? 'bg-green-500/20 text-green-400'
                            : isCurrent
                            ? 'bg-pink-500/20 text-pink-400'
                            : isUnlocked
                            ? 'bg-white/10 text-white/50'
                            : 'bg-white/5 text-white/30'
                        )}
                      >
                        {isCompleted ? '✓' : sectionIndex}
                      </span>

                      {/* Section Name */}
                      <span
                        className={cn(
                          'flex-1',
                          isCurrent
                            ? 'text-pink-400'
                            : isUnlocked
                            ? 'text-white'
                            : 'text-white/40'
                        )}
                      >
                        {name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>

                      {/* Lock Icon */}
                      {!isUnlocked && (
                        <span className="text-white/30">🔒</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
