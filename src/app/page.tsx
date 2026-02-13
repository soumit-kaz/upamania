'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { SECTION_COUNT } from '@/config/constants';

// Sections
import Section00_Loading from '@/components/Sections/Section00_Loading';
import Section01_StarCollector from '@/components/Sections/Section01_StarCollector';
import Section02_DesertLove from '@/components/Sections/Section02_DesertLove';
import Section03_Ending from '@/components/Sections/Section03_Ending';

// Layout
import Navigation from '@/components/Layout/Navigation';
import ProgressBar from '@/components/Layout/ProgressBar';
import AudioPlayer from '@/components/Layout/AudioPlayer';

export default function Home() {
  const { currentSection, setCurrentSection, completeSection, completedSections } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Ensure client-side rendering for hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSectionComplete = useCallback(() => {
    completeSection(currentSection);
    
    if (currentSection < SECTION_COUNT - 1) {
      setCurrentSection(currentSection + 1);
    }
  }, [currentSection, completeSection, setCurrentSection]);

  const handleLoadingComplete = useCallback(() => {
    setHasStarted(true);
    setCurrentSection(1);
  }, [setCurrentSection]);

  // Keyboard navigation (optional - for testing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow dev navigation with Ctrl/Cmd + Arrow keys
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        if (currentSection < SECTION_COUNT - 1) {
          setCurrentSection(currentSection + 1);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        if (currentSection > 0) {
          setCurrentSection(currentSection - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, setCurrentSection]);

  if (!isClient) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const sectionProps = {
    isActive: true,
    onComplete: handleSectionComplete,
  };

  return (
    <main className="h-screen h-[100dvh] w-full overflow-hidden relative bg-black">
      {/* Progress Bar */}
      {hasStarted && currentSection > 0 && currentSection < SECTION_COUNT - 1 && (
        <ProgressBar />
      )}

      {/* Audio Player */}
      {hasStarted && currentSection > 0 && (
        <AudioPlayer />
      )}

      {/* Navigation - always visible after starting */}
      {hasStarted && currentSection > 0 && currentSection < SECTION_COUNT && (
        <Navigation />
      )}

      {/* Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {currentSection === 0 && (
            <Section00_Loading isActive={true} onComplete={handleLoadingComplete} />
          )}
          {currentSection === 1 && <Section01_StarCollector {...sectionProps} />}
          {currentSection === 2 && <Section02_DesertLove {...sectionProps} />}
          {currentSection === 3 && <Section03_Ending {...sectionProps} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
