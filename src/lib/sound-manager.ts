import type { SoundCue } from './schema';

/**
 * Maps SoundCue enum values to their corresponding audio file paths.
 */
const SOUND_PATHS: Record<SoundCue, string> = {
  none: '',
  wind: '/sounds/wind.mp3',
  scream: '/sounds/scream.mp3',
  drip: '/sounds/drip.mp3',
  combat: '/sounds/combat.mp3',
};

/**
 * Audio elements cache for preloaded sounds.
 */
const audioCache: Map<SoundCue, HTMLAudioElement> = new Map();

/**
 * Current volume level (0-1).
 */
let currentVolume = 0.5;

/**
 * SoundManager utility for managing game audio.
 * Handles preloading, playing, and volume control for sound cues.
 */
export const SoundManager = {
  /**
   * Preloads all audio assets for immediate playback.
   * Should be called when the game initializes.
   */
  preloadAll: async (): Promise<void> => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const cues: SoundCue[] = ['wind', 'scream', 'drip', 'combat'];

    const loadPromises = cues.map((cue) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio(SOUND_PATHS[cue]);
        audio.volume = currentVolume;
        audio.preload = 'auto';

        audio.addEventListener('canplaythrough', () => {
          audioCache.set(cue, audio);
          resolve();
        }, { once: true });

        audio.addEventListener('error', () => {
          console.warn(`Failed to preload sound: ${cue}`);
          resolve();
        }, { once: true });

        // Trigger load
        audio.load();
      });
    });

    await Promise.all(loadPromises);
  },

  /**
   * Plays the audio for a given sound cue.
   * Creates a new Audio instance to allow overlapping sounds.
   * 
   * @param cue - The sound cue to play
   */
  play: (cue: SoundCue): void => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Don't play 'none' cue
    if (cue === 'none') return;

    const path = SOUND_PATHS[cue];
    if (!path) return;

    // Create new Audio instance to allow overlapping sounds
    const audio = new Audio(path);
    audio.volume = currentVolume;
    audio.play().catch((error) => {
      console.warn(`Failed to play sound ${cue}:`, error);
    });
  },

  /**
   * Sets the volume for all sounds.
   * 
   * @param volume - Volume level between 0 and 1
   */
  setVolume: (volume: number): void => {
    currentVolume = Math.max(0, Math.min(1, volume));

    // Update volume on cached audio elements
    audioCache.forEach((audio) => {
      audio.volume = currentVolume;
    });
  },

  /**
   * Gets the current volume level.
   * 
   * @returns Current volume (0-1)
   */
  getVolume: (): number => {
    return currentVolume;
  },

  /**
   * Gets the file path for a sound cue.
   * Useful for testing and debugging.
   * 
   * @param cue - The sound cue
   * @returns The file path or empty string for 'none'
   */
  getSoundPath: (cue: SoundCue): string => {
    return SOUND_PATHS[cue];
  },
};

export default SoundManager;
