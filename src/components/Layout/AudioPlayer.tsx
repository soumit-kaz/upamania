'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function AudioPlayer() {
  const {
    isAudioPlaying,
    audioVolume,
    isMuted,
    setMuted,
    setAudioVolume,
    currentSection,
  } = useStore();

  // Don't show on loading screen
  if (currentSection === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-4 left-4 z-40"
    >
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
        {/* Music Status Icon */}
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isAudioPlaying ? 'bg-pink-500/20' : 'bg-white/10'
          )}
        >
          <Music
            className={cn(
              'w-4 h-4',
              isAudioPlaying ? 'text-pink-400' : 'text-white/50'
            )}
          />
        </div>

        {/* Volume Slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : audioVolume}
          onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-3 
            [&::-webkit-slider-thumb]:h-3 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-pink-400
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:hover:bg-pink-300"
        />

        {/* Mute/Unmute Button */}
        <motion.button
          onClick={() => setMuted(!isMuted)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/50" />
          ) : (
            <Volume2 className="w-4 h-4 text-white/70" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
