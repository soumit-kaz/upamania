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

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="h-screen w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #2d1f3d 60%, #1a1a2e 100%)',
      }}
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
              className="text-2xl md:text-4xl font-light tracking-[0.3em]"
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
            className="absolute top-[12%] md:top-[10%] right-[8%] md:right-[12%] z-30"
            initial={{ opacity: 0, scale: 0.5, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, type: 'spring' }}
          >
            {/* Soft moonlike glow behind */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ 
                background: 'radial-gradient(circle, rgba(255,220,150,0.6) 0%, rgba(255,180,100,0.3) 40%, rgba(147,51,234,0.2) 70%, transparent 100%)',
                transform: 'scale(2.2)',
              }}
              animate={{ opacity: [0.5, 0.8, 0.5], scale: [2.2, 2.4, 2.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Circular image */}
            <div 
              className="relative w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden"
              style={{
                boxShadow: '0 0 80px 25px rgba(255,200,100,0.5), 0 0 120px 40px rgba(255,150,50,0.3), 0 0 160px 60px rgba(147,51,234,0.15)',
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
            
            {/* Decorative ring - warm moonlight color */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-amber-300/30"
              style={{ transform: 'scale(1.15)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-orange-300/20"
              style={{ transform: 'scale(1.25)' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
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

      {/* Sanctuary/Temple at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        {/* Ground/hill silhouette */}
        <svg viewBox="0 0 1440 200" className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#0a0a15" />
            </linearGradient>
          </defs>
          {/* Rolling hills */}
          <path d="M0 200 L0 120 Q200 80 400 100 Q600 120 720 90 Q900 60 1100 100 Q1300 130 1440 110 L1440 200 Z" fill="url(#groundGrad)" />
        </svg>
        
        {/* Temple silhouette */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <svg width="200" height="120" viewBox="0 0 200 120" className="opacity-80">
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
            {/* Side structures */}
            <rect x="20" y="80" width="35" height="40" fill="#1a1a2e" />
            <polygon points="37.5,60 15,80 60,80" fill="#151525" />
            <rect x="145" y="80" width="35" height="40" fill="#1a1a2e" />
            <polygon points="162.5,60 140,80 185,80" fill="#151525" />
          </svg>
          {/* Ambient glow from temple */}
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-16 rounded-full blur-2xl"
            style={{ background: 'radial-gradient(ellipse, rgba(255,200,100,0.3) 0%, transparent 70%)' }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Boy looking at moon */}
        <div className="absolute bottom-12 right-[30%] md:right-[35%]">
          {/* Boy silhouette */}
          <svg width="30" height="50" viewBox="0 0 30 50" className="relative z-10">
            {/* Head */}
            <circle cx="15" cy="8" r="7" fill="#0a0a15" />
            {/* Body */}
            <rect x="11" y="14" width="8" height="16" rx="2" fill="#0a0a15" />
            {/* Arms relaxed */}
            <rect x="0" y="16" width="10" height="4" rx="2" fill="#0a0a15" transform="rotate(10 5 18)" />
            <rect x="20" y="16" width="10" height="4" rx="2" fill="#0a0a15" transform="rotate(-10 25 18)" />
            {/* Legs */}
            <rect x="11" y="28" width="4" height="20" rx="2" fill="#0a0a15" />
            <rect x="15" y="28" width="4" height="20" rx="2" fill="#0a0a15" />
          </svg>
        </div>
        
        {/* Trees silhouettes */}
        <div className="absolute bottom-4 left-10">
          <svg width="60" height="80" viewBox="0 0 60 80">
            <ellipse cx="30" cy="30" rx="25" ry="30" fill="#0f0f1f" />
            <rect x="27" y="55" width="6" height="25" fill="#0a0a10" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-10">
          <svg width="50" height="70" viewBox="0 0 50 70">
            <ellipse cx="25" cy="25" rx="20" ry="25" fill="#0f0f1f" />
            <rect x="22" y="45" width="6" height="25" fill="#0a0a10" />
          </svg>
        </div>
        <div className="absolute bottom-6 left-1/4">
          <svg width="40" height="60" viewBox="0 0 40 60">
            <ellipse cx="20" cy="20" rx="15" ry="20" fill="#12121f" />
            <rect x="17" y="38" width="6" height="22" fill="#0a0a12" />
          </svg>
        </div>
        <div className="absolute bottom-6 right-1/4">
          <svg width="45" height="65" viewBox="0 0 45 65">
            <ellipse cx="22" cy="22" rx="18" ry="22" fill="#12121f" />
            <rect x="19" y="42" width="6" height="23" fill="#0a0a12" />
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

      {/* Button at bottom - full width */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.button
              onClick={onComplete}
              className="group relative w-full py-2 overflow-hidden"
              whileHover={{ scale: 1.0 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button background - matching night sky */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(26,26,58,0.95), rgba(15,15,35,0.98))',
                  borderTop: '1px solid rgba(147,112,219,0.3)',
                }}
              />
              
              {/* Subtle glow effect */}
              <motion.div
                className="absolute inset-0"
                style={{ 
                  background: 'linear-gradient(180deg, rgba(147,112,219,0.15), rgba(75,0,130,0.1))',
                }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />

              <span className="relative z-10 text-white/90 font-medium text-sm md:text-base tracking-wider flex items-center justify-center gap-2">
                Begin Our Journey
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
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
