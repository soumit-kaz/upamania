'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionProps } from '@/types';
import Button from '@/components/UI/Button';
import confetti from 'canvas-confetti';

// =============== TYPES ===============
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity?: number;
}

interface Flower {
  id: number;
  x: number;
  y: number;
  type: string;
  scale: number;
  delay: number;
  rotation: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkleDelay: number;
  brightness: number;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  scale: number;
  speed: number;
  opacity: number;
}

interface Bird {
  id: number;
  startX: number;
  y: number;
  delay: number;
  duration: number;
}

interface Butterfly {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface GrassBlade {
  id: number;
  x: number;
  height: number;
  delay: number;
}

// =============== CONSTANTS ===============
const FLOWER_TYPES = ['🌸', '🌺', '🌷', '🌻', '🌼', '💐', '🌹', '🪻', '🪷', '🌱', '🌿', '☘️', '🍀'];
const MUSIC_NOTES = ['♪', '♫', '♬', '🎵', '🎶', '🎼'];
const BUTTERFLY_COLORS = ['#FFB6C1', '#FF69B4', '#DDA0DD', '#E6E6FA', '#87CEEB', '#98FB98'];

// Cute dialogue between the girl and boy
const UPAMA_QUESTIONS = [
  "Soumit... if I was a cockroach, would you still love me? 🪳",
  "What if I turned into a potato? 🥔",
  "Would you love me if I was a smelly sock? 🧦",
  "If I was invisible, would you search for me? 👻",
  "What if I could only speak in meows? 🐱",
  "Would you love me if I was 100 years old? 👵",
  "If I was a mosquito, would you let me bite you? 🦟",
  "What if I had green hair forever? 💚",
  "Would you love me if I snored super loud? 😴",
  "If I was a cactus, would you still hug me? 🌵",
];

const SOUMIT_RESPONSES = [
  "Yes baby, I'd still love you! 💖",
  "Always and forever! 💕",
  "Of course, my love! 🥰",
  "You know I would! 😘",
  "Even then, I love you! 💗",
  "Yes yes yes! A million times yes! 💝",
  "My heart is yours no matter what! 💞",
  "I'd love you in any form! 🌟",
];

// Image sequence showing Upama coming closer to Soumit
const TRANSITION_IMAGES = [
  {
    url: 'https://i.ibb.co.com/QjKhbqz4/close-coming-1.jpg',
    text: 'In a world full of strangers...',
    subtext: 'Two hearts destined to meet',
  },
  {
    url: 'https://i.ibb.co.com/XZ4cTxFw/close-coming-2.jpg',
    text: 'Step by step, she came closer...',
    subtext: 'Breaking through the walls of loneliness',
  },
  {
    url: 'https://i.ibb.co.com/993m5WGM/close-coming-3.jpg',
    text: 'With every moment together...',
    subtext: 'The distance between us faded',
  },
  {
    url: 'https://i.ibb.co.com/WNnL46cB/close-coming-4.jpg',
    text: 'Until finally...',
    subtext: 'You became my everything',
  },
];

export default function Section02_DesertLove({ isActive, onComplete }: SectionProps) {
  const [girlPosition, setGirlPosition] = useState(85);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showImageTransition, setShowImageTransition] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [clickRipples, setClickRipples] = useState<{id: number, x: number, y: number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dialogue states
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // Image transition sequence after game completion
  useEffect(() => {
    if (showImageTransition && currentImageIndex < TRANSITION_IMAGES.length) {
      const timer = setTimeout(() => {
        if (currentImageIndex < TRANSITION_IMAGES.length - 1) {
          setCurrentImageIndex(prev => prev + 1);
        } else {
          // After all images, show completion modal
          setTimeout(() => {
            setShowImageTransition(false);
            setShowCompletion(true);
          }, 3000);
        }
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showImageTransition, currentImageIndex]);

  // Cute dialogue cycling between Upama and Soumit
  useEffect(() => {
    if (!isActive || isComplete || showImageTransition || showCompletion) return;
    
    // Start dialogue after a brief moment
    const startDelay = setTimeout(() => {
      const dialogueCycle = () => {
        // Show girl's question
        setCurrentQuestion(UPAMA_QUESTIONS[questionIndex % UPAMA_QUESTIONS.length]);
        setShowQuestion(true);
        setShowResponse(false);
        
        // After 3 seconds, show boy's response
        setTimeout(() => {
          setCurrentResponse(SOUMIT_RESPONSES[Math.floor(Math.random() * SOUMIT_RESPONSES.length)]);
          setShowResponse(true);
        }, 2500);
        
        // Hide after showing both, then next question
        setTimeout(() => {
          setShowQuestion(false);
          setShowResponse(false);
          setQuestionIndex(prev => prev + 1);
        }, 5500);
      };
      
      dialogueCycle();
      const intervalId = setInterval(dialogueCycle, 7000);
      
      return () => clearInterval(intervalId);
    }, 2000);
    
    return () => clearTimeout(startDelay);
  }, [isActive, isComplete, showImageTransition, showCompletion, questionIndex]);

  // =============== MEMOIZED PARTICLE GENERATORS ===============
  const stars = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 3 + 1,
      twinkleDelay: Math.random() * 3,
      brightness: Math.random() * 0.5 + 0.5,
    })), []
  );

