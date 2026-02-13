'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionProps } from '@/types';
import confetti from 'canvas-confetti';

const ENDING_IMAGE = 'https://i.ibb.co.com/8nvvQxxR/09185327-e7c8-473b-bc9c-9be26f021876.jpg';

const CUTE_REJECTIONS = [
  "Oops! That button doesn't work 💔",
  "Nice try, but no isn't an option! 😊",
  "The 'No' button is just decoration 💕",
  "Error 404: No button functionality not found 🙈",
  "Are you sure? Look at those stars above... ✨",
  "My heart won't accept that answer 💖",
  "Let me ask again... with more love 💗",
  "The universe says you can't say no! 🌟",
  "That button is broken on purpose 😉",
  "Try the other button, it's prettier! 💝",
];

export default function Section03_Ending({ isActive, onComplete }: SectionProps) {
  const [showProposal, setShowProposal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [noClickCount, setNoClickCount] = useState(0);
  const [showNoMessage, setShowNoMessage] = useState(false);
  const [currentNoMessage, setCurrentNoMessage] = useState('');
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate particles
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 3 + 1,
      twinkle: Math.random() * 3,
      brightness: Math.random() * 0.5 + 0.5,
    })), []
  );

  const shootingStars = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      startX: 20 + Math.random() * 60,
      startY: Math.random() * 30,
      delay: i * 4 + Math.random() * 2,
    })), []
  );

  const floatingHearts = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 5,
    })), []
  );

  useEffect(() => {
    if (!isActive) return;
    
    // Show proposal after a brief moment
    const timer = setTimeout(() => setShowProposal(true), 1500);
    return () => clearTimeout(timer);
  }, [isActive]);

  const handleNo = useCallback(() => {
    const newCount = noClickCount + 1;
    setNoClickCount(newCount);
    setCurrentNoMessage(CUTE_REJECTIONS[newCount % CUTE_REJECTIONS.length]);
    setShowNoMessage(true);
    
    // Make the No button run away after 3 clicks
    if (newCount >= 3) {
      setNoButtonPosition({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 100,
      });
    }
    
    // Hide message after 2 seconds
    setTimeout(() => setShowNoMessage(false), 2500);
  }, [noClickCount]);

  const handleYes = () => {
    setAnswered(true);
    setShowAnswer(true);
    
    // Massive celebration!
    const duration = 8000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FFD700', '#FF1493'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FFD700', '#FF1493'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FFD700', '#FF1493', '#E6E6FA'],
      });
    }, 300);

    // Heart shaped confetti
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.5, x: 0.5 },
        shapes: ['circle'],
        colors: ['#ff0000', '#ff69b4', '#ff1493'],
        scalar: 1.5,
      });
    }, 1000);
  };

  if (!isActive) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen w-full relative overflow-hidden"
    >
      {/* Deep night sky gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a3a 30%, #2a1a4a 60%, #1a0a2a 100%)',
        }}
      />

      {/* Background Image with subtle visibility */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 0.3 : 0 }}
        transition={{ duration: 2 }}
      >
        <img
          src={ENDING_IMAGE}
          alt="Together"
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/70 to-[#0a0a1a]/90" />
      </motion.div>

      {/* Twinkling stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              background: `radial-gradient(circle, rgba(255,255,255,${star.brightness}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,${star.brightness * 0.5})`,
            }}
            animate={{
              opacity: [star.brightness * 0.3, star.brightness, star.brightness * 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: star.twinkle,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            boxShadow: '0 0 6px #fff, -20px 0 15px rgba(255,255,255,0.3), -40px 0 10px rgba(255,255,255,0.1)',
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, 200],
            y: [0, 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: 8,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Floating hearts background */}
      {floatingHearts.map((heart) => (
        <motion.div
          key={`heart-bg-${heart.id}`}
          className="absolute pointer-events-none opacity-20"
          style={{ 
            left: `${heart.x}%`,
            fontSize: heart.size,
          }}
          animate={{
            y: ['110vh', '-10vh'],
            x: [0, Math.sin(heart.id) * 30, 0],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          💕
        </motion.div>
      ))}

      {/* Ambient glow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(255,105,180,0.15) 0%, transparent 60%)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Cute "No" rejection message */}
      <AnimatePresence>
        {showNoMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-pink-500/90 to-purple-500/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  😊
                </motion.span>
                <span className="text-white font-medium">{currentNoMessage}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6">
        <AnimatePresence>
          {showProposal && !answered && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1 }}
              className="text-center max-w-2xl"
            >
              {/* Decorative ring */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-5xl md:text-7xl">💍</span>
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
                    }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>

              {/* Proposal text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <motion.h1
                  className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-8"
                  style={{
                    background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 30%, #FFD700 50%, #FF69B4 70%, #FFB6C1 100%)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Will you be mine<br />
                  <span className="text-3xl md:text-5xl lg:text-6xl font-medium">Forever?</span>
                </motion.h1>
              </motion.div>

              {/* Yes / No Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                {/* YES Button */}
                <motion.button
                  onClick={handleYes}
                  className="group relative px-12 md:px-16 py-4 md:py-5 rounded-full overflow-hidden"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{ background: 'linear-gradient(135deg, #FF69B4, #FFD700)' }}
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  
                  {/* Button background */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-pink-400/60"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,105,180,0.4), rgba(255,215,0,0.3))',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                      }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                    />
                  </motion.div>

                  <span className="relative z-10 text-white font-semibold text-lg md:text-xl tracking-wide flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      💖
                    </motion.span>
                    Yes, Forever!
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                    >
                      💖
                    </motion.span>
                  </span>
                </motion.button>

                {/* NO Button (runs away after clicks) */}
                <motion.button
                  onClick={handleNo}
                  className="relative px-10 md:px-12 py-4 md:py-5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden"
                  animate={{ 
                    x: noButtonPosition.x, 
                    y: noButtonPosition.y,
                    scale: noClickCount >= 5 ? 0.7 : 1,
                  }}
                  whileHover={{ 
                    scale: noClickCount < 3 ? 1.02 : 0.9,
                    x: noClickCount >= 3 ? (Math.random() - 0.5) * 100 : noButtonPosition.x,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span className="relative z-10 text-white/60 font-medium text-lg md:text-xl tracking-wide">
                    {noClickCount === 0 && "No..."}
                    {noClickCount === 1 && "Really no?"}
                    {noClickCount === 2 && "Are you sure?"}
                    {noClickCount >= 3 && noClickCount < 5 && "Please? 🥺"}
                    {noClickCount >= 5 && "🙈"}
                  </span>
                </motion.button>
              </motion.div>

              {/* Click counter hint */}
              {noClickCount >= 3 && noClickCount < 6 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/40 text-xs mt-4"
                >
                  (The No button seems to be running away... 😊)
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer celebration */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="text-center max-w-3xl"
            >
              {/* Ring celebration */}
              <motion.div
                className="text-6xl md:text-8xl mb-8"
                animate={{
                  scale: [1, 1.2, 1],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💍💕💍
              </motion.div>

              <motion.h2
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FF69B4 25%, #FFD700 50%, #FF69B4 75%, #FFD700 100%)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                She Said Yes!
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-white/90 mb-4 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
              >
                Two hearts, one soul.<br />
                Two lives, one beautiful journey.<br />
                Forever begins now.
              </motion.p>

              <motion.p
                className="text-xl md:text-2xl font-light italic my-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                  background: 'linear-gradient(90deg, #FFB6C1, #FF69B4, #FFB6C1)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                "This is just the beginning of our forever..."
              </motion.p>

              {/* Names with heart */}
              <motion.div
                className="flex items-center justify-center gap-4 text-2xl md:text-4xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
              >
                <span className="text-pink-400 font-light">Upama</span>
                <motion.span
                  className="text-3xl md:text-4xl"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  💕
                </motion.span>
                <span className="text-blue-400 font-light">Soumit</span>
              </motion.div>

              {/* Date */}
              <motion.p
                className="text-white/40 text-sm mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                February 14, 2026 — The day our forever began ✨
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </motion.section>
  );
}
