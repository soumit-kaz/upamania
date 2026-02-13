// TypeScript type definitions

export interface SectionProps {
  isActive: boolean;
  onComplete: () => void;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  collected: boolean;
  isLast: boolean;
}

export interface BottleCard {
  id: number;
  pairId: number;
  type: 'message' | 'meaning';
  content: string;
  isOpen: boolean;
  isMatched: boolean;
}

export interface Flower {
  id: number;
  x: number;
  y: number;
  type: string;
  memory: string;
}

export interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number;
  backgroundPosition: { x: number; y: number };
  isCorrect: boolean;
}

export interface Butterfly {
  id: number;
  quality: string;
  color: string;
  position: { x: number; y: number };
  caught: boolean;
}

export interface KissType {
  type: string;
  color: string;
  meaning: string;
}

export interface MoonPhase {
  phase: string;
  emoji: string;
  title: string;
  description: string;
  date: string;
  mood: string;
}

export interface Fortune {
  text: string;
  shown: boolean;
}

export interface StoryScenario {
  scene: string;
  description: string;
  emoji: string;
  choices: {
    text: string;
    outcome: string;
  }[];
}

export interface TimeCapsuleMessage {
  text: string;
  createdDate: string;
  unlockDate: string;
  authorName: string;
  isUnlocked: boolean;
  yourReply: string;
}

export interface ConstellationStar {
  id: number;
  x: number;
  y: number;
  connected: boolean;
}

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    type: 'words' | 'time' | 'gifts' | 'touch';
  }[];
}

export interface LoveLanguageResult {
  icon: string;
  title: string;
  description: string;
  message: string;
}

export type LoveLanguageType = 'words' | 'time' | 'gifts' | 'touch';

export interface GlobalState {
  currentSection: number;
  completedSections: Set<number>;
  isAudioPlaying: boolean;
  audioVolume: number;
  isMuted: boolean;
  setCurrentSection: (section: number) => void;
  completeSection: (section: number) => void;
  nextSection: () => void;
  previousSection: () => void;
  setAudioPlaying: (playing: boolean) => void;
  setAudioVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
}
