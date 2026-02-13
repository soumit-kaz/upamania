'use client';

import { useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { CONSTANTS } from '@/config/constants';

export function useProgress() {
  const {
    currentSection,
    completedSections,
    setCurrentSection,
    completeSection,
    nextSection,
    previousSection,
  } = useStore();

  const isSectionCompleted = useCallback(
    (sectionIndex: number) => {
      return completedSections.includes(sectionIndex);
    },
    [completedSections]
  );

  const isSectionUnlocked = useCallback(
    (sectionIndex: number) => {
      // All sections are unlocked - allow free navigation
      return sectionIndex >= 0 && sectionIndex < CONSTANTS.TOTAL_SECTIONS;
    },
    []
  );

  const canGoNext = useCallback(() => {
    // Allow moving forward anytime (not just when completed)
    return currentSection < CONSTANTS.TOTAL_SECTIONS - 1;
  }, [currentSection]);

  const canGoPrevious = useCallback(() => {
    return currentSection > 1; // Don't go back to loading screen
  }, [currentSection]);

  const getProgress = useCallback(() => {
    // Don't count loading section (0) in progress
    const actualCompleted = completedSections.filter((s) => s > 0).length;
    const actualTotal = CONSTANTS.TOTAL_SECTIONS - 1; // Exclude loading
    
    return {
      completed: actualCompleted,
      total: actualTotal,
      percentage: Math.round((actualCompleted / actualTotal) * 100),
    };
  }, [completedSections]);

  const goToSection = useCallback(
    (sectionIndex: number) => {
      if (isSectionUnlocked(sectionIndex)) {
        setCurrentSection(sectionIndex);
      }
    },
    [isSectionUnlocked, setCurrentSection]
  );

  return {
    currentSection,
    completedSections,
    setCurrentSection,
    completeSection,
    nextSection,
    previousSection,
    isSectionCompleted,
    isSectionUnlocked,
    canGoNext,
    canGoPrevious,
    getProgress,
    goToSection,
  };
}
