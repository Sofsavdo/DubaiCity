import { useEffect, useRef } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

export function useSound(url: string, options: SoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isEnabledRef = useRef(true);

  useEffect(() => {
    // Check if sound is enabled in settings
    const soundEnabled = localStorage.getItem('dubai-sound') !== 'false';
    isEnabledRef.current = soundEnabled;

    if (options.preload && soundEnabled) {
      audioRef.current = new Audio(url);
      audioRef.current.volume = options.volume ?? 0.5;
      audioRef.current.loop = options.loop ?? false;
      audioRef.current.preload = 'auto';
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url, options.volume, options.loop, options.preload]);

  const play = () => {
    if (!isEnabledRef.current) return;

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.volume = options.volume ?? 0.5;
        audioRef.current.loop = options.loop ?? false;
      }
      
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.warn('Failed to play sound:', error);
      });
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  };

  return { play, stop, setVolume };
}

// Predefined game sounds
export const GameSounds = {
  tap: () => useSound('/sounds/tap.mp3', { volume: 0.3 }),
  levelUp: () => useSound('/sounds/level-up.mp3', { volume: 0.5 }),
  coin: () => useSound('/sounds/coin.mp3', { volume: 0.4 }),
  purchase: () => useSound('/sounds/purchase.mp3', { volume: 0.5 }),
  error: () => useSound('/sounds/error.mp3', { volume: 0.4 }),
  notification: () => useSound('/sounds/notification.mp3', { volume: 0.3 }),
};

// Simple sound utility without hooks (for use outside components)
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  constructor() {
    this.enabled = localStorage.getItem('dubai-sound') !== 'false';
    
    // Listen for settings changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'dubai-sound') {
        this.enabled = e.newValue !== 'false';
      }
    });
  }

  preload(key: string, url: string, volume: number = 0.5) {
    if (!this.enabled) return;

    try {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    } catch (error) {
      console.warn(`Failed to preload sound ${key}:`, error);
    }
  }

  play(key: string, url?: string, volume: number = 0.5) {
    if (!this.enabled) return;

    try {
      let audio = this.sounds.get(key);
      
      if (!audio && url) {
        audio = new Audio(url);
        audio.volume = volume;
        this.sounds.set(key, audio);
      }
      
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.warn(`Failed to play sound ${key}:`, error);
        });
      }
    } catch (error) {
      console.warn(`Sound playback error for ${key}:`, error);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('dubai-sound', enabled.toString());
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Global sound manager instance
export const soundManager = SoundManager.getInstance();
