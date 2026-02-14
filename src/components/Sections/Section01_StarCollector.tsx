'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS } from '@/config/assets';
import { CONTENT } from '@/config/content';
import { SectionProps } from '@/types';
import Button from '@/components/UI/Button';

interface NamedStar {
  id: number;
  x: number;
  y: number;
  name: string;
  hint: string;
  isSpecial: boolean;
  collected: boolean;
  revealed: boolean;
}

// Real star names with romantic hints pointing to Soumit
const STAR_DATA = [
  { 
    name: 'Sirius', 
    hint: "I'm the brightest in the sky, but not the one who lights up her heart... Look for someone whose name means 'the Sun'... 🌟" 
  },
  { 
    name: 'Vega', 
    hint: "Ancient lovers gazed at me, but I'm not your destined star. The one you seek has a name that starts with 'S'... 💫" 
  },
  { 
    name: 'Polaris', 
    hint: "I guide lost travelers home, but I can't guide you to love. Only one star here holds her heart... and it's not me 🧭" 
  },
  { 
    name: 'Rigel', 
    hint: "I burn bright blue in Orion's foot, but the star you need burns with love. His name rhymes with 'summit'... 💙" 
  },
  { 
    name: 'Altair', 
    hint: "In the Summer Triangle I shine, but summer love isn't mine to give. Seek the star whose heart belongs to her... ✨" 
  },
  { 
    name: 'Betelgeuse', 
    hint: "I'm a red giant, old and wise. I've seen true love before... and it's in the star named after someone special 🔴" 
  },
  { 
    name: 'Arcturus', 
    hint: "I'm beautiful but distant. The star you want is closer to her heart... His name sounds like a beautiful soul 🌙" 
  },
];

// Playful messages when Soumit's star evades
const SOUMIT_EVADE_MESSAGES = [
  { text: "Hehe, not so fast! 😜", subtext: "Soumit's star is playing hard to get!" },
  { text: "Oops! Where did I go? 👀", subtext: "The star vanished into thin air!" },
  { text: "Catch me if you can! 💫", subtext: "This star has moves!" },
  { text: "Almost got me! 🏃‍♂️", subtext: "One more try..." },
];

