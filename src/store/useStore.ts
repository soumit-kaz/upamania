import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CONSTANTS } from '@/config/constants';

interface GlobalState {
  currentSection: number;
  completedSections: number[];
  isAudioPlaying: boolean;
  audioVolume: number;
  isMuted: boolean;
  isLoading: boolean;
  
  // Actions
  setCurrentSection: (section: number) => void;
  completeSection: (section: number) => void;
  nextSection: () => void;
  previousSection: () => void;
  setAudioPlaying: (playing: boolean) => void;
  setAudioVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setLoading: (loading: boolean) => void;
  resetProgress: () => void;
}

export const useStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      currentSection: 0,
      completedSections: [],
      isAudioPlaying: false,
      audioVolume: 0.7,
      isMuted: false,
      isLoading: true,

      setCurrentSection: (section: number) => {
        if (section >= 0 && section < CONSTANTS.TOTAL_SECTIONS) {
          set({ currentSection: section });
        }
      },

      completeSection: (section: number) => {
        const { completedSections } = get();
        if (!completedSections.includes(section)) {
          set({ completedSections: [...completedSections, section] });
        }
      },

      nextSection: () => {
        const { currentSection, completedSections } = get();
        const nextSection = currentSection + 1;
        
        // Only allow progression if current section is completed or we're moving to section 0/1
        if (nextSection < CONSTANTS.TOTAL_SECTIONS) {
          if (completedSections.includes(currentSection) || currentSection === 0) {
            set({ currentSection: nextSection });
          }
        }
      },

      previousSection: () => {
        const { currentSection } = get();
        if (currentSection > 1) { // Don't go back to loading screen
          set({ currentSection: currentSection - 1 });
        }
      },

      setAudioPlaying: (playing: boolean) => set({ isAudioPlaying: playing }),
      setAudioVolume: (volume: number) => set({ audioVolume: Math.max(0, Math.min(1, volume)) }),
      setMuted: (muted: boolean) => set({ isMuted: muted }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      resetProgress: () => set({
        currentSection: 0,
        completedSections: [],
        isLoading: true,
      }),
    }),
    {
      name: 'romantic-journey-storage',
      partialize: (state) => ({
        completedSections: state.completedSections,
        audioVolume: state.audioVolume,
        isMuted: state.isMuted,
      }),
    }
  )
);
