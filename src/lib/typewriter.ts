/**
 * Typewriter Animation Utility
 * Provides character-by-character text reveal functionality with skip support.
 * 
 * Requirements: 3.1, 3.4
 */

export interface TypewriterOptions {
  /** Speed in milliseconds per character */
  speed?: number;
  /** Callback fired on each character reveal */
  onUpdate?: (text: string) => void;
  /** Callback fired when animation completes */
  onComplete?: () => void;
}

export interface TypewriterController {
  /** Start the typewriter animation */
  start: () => void;
  /** Skip to the end, revealing all text immediately */
  skip: () => void;
  /** Pause the animation */
  pause: () => void;
  /** Resume a paused animation */
  resume: () => void;
  /** Stop and reset the animation */
  stop: () => void;
  /** Check if animation is currently running */
  isRunning: () => boolean;
  /** Check if animation is complete */
  isComplete: () => boolean;
  /** Get current revealed text */
  getCurrentText: () => string;
}

/**
 * Creates a typewriter animation controller for the given text.
 * 
 * @param fullText - The complete text to reveal
 * @param options - Configuration options
 * @returns TypewriterController for managing the animation
 * 
 * @example
 * ```ts
 * const controller = createTypewriter("Hello, world!", {
 *   speed: 50,
 *   onUpdate: (text) => setDisplayText(text),
 *   onComplete: () => console.log("Done!")
 * });
 * controller.start();
 * // Later: controller.skip() to reveal all text immediately
 * ```
 */
export function createTypewriter(
  fullText: string,
  options: TypewriterOptions = {}
): TypewriterController {
  const { speed = 30, onUpdate, onComplete } = options;

  let currentIndex = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let running = false;
  let complete = false;
  let paused = false;

  const tick = () => {
    if (!running || paused) return;

    if (currentIndex <= fullText.length) {
      const currentText = fullText.slice(0, currentIndex);
      onUpdate?.(currentText);
      currentIndex++;

      if (currentIndex <= fullText.length) {
        timerId = setTimeout(tick, speed);
      } else {
        complete = true;
        running = false;
        onComplete?.();
      }
    }
  };

  const controller: TypewriterController = {
    start: () => {
      if (running || complete) return;
      running = true;
      paused = false;
      tick();
    },

    skip: () => {
      if (complete) return;
      
      // Clear any pending timer
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }

      // Reveal all text immediately
      currentIndex = fullText.length;
      onUpdate?.(fullText);
      complete = true;
      running = false;
      onComplete?.();
    },

    pause: () => {
      if (!running || complete) return;
      paused = true;
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    },

    resume: () => {
      if (!paused || complete) return;
      paused = false;
      tick();
    },

    stop: () => {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      running = false;
      paused = false;
      currentIndex = 0;
      complete = false;
    },

    isRunning: () => running && !paused,

    isComplete: () => complete,

    getCurrentText: () => fullText.slice(0, currentIndex),
  };

  return controller;
}

/**
 * Default typewriter speeds for different content types.
 */
export const TYPEWRITER_SPEEDS = {
  /** Normal narrative text */
  narrative: 30,
  /** ASCII art (faster for visual effect) */
  ascii: 5,
  /** System messages */
  system: 20,
  /** Fast mode for impatient users */
  fast: 10,
} as const;

/**
 * Calculates estimated duration for typewriter animation.
 * 
 * @param text - The text to animate
 * @param speed - Milliseconds per character
 * @returns Estimated duration in milliseconds
 */
export function getTypewriterDuration(text: string, speed: number = TYPEWRITER_SPEEDS.narrative): number {
  return text.length * speed;
}

export default createTypewriter;
