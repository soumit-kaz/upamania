'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { useStore } from '@/store/useStore';

interface UseAudioOptions {
  src: string;
  loop?: boolean;
  volume?: number;
  autoplay?: boolean;
}

interface UseAudioReturn {
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  isLoaded: boolean;
  error: string | null;
}

export function useAudio(options: UseAudioOptions): UseAudioReturn {
  const { src, loop = false, volume: initialVolume = 0.7, autoplay = false } = options;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const soundRef = useRef<Howl | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { audioVolume, isMuted, setAudioPlaying } = useStore();

  // Initialize Howl
  useEffect(() => {
    if (!src || src.includes('YOUR_')) {
      // Placeholder URL, don't load
      return;
    }

    soundRef.current = new Howl({
      src: [src],
      html5: true,
      loop,
      volume: isMuted ? 0 : initialVolume * audioVolume,
      onload: () => {
        setIsLoaded(true);
        setDuration(soundRef.current?.duration() || 0);
      },
      onloaderror: (_, err) => {
        setError(`Failed to load audio: ${err}`);
        setIsLoaded(false);
      },
      onplay: () => {
        setIsPlaying(true);
        setAudioPlaying(true);
        // Start tracking current time
        timeIntervalRef.current = setInterval(() => {
          if (soundRef.current) {
            setCurrentTime(soundRef.current.seek() as number);
          }
        }, 100);
      },
      onpause: () => {
        setIsPlaying(false);
        setAudioPlaying(false);
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      },
      onstop: () => {
        setIsPlaying(false);
        setAudioPlaying(false);
        setCurrentTime(0);
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      },
      onend: () => {
        if (!loop) {
          setIsPlaying(false);
          setAudioPlaying(false);
          setCurrentTime(0);
        }
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      },
    });

    // Autoplay if specified
    if (autoplay && soundRef.current) {
      soundRef.current.play();
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [src, loop, initialVolume, autoplay]);

  // Update volume when global settings change
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : initialVolume * audioVolume);
    }
  }, [audioVolume, isMuted, initialVolume]);

  const play = useCallback(() => {
    if (soundRef.current && isLoaded) {
      soundRef.current.play();
    }
  }, [isLoaded]);

  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (soundRef.current) {
      soundRef.current.volume(Math.max(0, Math.min(1, volume)));
    }
  }, []);

  return {
    play,
    pause,
    stop,
    toggle,
    seek,
    setVolume,
    isPlaying,
    duration,
    currentTime,
    isLoaded,
    error,
  };
}
