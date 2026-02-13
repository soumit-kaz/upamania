'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsInitialized(true);
  }, [key]);

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Only return the stored value after initialization to prevent hydration mismatch
  return [isInitialized ? storedValue : initialValue, setValue, removeValue];
}

// Hook for managing progress specifically
export function useProgress() {
  const [completedSections, setCompletedSections] = useLocalStorage<number[]>(
    'romantic-journey-completed',
    []
  );

  const [currentSection, setCurrentSection] = useLocalStorage<number>(
    'romantic-journey-current',
    0
  );

  const completeSection = useCallback(
    (sectionIndex: number) => {
      setCompletedSections((prev) => {
        if (!prev.includes(sectionIndex)) {
          return [...prev, sectionIndex];
        }
        return prev;
      });
    },
    [setCompletedSections]
  );

  const isSectionCompleted = useCallback(
    (sectionIndex: number) => {
      return completedSections.includes(sectionIndex);
    },
    [completedSections]
  );

  const isSectionUnlocked = useCallback(
    (sectionIndex: number) => {
      // First section is always unlocked
      if (sectionIndex === 0 || sectionIndex === 1) return true;
      // Other sections unlocked if previous section is completed
      return completedSections.includes(sectionIndex - 1);
    },
    [completedSections]
  );

  const resetProgress = useCallback(() => {
    setCompletedSections([]);
    setCurrentSection(0);
  }, [setCompletedSections, setCurrentSection]);

  const getProgress = useCallback(() => {
    return {
      completed: completedSections.length,
      total: 21, // Total sections (0-20)
      percentage: Math.round((completedSections.length / 21) * 100),
    };
  }, [completedSections]);

  return {
    completedSections,
    currentSection,
    setCurrentSection,
    completeSection,
    isSectionCompleted,
    isSectionUnlocked,
    resetProgress,
    getProgress,
  };
}
