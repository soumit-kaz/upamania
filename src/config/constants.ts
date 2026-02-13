// Application constants
export const SECTION_COUNT = 4; // 0-3

export const CONSTANTS = {
  // Total number of sections
  TOTAL_SECTIONS: 4, // 0-3

  // Animation durations (in seconds)
  ANIMATION: {
    FAST: 0.3,
    NORMAL: 0.5,
    SLOW: 0.8,
    VERY_SLOW: 1.5,
  },

  // Local storage keys
  STORAGE_KEYS: {
    PROGRESS: 'romantic-journey-progress',
    COMPLETED_SECTIONS: 'romantic-journey-completed',
    TIME_CAPSULE: 'romantic-journey-time-capsule',
    AUDIO_VOLUME: 'romantic-journey-volume',
    AUDIO_MUTED: 'romantic-journey-muted',
  },

  // Section names for reference
  SECTIONS: [
    'Loading',           // 0
    'StarCollector',     // 1
    'DesertLove',        // 2
    'Ending',            // 3
  ],

  // Flower types for garden section
  FLOWERS: ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹'],

  // Colors for various elements
  COLORS: {
    PINK: ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFB3D9', '#FFA0CC', '#FF8CBF'],
    PASTEL: ['#FFE4E1', '#FFF0F5', '#E6E6FA', '#F0FFF0', '#FFF8DC', '#E0FFFF'],
    GOLD: '#FFD700',
    SILVER: '#C0C0C0',
  },
};