  const dustParticles = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      opacity: Math.random() * 0.5 + 0.2,
    })), []
  );

  const clouds = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 20,
      y: 5 + Math.random() * 25,
      scale: Math.random() * 0.5 + 0.8,
      speed: Math.random() * 40 + 60,
      opacity: Math.random() * 0.4 + 0.4,
    })), []
  );

  const grassBlades = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: (i / 60) * 100,
      height: Math.random() * 30 + 20,
      delay: Math.random() * 2,
    })), []
  );

  // Cacti for desert scene
  const cacti = useMemo(() => [
    { id: 1, x: 5, size: 1.2, type: 'saguaro' },
    { id: 2, x: 25, size: 0.8, type: 'barrel' },
    { id: 3, x: 70, size: 1.0, type: 'saguaro' },
    { id: 4, x: 92, size: 0.9, type: 'barrel' },
    { id: 5, x: 45, size: 0.7, type: 'prickly' },
  ], []);

  // Snakes for desert scene
  const snakes = useMemo(() => [
    { id: 1, startX: -5, y: 78, delay: 0, duration: 15 },
    { id: 2, startX: 105, y: 82, delay: 8, duration: 18 },
  ], []);

  // Tumbleweeds
  const tumbleweeds = useMemo(() => [
    { id: 1, y: 75, delay: 0, duration: 12, size: 25 },
    { id: 2, y: 80, delay: 5, duration: 15, size: 20 },
    { id: 3, y: 72, delay: 10, duration: 10, size: 30 },
  ], []);

  // Desert lizards
  const lizards = useMemo(() => [
    { id: 1, x: 20, y: 76, delay: 2, duration: 8 },
    { id: 2, x: 60, y: 79, delay: 7, duration: 6 },
  ], []);

  // Scorpions
  const scorpions = useMemo(() => [
    { id: 1, x: 35, y: 81, delay: 0, duration: 12 },
    { id: 2, x: 80, y: 78, delay: 4, duration: 10 },
  ], []);

  // Desert rocks
  const rocks = useMemo(() => [
    { id: 1, x: 12, y: 74, size: 40 },
    { id: 2, x: 55, y: 76, size: 30 },
    { id: 3, x: 78, y: 73, size: 35 },
    { id: 4, x: 88, y: 77, size: 25 },
  ], []);

  // Vultures circling
  const vultures = useMemo(() => [
    { id: 1, x: 25, y: 15, delay: 0, duration: 8 },
    { id: 2, x: 70, y: 20, delay: 3, duration: 10 },
  ], []);

  // =============== DYNAMIC ELEMENTS BASED ON PROGRESS ===============
  const [raindrops, setRaindrops] = useState<Particle[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [musicNotes, setMusicNotes] = useState<Particle[]>([]);
  const [birds, setBirds] = useState<Bird[]>([]);
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [fireflies, setFireflies] = useState<Particle[]>([]);
  const [petals, setPetals] = useState<Particle[]>([]);

  // Calculate progress
  useEffect(() => {
    const distance = Math.abs(girlPosition - 15);
    const newProgress = Math.max(0, Math.min(100, ((70 - distance) / 70) * 100));
    setProgress(newProgress);
  }, [girlPosition]);

  // Generate raindrops
  useEffect(() => {
    if (progress > 20) {
      const count = Math.floor((progress - 20) / 3);
      setRaindrops(Array.from({ length: Math.min(count * 4, 80) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 0,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 0.4 + 0.4,
      })));
    } else {
      setRaindrops([]);
    }
  }, [progress]);

  // Generate flowers
  useEffect(() => {
    if (progress > 25) {
      const count = Math.floor((progress - 25) / 4);
      setFlowers(Array.from({ length: Math.min(count, 25) }, (_, i) => ({
        id: i,
        x: 5 + (i * 3.5) + Math.random() * 2,
        y: Math.random() * 10,
        type: FLOWER_TYPES[i % FLOWER_TYPES.length],
        scale: 0.7 + Math.random() * 0.6,
        delay: i * 0.08,
        rotation: Math.random() * 20 - 10,
      })));
    } else {
      setFlowers([]);
    }
  }, [progress]);

  // Generate music notes
  useEffect(() => {
    if (progress > 45) {
      const count = Math.floor((progress - 45) / 5);
      setMusicNotes(Array.from({ length: Math.min(count * 3, 20) }, (_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        y: 30 + Math.random() * 40,
        size: Math.random() * 1.5 + 1,
        delay: i * 0.4,
        duration: 4 + Math.random() * 2,
      })));
    } else {
      setMusicNotes([]);
    }
  }, [progress]);

  // Generate birds
  useEffect(() => {
    if (progress > 40) {
      const count = Math.floor((progress - 40) / 15);
      setBirds(Array.from({ length: Math.min(count, 5) }, (_, i) => ({
        id: i,
        startX: -10 - i * 5,
        y: 10 + i * 8 + Math.random() * 10,
        delay: i * 2,
        duration: 12 + Math.random() * 5,
      })));
    } else {
      setBirds([]);
    }
  }, [progress]);

  // Generate butterflies
  useEffect(() => {
    if (progress > 55) {
      const count = Math.floor((progress - 55) / 10);
      setButterflies(Array.from({ length: Math.min(count, 8) }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 40 + Math.random() * 30,
        color: BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length],
        delay: i * 0.5,
      })));
    } else {
      setButterflies([]);
    }
  }, [progress]);

  // Generate fireflies
  useEffect(() => {
    if (progress > 70) {
      const count = Math.floor((progress - 70) / 5);
      setFireflies(Array.from({ length: Math.min(count * 3, 30) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 30 + Math.random() * 50,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
      })));
    } else {
      setFireflies([]);
    }
  }, [progress]);

  // Generate floating petals
  useEffect(() => {
    if (progress > 60) {
      const count = Math.floor((progress - 60) / 5);
      setPetals(Array.from({ length: Math.min(count * 2, 25) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 1.5 + 0.8,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 6,
      })));
    } else {
      setPetals([]);
    }
  }, [progress]);

  // Handle interaction - bidirectional movement
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isComplete) return;

    // Get click position
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Handle both touch and mouse events
    let clientX: number, clientY: number;
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }
    
    const clickX = ((clientX - rect.left) / rect.width) * 100;

    // Add ripple effect
    const ripple = {
      id: Date.now(),
      x: clickX,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
    setClickRipples(prev => [...prev.slice(-5), ripple]);

    // Determine direction based on click position relative to girl
    // Click left of girl = move toward boy (left)
    // Click right of girl = move away from boy (right)
    const moveLeft = clickX < girlPosition;

    setGirlPosition(prev => {
      let newPos;
      if (moveLeft) {
        newPos = prev - 4; // Move toward boy
      } else {
        newPos = Math.min(prev + 3, 90); // Move away from boy, max 90%
      }
      
      if (newPos <= 20) {
        setTimeout(() => {
          setIsComplete(true);
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FFD700', '#87CEEB'],
          });
          // Start image transition instead of directly showing completion
          setTimeout(() => {
            setShowImageTransition(true);
            setCurrentImageIndex(0);
          }, 1500);
        }, 800);
        return 18;
      }
      return Math.max(newPos, 18); // Don't go past the boy
    });
  }, [isComplete, girlPosition]);

  // Keyboard support - bidirectional
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;
      if (e.key === 'ArrowLeft') {
        // Move girl left (toward boy)
        setGirlPosition(prev => {
          const newPos = prev - 4;
          if (newPos <= 20) {
            setTimeout(() => {
              setIsComplete(true);
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFB6C1', '#FF69B4', '#FFC0CB', '#FFD700', '#87CEEB'],
              });
              setTimeout(() => {
                setShowImageTransition(true);
                setCurrentImageIndex(0);
              }, 1500);
            }, 800);
            return 18;
          }
          return newPos;
        });
      } else if (e.key === 'ArrowRight') {
        // Move girl right (away from boy)
        setGirlPosition(prev => Math.min(prev + 3, 90));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete]);

  if (!isActive) return null;

  // =============== DYNAMIC GRADIENTS ===============
  const getSkyGradient = () => {
    if (progress < 15) {
      // Hot desert sky - intense orange/yellow haze
      return 'linear-gradient(180deg, #1a0a00 0%, #4a1a00 15%, #8B4513 35%, #CD853F 55%, #DEB887 75%, #F4A460 100%)';
    } else if (progress < 30) {
      // Transition - clouds forming
      return 'linear-gradient(180deg, #2F1810 0%, #5D4037 20%, #8D6E63 40%, #87CEEB 70%, #B0C4DE 100%)';
    } else if (progress < 50) {
      // Rainy sky
      return 'linear-gradient(180deg, #2C3E50 0%, #34495E 25%, #5D6D7E 50%, #85929E 75%, #AAB7B8 100%)';
    } else if (progress < 70) {
      // Golden hour/sunset
      return 'linear-gradient(180deg, #1a1a2e 0%, #2d1f3d 20%, #FF6B6B 45%, #FFE66D 70%, #4ECDC4 100%)';
    } else if (progress < 90) {
      // Twilight
      return 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 20%, #2d1f4d 40%, #6B5B95 60%, #FF6B9D 80%, #FFB347 100%)';
    }
    // Night with stars
    return 'linear-gradient(180deg, #0a0a15 0%, #1a1a2e 25%, #2d2d5a 50%, #533483 70%, #9B59B6 85%, #E74C3C 100%)';
  };

  const getGroundGradient = () => {
    if (progress < 30) {
      return 'linear-gradient(180deg, #C4A77D 0%, #A67B5B 50%, #8B7355 100%)';
    } else if (progress < 60) {
      return 'linear-gradient(180deg, #90B77D 0%, #6B8E4E 50%, #4A7023 100%)';
    }
    return 'linear-gradient(180deg, #7CB342 0%, #558B2F 40%, #33691E 70%, #1B5E20 100%)';
  };

  const showStars = progress > 65;
  const showAurora = progress > 80;

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen h-[100dvh] w-full relative overflow-hidden cursor-pointer select-none touch-manipulation"
      onClick={handleInteraction}
      onTouchStart={(e) => e.preventDefault()}
      onTouchEnd={handleInteraction}
    >
      {/* =============== SKY BACKGROUND =============== */}
      <motion.div 
        className="absolute inset-0"
        animate={{ background: getSkyGradient() }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* =============== STARS (visible when progress > 65) =============== */}
      <AnimatePresence>
        {showStars && stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [star.brightness * 0.3, star.brightness, star.brightness * 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2 + Math.random(),
              delay: star.twinkleDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* =============== AURORA BOREALIS (visible when progress > 80) =============== */}
      <AnimatePresence>
        {showAurora && (
          <>
            <motion.div
              className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              style={{
                background: 'linear-gradient(180deg, transparent 0%, rgba(0, 255, 127, 0.2) 30%, rgba(138, 43, 226, 0.2) 60%, transparent 100%)',
                filter: 'blur(30px)',
              }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(90deg, rgba(0,255,127,0.3) 0%, rgba(138,43,226,0.3) 50%, rgba(0,191,255,0.3) 100%)',
                    'linear-gradient(90deg, rgba(138,43,226,0.3) 0%, rgba(0,191,255,0.3) 50%, rgba(0,255,127,0.3) 100%)',
                    'linear-gradient(90deg, rgba(0,191,255,0.3) 0%, rgba(0,255,127,0.3) 50%, rgba(138,43,226,0.3) 100%)',
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
            {/* Aurora waves */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`aurora-${i}`}
                className="absolute top-0 left-0 right-0 h-[30%] pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, rgba(${i === 0 ? '0,255,127' : i === 1 ? '138,43,226' : '0,191,255'},0.15) 50%, transparent 100%)`,
                  filter: 'blur(40px)',
                }}
                animate={{
                  x: ['-10%', '10%', '-10%'],
                  scaleY: [1, 1.3, 1],
                }}
                transition={{
                  duration: 6 + i * 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* =============== DUST PARTICLES (desert phase) =============== */}
      {progress < 40 && dustParticles.map((particle) => (
        <motion.div
          key={`dust-${particle.id}`}
          className="absolute rounded-full bg-amber-200/30"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.sin(particle.id) * 50],
            opacity: [0, particle.opacity!, particle.opacity!, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* =============== CLOUDS =============== */}
      {progress > 15 && clouds.map((cloud) => (
        <motion.div
          key={`cloud-${cloud.id}`}
          className="absolute"
          style={{ top: `${cloud.y}%` }}
          initial={{ x: `${cloud.x}vw` }}
          animate={{ x: ['100vw', '-20vw'] }}
          transition={{
            duration: cloud.speed,
            repeat: Infinity,
            ease: 'linear',
            delay: cloud.id * 5,
          }}
        >
          <div
            className="relative"
            style={{
              transform: `scale(${cloud.scale})`,
              opacity: cloud.opacity * Math.min(1, (progress - 15) / 20),
            }}
          >
            <div className="w-20 h-8 bg-white/80 rounded-full blur-sm" />
            <div className="absolute -top-3 left-4 w-12 h-10 bg-white/80 rounded-full blur-sm" />
            <div className="absolute -top-1 left-10 w-10 h-8 bg-white/80 rounded-full blur-sm" />
          </div>
        </motion.div>
      ))}

      {/* =============== SUN / CELESTIAL BODY =============== */}
      <motion.div
        className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12"
        animate={{
          scale: progress > 70 ? 0.8 : 1,
          y: progress > 70 ? -20 : 0,
        }}
      >
        <motion.div
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full relative"
          animate={{
            background: progress > 70
              ? 'radial-gradient(circle, #F5F5DC 0%, #E6E6FA 50%, #DDA0DD 100%)'
              : 'radial-gradient(circle, #FFF9C4 0%, #FFD54F 50%, #FF8F00 100%)',
            boxShadow: progress > 70
              ? '0 0 60px rgba(255, 255, 224, 0.6), 0 0 120px rgba(255, 255, 224, 0.3)'
              : '0 0 80px rgba(255, 193, 7, 0.8), 0 0 160px rgba(255, 193, 7, 0.4)',
          }}
          transition={{ duration: 2 }}
        >
          {/* Sun rays */}
          {progress <= 70 && (
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 sm:w-1 h-6 sm:h-8 md:h-12 bg-gradient-to-t from-yellow-400/60 to-transparent"
                  style={{
                    left: '50%',
                    top: '-20%',
                    transformOrigin: '50% 150%',
                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* =============== HEAT HAZE (desert phase) =============== */}
      {progress < 30 && (
        <motion.div
          className="absolute bottom-[30%] left-0 right-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,200,150,0.15) 50%, transparent 100%)',
            filter: 'blur(3px)',
          }}
          animate={{ y: [0, -10, 0], scaleY: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* =============== CACTI (desert phase) =============== */}
      {progress < 40 && cacti.map((cactus) => (
        <div
          key={`cactus-${cactus.id}`}
          className="absolute bottom-[28%]"
          style={{ left: `${cactus.x}%`, transform: `scale(${cactus.size})` }}
        >
          {cactus.type === 'saguaro' && (
            <svg width="40" height="80" viewBox="0 0 40 80">
              {/* Main trunk */}
              <rect x="15" y="10" width="10" height="70" rx="5" fill="#228B22" />
              {/* Left arm */}
              <path d="M15 35 Q5 35 5 50 Q5 55 10 55 L10 45 Q10 40 15 40" fill="#228B22" />
              {/* Right arm */}
              <path d="M25 25 Q35 25 35 40 Q35 45 30 45 L30 35 Q30 30 25 30" fill="#228B22" />
              {/* Spines */}
              {[...Array(8)].map((_, i) => (
                <line key={i} x1="20" y1={15 + i * 8} x2="28" y2={13 + i * 8} stroke="#1a5c1a" strokeWidth="1" />
              ))}
              {[...Array(8)].map((_, i) => (
                <line key={i} x1="20" y1={15 + i * 8} x2="12" y2={13 + i * 8} stroke="#1a5c1a" strokeWidth="1" />
              ))}
            </svg>
          )}
          {cactus.type === 'barrel' && (
            <svg width="35" height="40" viewBox="0 0 35 40">
              <ellipse cx="17" cy="25" rx="15" ry="15" fill="#2E8B57" />
              <ellipse cx="17" cy="25" rx="12" ry="12" fill="#228B22" />
              {/* Ridges */}
              {[...Array(6)].map((_, i) => (
                <ellipse key={i} cx="17" cy="25" rx={8 + i * 1.5} ry={8 + i * 1.5} fill="none" stroke="#1a6b1a" strokeWidth="0.5" />
              ))}
              {/* Flower on top */}
              <circle cx="17" cy="12" r="4" fill="#FF6B6B" />
              <circle cx="17" cy="12" r="2" fill="#FFD93D" />
            </svg>
          )}
          {cactus.type === 'prickly' && (
            <svg width="50" height="35" viewBox="0 0 50 35">
              {/* Pads */}
              <ellipse cx="25" cy="25" rx="12" ry="8" fill="#228B22" transform="rotate(-10 25 25)" />
              <ellipse cx="15" cy="18" rx="10" ry="7" fill="#2E8B57" transform="rotate(-30 15 18)" />
              <ellipse cx="35" cy="18" rx="10" ry="7" fill="#2E8B57" transform="rotate(30 35 18)" />
              <ellipse cx="10" cy="8" rx="8" ry="5" fill="#32CD32" transform="rotate(-20 10 8)" />
            </svg>
          )}
        </div>
      ))}

      {/* =============== SNAKES (desert phase) =============== */}
      {progress < 35 && snakes.map((snake) => (
        <motion.div
          key={`snake-${snake.id}`}
          className="absolute"
          style={{ top: `${snake.y}%` }}
          initial={{ x: snake.startX < 50 ? '-10vw' : '110vw' }}
          animate={{ x: snake.startX < 50 ? '110vw' : '-10vw' }}
          transition={{ duration: snake.duration, delay: snake.delay, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="60" height="20" viewBox="0 0 60 20">
            {/* Snake body - wavy path */}
            <motion.path
              d="M0 10 Q10 5 15 10 Q20 15 25 10 Q30 5 35 10 Q40 15 45 10 Q50 5 55 10"
              fill="none"
              stroke="#8B4513"
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ d: [
                "M0 10 Q10 5 15 10 Q20 15 25 10 Q30 5 35 10 Q40 15 45 10 Q50 5 55 10",
                "M0 10 Q10 15 15 10 Q20 5 25 10 Q30 15 35 10 Q40 5 45 10 Q50 15 55 10",
                "M0 10 Q10 5 15 10 Q20 15 25 10 Q30 5 35 10 Q40 15 45 10 Q50 5 55 10",
              ]}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            {/* Head */}
            <circle cx="55" cy="10" r="4" fill="#654321" />
            {/* Eyes */}
            <circle cx="57" cy="8" r="1" fill="#FFD700" />
            {/* Tongue */}
            <motion.path
              d="M59 10 L63 8 M59 10 L63 12"
              stroke="#FF0000"
              strokeWidth="1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      ))}

      {/* =============== TUMBLEWEEDS (rolling across) =============== */}
      {progress < 50 && tumbleweeds.map((weed) => (
        <motion.div
          key={`tumbleweed-${weed.id}`}
          className="absolute"
          style={{ top: `${weed.y}%` }}
          initial={{ x: '-10vw', rotate: 0 }}
          animate={{ x: '110vw', rotate: 720 }}
          transition={{ duration: weed.duration, delay: weed.delay, repeat: Infinity, ease: 'linear' }}
        >
          <svg width={weed.size} height={weed.size} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="15" fill="none" stroke="#8B7355" strokeWidth="2" />
            <circle cx="20" cy="20" r="10" fill="none" stroke="#A0826D" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="5" fill="none" stroke="#8B7355" strokeWidth="1" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="#8B7355" strokeWidth="1" />
            <line x1="20" y1="5" x2="20" y2="35" stroke="#8B7355" strokeWidth="1" />
            <line x1="8" y1="8" x2="32" y2="32" stroke="#A0826D" strokeWidth="1" />
            <line x1="32" y1="8" x2="8" y2="32" stroke="#A0826D" strokeWidth="1" />
          </svg>
        </motion.div>
      ))}

      {/* =============== LIZARDS (scurrying) =============== */}
      {progress < 40 && lizards.map((lizard) => (
        <motion.div
          key={`lizard-${lizard.id}`}
          className="absolute"
          style={{ top: `${lizard.y}%` }}
          initial={{ x: '-5vw' }}
          animate={{ x: '105vw' }}
          transition={{ duration: lizard.duration, delay: lizard.delay, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 0.15, repeat: Infinity }}>
            <svg width="30" height="15" viewBox="0 0 30 15">
              <ellipse cx="15" cy="8" rx="8" ry="4" fill="#6B8E23" />
              <ellipse cx="24" cy="8" rx="3" ry="2" fill="#556B2F" />
              <path d="M5 8 Q-2 8 -5 5" stroke="#6B8E23" strokeWidth="2" fill="none" />
              <ellipse cx="26" cy="7" rx="1" ry="0.5" fill="#000" />
              <path d="M10 11 L8 15 M13 11 L12 15 M17 11 L18 15 M20 11 L22 15" stroke="#6B8E23" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* =============== SCORPIONS (crawling) =============== */}
      {progress < 30 && scorpions.map((scorp) => (
        <motion.div
          key={`scorpion-${scorp.id}`}
          className="absolute"
          style={{ top: `${scorp.y}%`, transform: 'scaleX(-1)' }}
          initial={{ x: '110vw' }}
          animate={{ x: '-10vw' }}
          transition={{ duration: scorp.duration, delay: scorp.delay, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="35" height="25" viewBox="0 0 35 25">
            <ellipse cx="12" cy="15" rx="8" ry="5" fill="#4A3728" />
            <ellipse cx="22" cy="15" rx="4" ry="3" fill="#3D2E22" />
            <motion.path
              d="M24 12 Q28 8 30 5 Q32 3 30 2"
              stroke="#4A3728"
              strokeWidth="3"
              fill="none"
              animate={{ d: [
                "M24 12 Q28 8 30 5 Q32 3 30 2",
                "M24 12 Q28 6 30 4 Q32 2 29 1",
                "M24 12 Q28 8 30 5 Q32 3 30 2"
              ]}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <circle cx="30" cy="2" r="2" fill="#2D1F15" />
            <path d="M5 15 L2 20 M8 16 L6 21 M16 16 L18 21 M14 16 L14 21" stroke="#4A3728" strokeWidth="1.5" />
            <ellipse cx="3" cy="13" rx="3" ry="2" fill="#3D2E22" />
            <ellipse cx="3" cy="17" rx="3" ry="2" fill="#3D2E22" />
          </svg>
        </motion.div>
      ))}

      {/* =============== DESERT ROCKS =============== */}
      {rocks.map((rock) => (
        <motion.div
          key={`rock-${rock.id}`}
          className="absolute"
          style={{ left: `${rock.x}%`, top: `${rock.y}%` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: progress < 60 ? 0.8 : 0.3,
            scale: progress < 60 ? 1 : 0.7 
          }}
          transition={{ duration: 1 }}
        >
          <svg width={rock.size} height={rock.size * 0.7} viewBox="0 0 50 35">
            <path
              d="M5 30 Q10 10 25 8 Q40 10 45 30 Z"
              fill={`url(#rockGrad-${rock.id})`}
            />
            <defs>
              <linearGradient id={`rockGrad-${rock.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B8B83" />
                <stop offset="100%" stopColor="#5C5C52" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}

      {/* =============== VULTURES (circling in sky) =============== */}
      {progress < 45 && vultures.map((vulture) => (
        <motion.div
          key={`vulture-${vulture.id}`}
          className="absolute"
          style={{ top: `${vulture.y}%`, left: `${vulture.x}%` }}
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -10, 0, 10, 0],
            rotate: [0, 15, 0, -15, 0],
          }}
          transition={{ duration: vulture.duration, delay: vulture.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="40" height="30" viewBox="0 0 40 30" opacity={0.7}>
            <motion.path
              d="M20 15 Q10 10 2 5 M20 15 Q30 10 38 5"
              stroke="#2C2C2C"
              strokeWidth="3"
              fill="none"
              animate={{ d: [
                "M20 15 Q10 10 2 5 M20 15 Q30 10 38 5",
                "M20 15 Q10 18 2 20 M20 15 Q30 18 38 20",
                "M20 15 Q10 10 2 5 M20 15 Q30 10 38 5"
              ]}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <ellipse cx="20" cy="15" rx="4" ry="3" fill="#1C1C1C" />
            <circle cx="20" cy="12" r="2" fill="#8B0000" />
          </svg>
        </motion.div>
      ))}

      {/* =============== FLOATING HEARTS (appear as progress increases) =============== */}
      {progress > 30 && (
        <>
          {Array.from({ length: Math.floor(progress / 15) }).map((_, i) => (
            <motion.div
              key={`heart-${i}`}
              className="absolute text-xl pointer-events-none"
              style={{ left: `${10 + (i * 20) % 80}%` }}
              initial={{ bottom: '30%', opacity: 0, scale: 0 }}
              animate={{
                bottom: ['30%', '80%'],
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.8],
                x: [0, (i % 2 === 0 ? 20 : -20), 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                delay: i * 0.8,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              💕
            </motion.div>
          ))}
        </>
      )}

      {/* =============== SPARKLE PARTICLES (love energy) =============== */}
      {progress > 50 && (
        <>
          {Array.from({ length: Math.floor((progress - 50) / 5) }).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${20 + Math.random() * 50}%`,
                background: `radial-gradient(circle, ${i % 2 === 0 ? '#FFD700' : '#FF69B4'} 0%, transparent 70%)`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          ))}
        </>
      )}

      {/* =============== RAINDROPS =============== */}
      <AnimatePresence>
        {raindrops.map((drop) => (
          <motion.div
            key={`rain-${drop.id}`}
            className="absolute bg-gradient-to-b from-blue-300/80 to-blue-400/40 rounded-full"
            style={{
              left: `${drop.x}%`,
              width: drop.size,
              height: drop.size * 8,
            }}
            initial={{ top: '-5%', opacity: 0 }}
            animate={{
              top: '105%',
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: drop.duration,
              delay: drop.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </AnimatePresence>

      {/* =============== BIRDS =============== */}
      <AnimatePresence>
        {birds.map((bird) => (
          <motion.div
            key={`bird-${bird.id}`}
            className="absolute text-2xl"
            style={{ top: `${bird.y}%` }}
            initial={{ x: `${bird.startX}vw`, opacity: 0 }}
            animate={{
              x: '120vw',
              opacity: [0, 1, 1, 0],
              y: [0, -15, 5, -10, 0],
            }}
            transition={{
              duration: bird.duration,
              delay: bird.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            🕊️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* =============== GROUND =============== */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[35%]"
        animate={{ background: getGroundGradient() }}
        transition={{ duration: 1.5 }}
      />

      {/* =============== GRASS BLADES (when green) =============== */}
      {progress > 35 && (
        <div className="absolute bottom-[25%] left-0 right-0 h-[15%] overflow-hidden">
          {grassBlades.map((blade) => (
            <motion.div
              key={`grass-${blade.id}`}
              className="absolute bottom-0 w-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full origin-bottom"
              style={{
                left: `${blade.x}%`,
                height: blade.height * Math.min(1, (progress - 35) / 30),
              }}
              animate={{
                skewX: [-5, 5, -5],
                scaleY: [1, 1.05, 1],
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: blade.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* =============== FLOWERS =============== */}
      <div className="absolute bottom-[22%] left-0 right-0">
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={`flower-${flower.id}`}
              className="absolute"
              style={{ left: `${flower.x}%`, bottom: flower.y }}
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{
                scale: flower.scale,
                y: 0,
                opacity: 1,
                rotate: [flower.rotation - 5, flower.rotation + 5, flower.rotation - 5],
              }}
              transition={{
                scale: { delay: flower.delay, duration: 0.6, type: 'spring' },
                rotate: { delay: flower.delay + 0.6, duration: 3, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {/* Stem */}
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1 origin-bottom"
                style={{ height: 20 + Math.random() * 10 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: flower.delay, duration: 0.3 }}
              >
                <div className="w-full h-full bg-gradient-to-t from-green-700 to-green-500 rounded-full" />
              </motion.div>
              {/* Flower */}
              <span className="text-2xl md:text-4xl drop-shadow-lg">{flower.type}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* =============== BUTTERFLIES =============== */}
      <AnimatePresence>
        {butterflies.map((butterfly) => (
          <motion.div
            key={`butterfly-${butterfly.id}`}
            className="absolute text-xl md:text-2xl"
            style={{ color: butterfly.color }}
            initial={{ left: `${butterfly.x}%`, top: `${butterfly.y}%`, opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0.8, 1],
              x: [0, 30, -20, 40, 0],
              y: [0, -20, 10, -30, 0],
              rotate: [0, 10, -10, 5, 0],
            }}
            transition={{
              duration: 8,
              delay: butterfly.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🦋
          </motion.div>
        ))}
      </AnimatePresence>

      {/* =============== FIREFLIES =============== */}
      <AnimatePresence>
        {fireflies.map((firefly) => (
          <motion.div
            key={`firefly-${firefly.id}`}
            className="absolute rounded-full"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              width: firefly.size,
              height: firefly.size,
              background: 'radial-gradient(circle, #FFFF00 0%, #FFD700 50%, transparent 100%)',
              boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.3, 1, 0],
              scale: [0.5, 1.2, 0.8, 1, 0.5],
              x: [0, 20, -10, 15, 0],
              y: [0, -15, 10, -5, 0],
            }}
            transition={{
              duration: firefly.duration,
              delay: firefly.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* =============== FLOATING PETALS =============== */}
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.div
            key={`petal-${petal.id}`}
            className="absolute text-lg"
            style={{ left: `${petal.x}%` }}
            initial={{ top: '-5%', opacity: 0, rotate: 0 }}
            animate={{
              top: '105%',
              opacity: [0, 0.9, 0.9, 0],
              rotate: [0, 180, 360, 540],
              x: [0, 30, -20, 40, 0],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🌸
          </motion.div>
        ))}
      </AnimatePresence>

      {/* =============== MUSIC NOTES =============== */}
      <AnimatePresence>
        {musicNotes.map((note, i) => (
          <motion.div
            key={`note-${note.id}`}
            className="absolute text-xl md:text-3xl"
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              color: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98'][i % 4],
              textShadow: '0 0 10px currentColor',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.3, 1, 0.8],
              y: [0, -80],
              x: [0, Math.sin(note.id) * 40],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: note.duration,
              delay: note.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          >
            {MUSIC_NOTES[note.id % MUSIC_NOTES.length]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* =============== CLICK RIPPLES =============== */}
      <AnimatePresence>
        {clickRipples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 -ml-8 -mt-8 rounded-full border-2 border-pink-400/60" />
            <div className="absolute inset-0 w-16 h-16 -ml-8 -mt-8 rounded-full border border-white/40" 
                 style={{ transform: 'scale(0.7)' }} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* =============== THE BOY =============== */}
      <motion.div
        className="absolute bottom-[22%] sm:bottom-[26%] flex flex-col items-center z-10"
        style={{ left: '15%' }}
        animate={{ scale: isComplete ? 1.1 : 1 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute rounded-full -z-10"
          style={{ width: 50, height: 70, top: -3, left: -7 }}
          animate={{
            boxShadow: isComplete
              ? '0 0 40px rgba(100, 149, 237, 0.6), 0 0 80px rgba(65, 105, 225, 0.4)'
              : '0 0 15px rgba(0, 0, 0, 0.3)',
          }}
        />
        {/* Boy image */}
        <motion.div
          className="relative"
          animate={{
            x: isComplete ? 0 : [0, -2, 2, -1, 1, 0],
          }}
          transition={{ x: { duration: 0.8, repeat: isComplete ? 0 : Infinity } }}
        >
          <img
            src="https://i.ibb.co.com/BXqzP1K/boy.png"
            alt="Boy"
            className="w-8 h-11 sm:w-10 sm:h-14 md:w-12 md:h-16 lg:w-16 lg:h-20 object-cover rounded-lg drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(65, 105, 225, 0.5))',
            }}
          />
        </motion.div>
        {/* Emotion bubble */}
        <AnimatePresence mode="wait">
          {!isComplete && progress < 70 && !showResponse && (
            <motion.div
              key="lonely"
              className="absolute -top-6 sm:-top-8 -right-3 sm:-right-4 text-sm sm:text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: [0.8, 1, 0.8], y: [0, -3, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💭
            </motion.div>
          )}
          {(progress >= 70 || isComplete) && (
            <motion.div
              key="love"
              className="absolute -top-6 sm:-top-8 -right-3 sm:-right-4 text-sm sm:text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Soumit's response speech bubble */}
        <AnimatePresence>
          {showResponse && currentResponse && !isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: -10 }}
              transition={{ type: 'spring', damping: 12 }}
              className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/4 z-30 w-28 sm:w-36 md:w-44"
            >
              <div className="bg-gradient-to-br from-blue-500/95 to-indigo-600/95 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg border border-white/30 relative">
                <p className="text-[10px] sm:text-xs md:text-sm text-white text-center leading-tight">
                  {currentResponse}
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 left-1/4 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-blue-500/95" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* =============== THE GIRL =============== */}
      <motion.div
        className="absolute bottom-[22%] sm:bottom-[26%] flex flex-col items-center z-10"
        animate={{ left: `${girlPosition}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
      >
        {/* Aura glow */}
        <motion.div
          className="absolute rounded-full -z-10"
          style={{ width: 60, height: 80, top: -8, left: -12 }}
          animate={{
            boxShadow: [
              '0 0 30px rgba(255, 105, 180, 0.5)',
              '0 0 50px rgba(255, 182, 193, 0.7)',
              '0 0 30px rgba(255, 105, 180, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Girl image */}
        <motion.div
          className="relative"
          animate={{
            scaleX: girlPosition > 50 ? 1 : -1,
          }}
        >
          <img
            src="https://i.ibb.co.com/BVTBVNPd/girl.png"
            alt="Girl"
            className="w-8 h-11 sm:w-10 sm:h-14 md:w-12 md:h-16 lg:w-16 lg:h-20 object-cover rounded-lg drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(255, 105, 180, 0.5))',
            }}
          />
        </motion.div>
        {/* Floating hearts trail */}
        <motion.div className="absolute -top-4 sm:-top-6 flex gap-1">
          {['💕', '💖', '💗'].map((heart, i) => (
            <motion.span
              key={i}
              className="text-xs sm:text-sm md:text-base"
              animate={{
                opacity: [0, 1, 0],
                y: [-3, -20],
                scale: [0.5, 1, 0.7],
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.25,
                repeat: Infinity,
              }}
            >
              {heart}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Upama's question speech bubble */}
        <AnimatePresence>
          {showQuestion && currentQuestion && !isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: -10 }}
              transition={{ type: 'spring', damping: 12 }}
              className="absolute -top-20 sm:-top-24 md:-top-28 right-0 translate-x-1/4 z-30 w-36 sm:w-44 md:w-52"
            >
              <motion.div 
                className="bg-gradient-to-br from-pink-500/95 to-rose-600/95 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg border border-white/30 relative"
                animate={{ rotate: [-1, 1, -1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-[10px] sm:text-xs md:text-sm text-white text-center leading-tight font-medium">
                  {currentQuestion}
                </p>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 right-1/4 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-pink-500/95" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* =============== HEARTS BETWEEN THEM (when close) =============== */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute bottom-[35%] sm:bottom-[40%] z-20"
            style={{ left: '16%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {['❤️', '💕', '💖', '💗', '💓', '💞', '💝'].map((heart, i) => (
              <motion.span
                key={i}
                className="absolute text-lg sm:text-2xl md:text-5xl"
                style={{ left: i * 10, top: Math.sin(i) * 15 }}
                animate={{
                  y: [0, -25, 0],
                  scale: [1, 1.4, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
              >
                {heart}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden">{progress}</div>



      {/* =============== IMAGE TRANSITION SEQUENCE =============== */}
      <AnimatePresence>
        {showImageTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black"
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
            
            {/* Animated particles in background */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-pink-400/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -50],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}

            {/* Image container with crossfade */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {/* Image with cinematic styling */}
                  <div className="relative w-[95%] sm:w-[90%] md:w-[70%] max-w-2xl aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />
                    
                    {/* The image */}
                    <motion.img
                      src={TRANSITION_IMAGES[currentImageIndex].url}
                      alt={`Upama coming closer - ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 3.5, ease: 'easeOut' }}
                    />
                    
                    {/* Soft glow border */}
                    <div className="absolute inset-0 border-2 border-white/20 rounded-2xl z-20" />
                    <motion.div 
                      className="absolute inset-0 rounded-2xl z-20"
                      animate={{
                        boxShadow: [
                          'inset 0 0 30px rgba(255, 105, 180, 0.3)',
                          'inset 0 0 60px rgba(255, 182, 193, 0.4)',
                          'inset 0 0 30px rgba(255, 105, 180, 0.3)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Text overlay */}
                  <div className="absolute bottom-[10%] sm:bottom-[15%] left-0 right-0 text-center z-30 px-4 sm:px-6">
                    <motion.h3
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3"
                      style={{
                        textShadow: '0 0 40px rgba(255, 105, 180, 0.8), 0 4px 20px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      {TRANSITION_IMAGES[currentImageIndex].text}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 italic"
                      style={{
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      {TRANSITION_IMAGES[currentImageIndex].subtext}
                    </motion.p>
                  </div>

                  {/* Image counter */}
                  <div className="absolute top-6 right-6 z-30">
                    <div className="flex gap-2">
                      {TRANSITION_IMAGES.map((_, i) => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i === currentImageIndex ? 'bg-pink-400' : 'bg-white/30'
                          }`}
                          animate={i === currentImageIndex ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Hearts floating up */}
                  {['❤️', '💕', '💖', '💗', '💓'].map((heart, i) => (
                    <motion.div
                      key={`heart-${i}`}
                      className="absolute text-lg sm:text-2xl md:text-3xl z-20"
                      style={{ left: `${15 + i * 18}%`, bottom: '10%' }}
                      animate={{
                        y: [0, -100, -200],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.8],
                        x: [0, Math.sin(i) * 30, Math.cos(i) * 20],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.4,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    >
                      {heart}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Names at bottom */}
            <motion.div
              className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.p
                className="text-base sm:text-xl md:text-2xl font-light tracking-widest"
                style={{
                  background: 'linear-gradient(90deg, #FFB6C1, #FF69B4, #FFB6C1)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Upama & Soumit
              </motion.p>
            </motion.div>

            {/* Skip button */}
            <motion.button
              onClick={() => {
                setShowImageTransition(false);
                setShowCompletion(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setShowImageTransition(false);
                setShowCompletion(true);
              }}
              className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 text-white/50 hover:text-white/90 text-sm transition-colors touch-manipulation px-3 py-2 min-h-[44px] min-w-[44px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
            >
              Skip →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =============== COMPLETION OVERLAY =============== */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-30"
          >
            {/* Backdrop with particles */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/30 to-black/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            
            {/* Sparkles around modal */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', delay: 0.3, stiffness: 100 }}
              className="relative bg-gradient-to-br from-white/95 via-pink-50/95 to-purple-50/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 mx-4 max-w-lg text-center shadow-2xl border border-white/50"
            >
              {/* Decorative elements */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  ✨
                </motion.div>
              </div>

              <motion.div
                className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💑
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                Love Transforms Everything
              </h3>
              
              <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm md:text-base">
                In the desert of loneliness, your presence brought <span className="text-blue-500 font-medium">rain</span> to my parched heart,{' '}
                <span className="text-pink-500 font-medium">flowers</span> to my barren soul, and{' '}
                <span className="text-purple-500 font-medium">music</span> to my silent world.
              </p>
              
              <motion.p
                className="text-base sm:text-lg md:text-xl font-medium italic mb-6 sm:mb-8"
                style={{
                  background: 'linear-gradient(90deg, #FF69B4, #9B59B6, #FF69B4)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "You are the miracle I was waiting for"
              </motion.p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={onComplete} variant="primary" size="lg">
                  Continue Our Story 💕
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
