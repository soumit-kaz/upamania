'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionProps } from '@/types';

export default function Section00_Loading({ isActive, onComplete }: SectionProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Generate stars
  const stars = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 70,
      size: Math.random() * 3 + 1,
      twinkleDelay: Math.random() * 3,
      brightness: Math.random() * 0.5 + 0.5,
    })), []
  );

  // Generate sky lanterns
  const lanterns = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      color: ['#FFD700', '#FFA500', '#FF8C00', '#FFAB40', '#FFE0B2'][Math.floor(Math.random() * 5)],
      size: Math.random() * 20 + 30,
      delay: Math.random() * 8,
      duration: Math.random() * 15 + 20,
      sway: Math.random() * 40 - 20,
    })), []
  );

  // Generate hot air balloons
  const balloons = useMemo(() => [
    { id: 1, x: 8, color: '#FF69B4', size: 55, delay: 0, duration: 35 },
    { id: 2, x: 85, color: '#9B59B6', size: 45, delay: 5, duration: 40 },
    { id: 3, x: 25, color: '#3498DB', size: 40, delay: 12, duration: 38 },
  ], []);

  // Generate floating hearts (fewer since we have lanterns)
  const hearts = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#FF69B4', '#FF6B6B', '#FFD700', '#FF1493', '#E74C3C', '#9B59B6'][Math.floor(Math.random() * 6)],
      size: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 15,
      rotation: Math.random() * 360,
    })), []
  );

  // Generate shooting stars
  const shootingStars = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      startX: Math.random() * 70,
      startY: Math.random() * 40,
      delay: i * 3 + Math.random() * 2,
    })), []
  );

  useEffect(() => {
    if (!isActive) return;
    
    // Show splash for 2.5 seconds, then show main content
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => setShowContent(true), 500);
    }, 2500);
    
    return () => clearTimeout(splashTimer);
  }, [isActive]);

  if (!isActive) return null;

  // Handle tap anywhere to continue (for mobile)
  const handleTapToContinue = () => {
    if (showContent) {
      onComplete();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="h-screen h-[100dvh] w-full relative overflow-hidden cursor-pointer touch-manipulation"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #2d1f3d 60%, #1a1a2e 100%)',
      }}
      onClick={handleTapToContinue}
      onTouchEnd={(e) => { e.preventDefault(); handleTapToContinue(); }}
    >
      {/* Splash screen overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="text-center relative"
            >
          {/* Floating hearts around text */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-400/60"
              style={{
                left: `${30 + Math.cos(i * Math.PI / 4) * 25}%`,
                top: `${40 + Math.sin(i * Math.PI / 4) * 20}%`,
                fontSize: 20 + Math.random() * 15,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            >
              ♥
            </motion.div>
          ))}
          
          {/* Main text */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.p
              className="text-lg sm:text-2xl md:text-4xl font-light tracking-[0.2em] sm:tracking-[0.3em] px-4"
              style={{
                background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #FFB6C1 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(255, 105, 180, 0.5))',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ♥ MADE WITH LOVE ♥
            </motion.p>
          </motion.div>
          
              {/* Subtle glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl -z-10"
                style={{ background: 'radial-gradient(circle, rgba(255,105,180,0.3) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
        }}
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 30% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Twinkling Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,${star.brightness})`,
            }}
            animate={{
              opacity: [star.brightness * 0.3, star.brightness, star.brightness * 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: star.twinkleDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      {shootingStars.map((ss) => (
        <motion.div
          key={`shooting-${ss.id}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${ss.startX}%`,
            top: `${ss.startY}%`,
            boxShadow: '0 0 6px 2px rgba(255,255,255,0.8), -20px 0 20px 2px rgba(255,255,255,0.4), -40px 0 30px rgba(255,255,255,0.2)',
          }}
          animate={{
            x: ['0vw', '40vw'],
            y: ['0vh', '30vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: ss.delay,
            repeat: Infinity,
            repeatDelay: 15,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Image at right top - like a moon */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute top-[5%] sm:top-[8%] md:top-[10%] right-[3%] sm:right-[6%] md:right-[10%] z-20"
            initial={{ opacity: 0, scale: 0.5, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, type: 'spring' }}
          >
            {/* Soft moonlike glow behind */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl sm:blur-3xl"
              style={{ 
                background: 'radial-gradient(circle, rgba(255,220,150,0.5) 0%, rgba(255,180,100,0.2) 40%, transparent 70%)',
                transform: 'scale(1.8)',
              }}
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.8, 2, 1.8] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Circular image - much smaller on mobile */}
            <div 
              className="relative w-16 h-16 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-52 lg:h-52 rounded-full overflow-hidden"
              style={{
                boxShadow: '0 0 40px 15px rgba(255,200,100,0.4), 0 0 80px 30px rgba(255,150,50,0.2)',
              }}
            >
              <img
                src="https://i.ibb.co.com/ZRmHg9g6/landing-page-image.jpg"
                alt="Upama & Soumit"
                className="w-full h-full object-cover object-center scale-110"
              />
              {/* Inner shadow for soft edge */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: 'inset 0 0 30px 15px rgba(10, 10, 26, 0.5)',
                }}
              />
            </div>
            
            {/* Decorative ring - smaller on mobile */}
            <motion.div
              className="absolute inset-0 rounded-full border border-amber-300/20 sm:border-2 sm:border-amber-300/30"
              style={{ transform: 'scale(1.1)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sky Lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lanterns.map((lantern) => (
          <motion.div
            key={`lantern-${lantern.id}`}
            className="absolute"
            style={{ left: `${lantern.x}%`, bottom: 0 }}
            animate={{
              y: [0, '-120vh'],
              x: [0, lantern.sway, 0, -lantern.sway, 0],
            }}
            transition={{
              y: { duration: lantern.duration, repeat: Infinity, ease: 'linear' },
              x: { duration: lantern.duration / 2, repeat: Infinity, ease: 'easeInOut' },
              delay: lantern.delay,
            }}
          >
            {/* Lantern body */}
            <div className="relative" style={{ width: lantern.size, height: lantern.size * 1.3 }}>
              {/* Main lantern shape */}
              <div 
                className="absolute inset-0 rounded-t-full rounded-b-lg"
                style={{
                  background: `radial-gradient(ellipse at 50% 30%, ${lantern.color} 0%, rgba(255,140,0,0.6) 50%, rgba(255,100,0,0.4) 100%)`,
                  boxShadow: `0 0 ${lantern.size/2}px ${lantern.color}, 0 0 ${lantern.size}px rgba(255,150,0,0.3)`,
                }}
              />
              {/* Inner glow */}
              <motion.div
                className="absolute inset-2 rounded-t-full rounded-b-lg"
                style={{
                  background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,200,0.8) 0%, rgba(255,200,100,0.4) 40%, transparent 70%)',
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Bottom opening */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: lantern.size * 0.4,
                  height: lantern.size * 0.15,
                  background: 'rgba(139,69,19,0.8)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
              {/* Flame flicker */}
              <motion.div
                className="absolute bottom-1 left-1/2 -translate-x-1/2"
                style={{
                  width: 4,
                  height: 8,
                  background: 'linear-gradient(to top, #FF4500, #FFD700, transparent)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                }}
                animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hot Air Balloons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {balloons.map((balloon) => (
          <motion.div
            key={`balloon-${balloon.id}`}
            className="absolute"
            style={{ left: `${balloon.x}%` }}
            initial={{ y: '110vh' }}
            animate={{
              y: ['-20vh', '110vh'],
            }}
            transition={{
              y: { duration: balloon.duration, repeat: Infinity, ease: 'linear' },
              delay: balloon.delay,
            }}
          >
            <motion.div
              animate={{ x: [-15, 15, -15] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Balloon envelope */}
              <div className="relative" style={{ width: balloon.size, height: balloon.size * 1.4 }}>
                <div
                  className="absolute inset-0 rounded-t-full rounded-b-[40%]"
                  style={{
                    background: `radial-gradient(ellipse at 30% 30%, ${balloon.color}, ${balloon.color}99 60%, ${balloon.color}66 100%)`,
                    boxShadow: `inset -10px -10px 30px rgba(0,0,0,0.3), 0 5px 20px rgba(0,0,0,0.3)`,
                  }}
                />
                {/* Balloon stripes */}
                <div
                  className="absolute inset-0 rounded-t-full rounded-b-[40%] opacity-30"
                  style={{
                    background: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 10px)`,
                  }}
                />
                {/* Basket ropes */}
                <div className="absolute bottom-0 left-1/4 w-0.5 h-8 bg-amber-900/60" />
                <div className="absolute bottom-0 right-1/4 w-0.5 h-8 bg-amber-900/60" />
                {/* Basket */}
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-sm"
                  style={{
                    width: balloon.size * 0.4,
                    height: balloon.size * 0.25,
                    background: 'linear-gradient(180deg, #8B4513, #654321)',
                    boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.2), inset 0 -2px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Sanctuary/Temple at bottom - positioned above button area */}
      <div className="absolute bottom-[70px] sm:bottom-[60px] left-0 right-0 z-10 pointer-events-none">
        {/* Ground/hill silhouette */}
        <svg viewBox="0 0 1440 150" className="w-full h-12 sm:h-16" preserveAspectRatio="none">
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#0a0a15" />
            </linearGradient>
          </defs>
          {/* Rolling hills */}
          <path d="M0 150 L0 80 Q200 50 400 70 Q600 85 720 60 Q900 35 1100 70 Q1300 95 1440 75 L1440 150 Z" fill="url(#groundGrad)" />
        </svg>
        
        {/* Temple silhouette - smaller on mobile */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <svg width="100" height="60" viewBox="0 0 200 120" className="sm:w-[140px] sm:h-[84px] md:w-[180px] md:h-[108px] opacity-80">
            {/* Main temple body */}
            <rect x="60" y="60" width="80" height="60" fill="#1a1a2e" />
            {/* Roof layers */}
            <polygon points="100,15 40,50 160,50" fill="#1a1a2e" />
            <polygon points="100,25 50,55 150,55" fill="#151525" />
            <polygon points="100,5 35,45 165,45" fill="#0f0f1f" />
            {/* Spire */}
            <rect x="95" y="0" width="10" height="15" fill="#1a1a2e" />
            {/* Door */}
            <rect x="85" y="85" width="30" height="35" rx="15" fill="#0a0a15" />
            {/* Windows with warm glow */}
            <rect x="70" y="70" width="12" height="15" rx="2" fill="#FFD700" opacity="0.6" />
            <rect x="118" y="70" width="12" height="15" rx="2" fill="#FFD700" opacity="0.6" />
          </svg>
        </div>

        {/* Boy silhouette - smaller */}
        <div className="absolute bottom-4 right-[20%] sm:right-[25%] md:right-[30%]">
          <svg width="15" height="25" viewBox="0 0 30 50" className="sm:w-[20px] sm:h-[34px] opacity-80">
            <circle cx="15" cy="8" r="7" fill="#0a0a15" />
            <rect x="11" y="14" width="8" height="16" rx="2" fill="#0a0a15" />
            <rect x="11" y="28" width="4" height="20" rx="2" fill="#0a0a15" />
            <rect x="15" y="28" width="4" height="20" rx="2" fill="#0a0a15" />
          </svg>
        </div>
        
        {/* Trees - smaller and fewer on mobile */}
        <div className="absolute bottom-0 left-2 sm:left-6 md:left-10">
          <svg width="25" height="35" viewBox="0 0 60 80" className="sm:w-[35px] sm:h-[50px] md:w-[50px] md:h-[70px]">
            <ellipse cx="30" cy="30" rx="25" ry="30" fill="#0f0f1f" />
            <rect x="27" y="55" width="6" height="25" fill="#0a0a10" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-2 sm:right-6 md:right-10">
          <svg width="22" height="30" viewBox="0 0 50 70" className="sm:w-[30px] sm:h-[42px] md:w-[45px] md:h-[63px]">
            <ellipse cx="25" cy="25" rx="20" ry="25" fill="#0f0f1f" />
            <rect x="22" y="45" width="6" height="25" fill="#0a0a10" />
          </svg>
        </div>
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <motion.div
            key={`heart-${heart.id}`}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              color: heart.color,
              fontSize: heart.size,
              filter: `drop-shadow(0 0 ${heart.size / 4}px ${heart.color})`,
            }}
            animate={{
              y: ['110vh', '-10vh'],
              x: [0, Math.sin(heart.id) * 40, 0],
              rotate: [heart.rotation, heart.rotation + 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              y: { duration: heart.duration, repeat: Infinity, ease: 'linear' },
              x: { duration: heart.duration / 2, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: heart.duration, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              delay: heart.delay,
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      {/* Floating sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-yellow-200"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: Math.random() * 12 + 8,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Button at bottom - ALWAYS VISIBLE - fixed height area */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Gradient fade above button */}
            <div 
              className="h-6 w-full"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,10,26,0.95))' }}
            />
            
            {/* Button container with safe area */}
            <div 
              className="w-full"
              style={{ 
                background: 'linear-gradient(180deg, rgba(26,26,58,0.98), rgba(10,10,26,1))',
                paddingBottom: 'max(8px, env(safe-area-inset-bottom))' 
              }}
            >
              <motion.button
                onClick={(e) => { e.stopPropagation(); onComplete(); }}
                onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onComplete(); }}
                className="group relative w-full py-4 overflow-hidden touch-manipulation"
                whileTap={{ scale: 0.98 }}
              >
                {/* Glowing border top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/60 to-transparent" />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                />

                <span className="relative z-10 text-white font-semibold text-base tracking-wider flex items-center justify-center gap-3">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    💕
                  </motion.span>
                  Begin Our Journey
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              
              {/* Tap anywhere hint for mobile */}
              <motion.p
                className="text-center text-white/40 text-xs pb-2"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                tap anywhere to continue
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </motion.section>
  );
}