export default function Section01_StarCollector({ isActive, onComplete }: SectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'intro' | 'collecting' | 'complete'>('intro');
  const [textIndex, setTextIndex] = useState(0);
  const [stars, setStars] = useState<NamedStar[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{id: number; x: number; y: number; emoji: string; delay: number}[]>([]);
  const [currentHint, setCurrentHint] = useState<{name: string; hint: string} | null>(null);
  const [fallingStarEffect, setFallingStarEffect] = useState<{x: number; y: number; name: string} | null>(null);
  const [risingStarReveal, setRisingStarReveal] = useState(false);
  const backgroundStarsRef = useRef<{x: number; y: number; size: number; alpha: number; twinkleSpeed: number}[]>([]);
  const animationRef = useRef<number>();
  
  // Playful evasion states for Soumit's star
  const [soumitAttempts, setSoumitAttempts] = useState(0);
  const [soumitEvadeMessage, setSoumitEvadeMessage] = useState<{text: string; subtext: string} | null>(null);
  const [soumitVanished, setSoumitVanished] = useState(false);
  const [isSoumitCatchable, setIsSoumitCatchable] = useState(false);

  // Initialize stars with names
  const initializeStars = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const newStars: NamedStar[] = [];
    const padding = 80;
    const minDistance = 100;
    const shuffledStarData = [...STAR_DATA].sort(() => Math.random() - 0.5);
    
    // Add the special star (Soumit) first
    let specialX = 0, specialY = 0;
    specialX = window.innerWidth / 2 + (Math.random() - 0.5) * Math.min(200, window.innerWidth * 0.3);
    specialY = window.innerHeight / 2 + (Math.random() - 0.5) * Math.min(150, window.innerHeight * 0.2);
    
    newStars.push({
      id: 0,
      x: specialX,
      y: specialY,
      name: ASSETS.personal.yourName,
      hint: `💖 You found me! I'm ${ASSETS.personal.yourName}, and my heart belongs only to ${ASSETS.personal.herName}! 💖`,
      isSpecial: true,
      collected: false,
      revealed: false,
    });
    
    // Add other stars with real star names
    for (let i = 0; i < 7; i++) {
      let x: number = 0;
      let y: number = 0;
      let attempts = 0;
      
      do {
        x = padding + Math.random() * (window.innerWidth - padding * 2);
        y = padding + 60 + Math.random() * (window.innerHeight - padding * 2 - 120);
        attempts++;
      } while (
        attempts < 100 &&
        newStars.some(
          (s) => Math.sqrt((s.x - x) ** 2 + (s.y - y) ** 2) < minDistance
        )
      );
      
      newStars.push({
        id: i + 1,
        x,
        y,
        name: shuffledStarData[i].name,
        hint: shuffledStarData[i].hint,
        isSpecial: false,
        collected: false,
        revealed: false,
      });
    }
    
    // Shuffle so special star isn't always first
    setStars(newStars.sort(() => Math.random() - 0.5));
    
    // Initialize background stars
    backgroundStarsRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      alpha: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }));
  }, []);

  // Generate floating emojis for completion
  const generateFloatingEmojis = useCallback(() => {
    const emojis = ['💋', '❤️', '🥰', '😘', '💕', '💖', '💗', '💝', '😍', '💞', '💓', '💘'];
    const newEmojis = [];
    for (let i = 0; i < 60; i++) {
      newEmojis.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        delay: Math.random() * 2,
      });
    }
    setFloatingEmojis(newEmojis);
  }, []);

  // Handle intro sequence
  useEffect(() => {
    if (!isActive || phase !== 'intro') return;

    const lines = CONTENT.starCollector.lines;
    
    if (textIndex < lines.length) {
      const delay = textIndex === lines.length - 1 ? 1500 : 1000;
      const timer = setTimeout(() => {
        setTextIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setPhase('collecting');
        initializeStars();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, phase, textIndex, initializeStars]);

  // Canvas animation loop
  useEffect(() => {
    if (!isActive || phase !== 'collecting') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background stars
      backgroundStarsRef.current.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        const twinkle = Math.sin(star.alpha) * 0.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, phase]);

  // Handle star click
  const handleStarClick = (star: NamedStar) => {
    if (star.collected) return;
    
    // SPECIAL HANDLING FOR SOUMIT'S STAR - PLAYFUL EVASION!
    if (star.isSpecial && !isSoumitCatchable) {
      const newAttempts = soumitAttempts + 1;
      setSoumitAttempts(newAttempts);
      
      // Show playful message
      const messageIndex = Math.min(newAttempts - 1, SOUMIT_EVADE_MESSAGES.length - 1);
      setSoumitEvadeMessage(SOUMIT_EVADE_MESSAGES[messageIndex]);
      
      // Different behaviors based on attempt count
      if (newAttempts === 1) {
        // First attempt: Star moves aside
        const newX = star.x > window.innerWidth / 2 
          ? star.x - 80 - Math.random() * 60 
          : star.x + 80 + Math.random() * 60;
        const newY = Math.max(100, Math.min(window.innerHeight - 150, star.y + (Math.random() - 0.5) * 100));
        setStars(prev => prev.map(s => s.id === star.id ? { ...s, x: Math.max(60, Math.min(window.innerWidth - 60, newX)), y: newY } : s));
      } else if (newAttempts === 2) {
        // Second attempt: Star vanishes and reappears
        setSoumitVanished(true);
        setTimeout(() => {
          const newX = 100 + Math.random() * (window.innerWidth - 200);
          const newY = 120 + Math.random() * (window.innerHeight - 300);
          setStars(prev => prev.map(s => s.id === star.id ? { ...s, x: newX, y: newY } : s));
          setSoumitVanished(false);
        }, 800);
      } else if (newAttempts === 3) {
        // Third attempt: Star dodges dramatically
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 80;
        const newX = Math.max(60, Math.min(window.innerWidth - 60, star.x + Math.cos(angle) * distance));
        const newY = Math.max(100, Math.min(window.innerHeight - 150, star.y + Math.sin(angle) * distance));
        setStars(prev => prev.map(s => s.id === star.id ? { ...s, x: newX, y: newY } : s));
      } else if (newAttempts >= 4) {
        // Fourth attempt: Star "surrenders" - becomes catchable
        setIsSoumitCatchable(true);
      }
      
      // Hide message after delay
      setTimeout(() => setSoumitEvadeMessage(null), 2500);
      return;
    }
    
    // First, reveal the star name if not already revealed
    if (!star.revealed) {
      setStars((prev) =>
        prev.map((s) => (s.id === star.id ? { ...s, revealed: true } : s))
      );
      
      // If it's the special star, rise up dramatically and show the image!
      if (star.isSpecial) {
        setTimeout(() => {
          // Star rises up!
          setStars((prev) =>
            prev.map((s) => (s.id === star.id ? { ...s, collected: true } : s))
          );
          // Show the romantic image reveal
          setTimeout(() => {
            setRisingStarReveal(true);
          }, 800);
          setTimeout(() => {
            setPhase('complete');
            generateFloatingEmojis();
            setRisingStarReveal(false);
          }, 4500);
          setTimeout(() => setShowButton(true), 6500);
        }, 1200);
        return;
      }
      
      // Show the hint for wrong star
      setCurrentHint({ name: star.name, hint: star.hint });
      
      // After showing hint, make the star fall dramatically
      setTimeout(() => {
        setFallingStarEffect({ x: star.x, y: star.y, name: star.name });
        setStars((prev) =>
          prev.map((s) => (s.id === star.id ? { ...s, collected: true } : s))
        );
        setTimeout(() => {
          setFallingStarEffect(null);
          setCurrentHint(null);
        }, 2000);
      }, 2500);
      return;
    }
  };

  if (!isActive) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen h-[100dvh] w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a1a40 100%)',
      }}
    >
      {/* Canvas for background stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Intro Phase */}
      <AnimatePresence>
        {phase === 'intro' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {CONTENT.starCollector.lines.slice(0, textIndex + 1).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-lg sm:text-2xl md:text-4xl mb-3 sm:mb-4 px-4 ${
                    i === CONTENT.starCollector.lines.length - 1
                      ? 'text-gold font-bold'
                      : 'text-white'
                  }`}
                >
                  {i === CONTENT.starCollector.lines.length - 1 
                    ? line.replace('YOU', ASSETS.personal.herName)
                    : line}
                </motion.p>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Collecting Phase */}
      {phase === 'collecting' && (
        <>
          {/* Instruction */}
          <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 z-10 text-center px-4 w-full max-w-sm sm:max-w-md">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white text-sm sm:text-base md:text-lg lg:text-xl mb-2"
            >
              ✨ Find the star that lights up her heart! ✨
            </motion.p>
          </div>

          {/* Named Stars */}
          {stars.map((star) => (
            <motion.div
              key={star.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                // Special handling for Soumit's star vanish effect
                star.isSpecial && soumitVanished
                  ? {
                      scale: [1, 1.5, 0],
                      opacity: [1, 0.5, 0],
                      rotate: [0, 180, 360],
                    }
                  : star.collected
                  ? star.isSpecial 
                    ? { 
                        // Soumit's star RISES UP gloriously!
                        y: -window.innerHeight,
                        x: window.innerWidth / 2 - star.x,
                        opacity: [1, 1, 1, 0.8, 0],
                        rotate: [0, -10, 10, -5, 0],
                        scale: [1, 1.5, 2, 3, 4],
                      }
                    : { 
                        // Other stars fall down
                        y: window.innerHeight + 200,
                        x: [0, -50, 50, -30, 30, 0],
                        opacity: [1, 1, 0.8, 0.5, 0.2, 0],
                        rotate: [0, 180, 360, 540, 720],
                        scale: [1, 0.8, 0.6, 0.4, 0.2],
                      }
                  : star.isSpecial && soumitAttempts > 0 && !isSoumitCatchable
                    ? {
                        // Playful wiggle when being chased
                        scale: [1, 1.1, 1],
                        opacity: 1,
                        y: [0, -5, 5, 0],
                        x: [0, 3, -3, 0],
                      }
                    : { 
                        scale: 1,
                        opacity: 1,
                        y: [0, -8, 0],
                      }
              }
              transition={
                star.isSpecial && soumitVanished
                  ? { duration: 0.5, ease: 'easeInOut' }
                  : star.collected
                  ? star.isSpecial
                    ? { 
                        duration: 2,
                        ease: [0.34, 1.56, 0.64, 1],
                        scale: { duration: 2, ease: 'easeOut' },
                        rotate: { duration: 2, ease: 'easeInOut' }
                      }
                    : { 
                        duration: 2, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        x: { duration: 2, ease: 'easeInOut' },
                        rotate: { duration: 2, ease: 'linear' }
                      }
                  : { 
                      y: { duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut' },
                      scale: { duration: 0.5 },
                      opacity: { duration: 0.5 }
                    }
              }
              onClick={() => handleStarClick(star)}
              onTouchEnd={(e) => { e.preventDefault(); handleStarClick(star); }}
              className="absolute cursor-pointer flex flex-col items-center touch-manipulation"
              style={{ left: star.x - 25, top: star.y - 25, minWidth: '50px', minHeight: '50px' }}
            >
              <motion.div
                animate={star.isSpecial ? {
                  scale: [1, 1.2, 1],
                  filter: [
                    'drop-shadow(0 0 10px gold) drop-shadow(0 0 20px pink)',
                    'drop-shadow(0 0 20px gold) drop-shadow(0 0 40px pink)',
                    'drop-shadow(0 0 10px gold) drop-shadow(0 0 20px pink)',
                  ],
                } : {
                  filter: [
                    'drop-shadow(0 0 5px white)',
                    'drop-shadow(0 0 15px white)',
                    'drop-shadow(0 0 5px white)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.3 }}
                className={`${star.isSpecial ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'}`}
              >
                {star.isSpecial ? '🌟' : '⭐'}
              </motion.div>
              
              {/* Name only shows when revealed */}
              <AnimatePresence>
                {star.revealed && (
                  <motion.span
                    initial={{ opacity: 0, y: -10, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className={`text-xs mt-1 px-3 py-1 rounded-full whitespace-nowrap ${
                      star.isSpecial 
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-gold text-white font-bold text-sm shadow-lg shadow-pink-500/50' 
                        : 'bg-white/20 text-white/90 backdrop-blur-sm'
                    }`}
                  >
                    {star.isSpecial ? `💖 ${star.name} 💖` : star.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Dramatic falling star effect with particles */}
          <AnimatePresence>
            {fallingStarEffect && (
              <>
                {/* Trailing particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    initial={{ 
                      x: fallingStarEffect.x, 
                      y: fallingStarEffect.y,
                      opacity: 1,
                      scale: 1
                    }}
                    animate={{ 
                      x: fallingStarEffect.x + (Math.random() - 0.5) * 200,
                      y: fallingStarEffect.y + Math.random() * 300 + 100,
                      opacity: 0,
                      scale: 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.5 + Math.random(),
                      delay: Math.random() * 0.5,
                      ease: 'easeOut'
                    }}
                    className="absolute text-xl pointer-events-none"
                  >
                    {['✨', '💫', '⭐', '🌟', '✨'][i % 5]}
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Hint popup when wrong star clicked */}
          <AnimatePresence>
            {currentHint && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                transition={{ type: 'spring', damping: 15 }}
                className="fixed bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-[90%] sm:max-w-md mx-4"
              >
                <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl text-center mb-2 sm:mb-3"
                  >
                    💫
                  </motion.div>
                  <p className="text-base sm:text-lg text-white/90 font-medium text-center mb-2">
                    ⭐ {currentHint.name} whispers:
                  </p>
                  <p className="text-sm sm:text-base text-white/80 text-center italic leading-relaxed">
                    &ldquo;{currentHint.hint}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playful evade message when Soumit's star runs away */}
          <AnimatePresence>
            {soumitEvadeMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 30 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="fixed top-20 sm:top-28 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-sm"
              >
                <motion.div 
                  className="bg-gradient-to-br from-pink-500/95 via-rose-500/95 to-amber-500/95 p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-white/30"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 0.3, repeat: 3 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 15, 0] }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl sm:text-4xl text-center mb-2"
                  >
                    🌟
                  </motion.div>
                  <p className="text-lg sm:text-xl text-white font-bold text-center mb-1">
                    {soumitEvadeMessage.text}
                  </p>
                  <p className="text-sm sm:text-base text-white/80 text-center">
                    {soumitEvadeMessage.subtext}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Romantic Image Reveal when Soumit's star is found */}
          <AnimatePresence>
            {risingStarReveal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ background: 'radial-gradient(ellipse at center, rgba(255,182,193,0.3) 0%, rgba(10,14,39,0.95) 70%)' }}
              >
                {/* Sparkles around the image */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    initial={{ 
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: (Math.random() - 0.5) * 600,
                      y: (Math.random() - 0.5) * 600,
                    }}
                    transition={{
                      duration: 2,
                      delay: Math.random() * 1.5,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 2
                    }}
                    className="absolute text-2xl md:text-3xl pointer-events-none"
                    style={{ left: '50%', top: '50%' }}
                  >
                    {['✨', '💕', '💖', '💗', '⭐', '🌟', '💫', '💝'][i % 8]}
                  </motion.div>
                ))}

                {/* Rising hearts from bottom */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`heart-rise-${i}`}
                    initial={{ 
                      y: '100vh',
                      x: `${10 + Math.random() * 80}vw`,
                      opacity: 0.8
                    }}
                    animate={{ 
                      y: '-20vh',
                      opacity: 0
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      delay: Math.random() * 2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                    className="fixed text-3xl md:text-4xl pointer-events-none"
                  >
                    {['💖', '💕', '💗', '💝', '❤️'][i % 5]}
                  </motion.div>
                ))}

                {/* The romantic image reveal */}
                <motion.div
                  initial={{ scale: 0, rotate: -20, y: 100 }}
                  animate={{ 
                    scale: 1, 
                    rotate: [0, -3, 3, 0],
                    y: 0
                  }}
                  exit={{ scale: 0, opacity: 0, y: -100 }}
                  transition={{ 
                    type: 'spring',
                    damping: 12,
                    stiffness: 100,
                    rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  className="relative z-10"
                >
                  {/* Glowing background */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 60px 30px rgba(255,105,180,0.4), 0 0 100px 60px rgba(255,182,193,0.3)',
                        '0 0 80px 40px rgba(255,105,180,0.6), 0 0 120px 80px rgba(255,182,193,0.4)',
                        '0 0 60px 30px rgba(255,105,180,0.4), 0 0 100px 60px rgba(255,182,193,0.3)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl"
                  />
                  
                  {/* Image container */}
                  <div className="relative bg-gradient-to-br from-pink-200 via-rose-100 to-pink-200 p-2 sm:p-3 rounded-3xl shadow-2xl">
                    <motion.img
                      src="https://i.ibb.co.com/fYpfnKps/Soumit-Star.jpg"
                      alt={`${ASSETS.personal.yourName} being adored by ${ASSETS.personal.herName}`}
                      className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 object-cover rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                    
                    {/* Cute frame decoration */}
                    <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 text-2xl sm:text-4xl">💕</div>
                    <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 text-2xl sm:text-4xl">💕</div>
                    <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 text-2xl sm:text-4xl">💕</div>
                    <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 text-2xl sm:text-4xl">💕</div>
                  </div>

                  {/* Caption */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 sm:mt-6 text-center"
                  >
                    <motion.p 
                      className="text-lg sm:text-2xl md:text-3xl font-bold text-white"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      💖 You found your star! 💖
                    </motion.p>
                    <p className="text-sm sm:text-lg text-pink-200 mt-2">
                      {ASSETS.personal.herName}&apos;s love reaches for {ASSETS.personal.yourName} 🥰
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-pink-300/70 text-center text-xs sm:text-sm px-4 max-w-[90%]"
          >
            💕 Look for a name that means &ldquo;the Sun&rdquo;... someone whose warmth lights up {ASSETS.personal.herName}&apos;s world 💕
          </motion.p>
        </>
      )}

      {/* Complete Phase - Emoji Flood! */}
      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Floating Emojis Flood */}
            {floatingEmojis.map((emoji) => (
              <motion.div
                key={emoji.id}
                initial={{ 
                  x: `${emoji.x}vw`, 
                  y: '110vh',
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{ 
                  y: '-20vh',
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1, 0.8],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 2,
                  delay: emoji.delay,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
                className="absolute text-4xl md:text-5xl pointer-events-none"
              >
                {emoji.emoji}
              </motion.div>
            ))}

            {/* Central Message */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="relative z-10 bg-gradient-to-br from-pink-500/90 to-rose-600/90 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border-4 border-white/30"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-5xl sm:text-7xl text-center mb-3 sm:mb-4"
              >
                💖
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2"
              >
                You found me! 🥰
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-xl text-white/90 text-center mb-3 sm:mb-4"
              >
                Among all the stars in the universe...
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-lg sm:text-2xl font-bold text-yellow-200 text-center"
              >
                {ASSETS.personal.yourName} chose {ASSETS.personal.herName} 💕
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-3 sm:mt-4 text-2xl sm:text-4xl"
              >
                😘💋❤️💋😘
              </motion.div>
            </motion.div>

            {/* Continue Button */}
            <AnimatePresence>
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 z-10"
                >
                  <Button variant="glow" size="lg" onClick={onComplete}>
                    Continue our journey 💕
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
