import { create } from 'zustand';
import type { GameState, NarrativeEntry, ConversationTurn, TextSpeed } from '@/types/game';
import type { GameStateUpdate } from '@/lib/schema';
import { generateNarrative } from '@/app/actions/generate-narrative';
import { getASCIIArt } from '@/lib/ascii';
import { SoundManager } from '@/lib/sound-manager';
import { THEMES, THEME_CONFIG, type ThemeKey } from '@/lib/prompts';

/**
 * Tracks the current initialization session to prevent race conditions.
 * Incremented on each reset/theme change to invalidate pending requests.
 */
let initializationSession = 0;

/**
 * Initial state values for the game store.
 */
const INITIAL_STATE = {
  health: 100,
  inventory: [] as string[],
  isGameOver: false,
  history: [] as ConversationTurn[],
  isProcessing: false,
  isTyping: false,
  narrativeEntries: [] as NarrativeEntry[],
  isMuted: false,
  currentTheme: 'horror' as ThemeKey,
  textSpeed: 'normal' as TextSpeed,
};

/**
 * Generates a unique ID for narrative entries.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Zustand store for managing game state in Echoes of the Void.
 */
export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  ...INITIAL_STATE,

  /**
   * Toggles the muted state for audio.
   */
  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },

  /**
   * Sets the text speed preference.
   */
  setTextSpeed: (speed: TextSpeed) => {
    set({ textSpeed: speed });
  },

  /**
   * Adds a new entry to the narrative log.
   * Automatically generates id and timestamp.
   */
  addNarrativeEntry: (entry: Omit<NarrativeEntry, 'id' | 'timestamp'>) => {
    const newEntry: NarrativeEntry = {
      ...entry,
      id: generateId(),
      timestamp: Date.now(),
    };
    set((state) => ({
      narrativeEntries: [...state.narrativeEntries, newEntry],
      isTyping: entry.type === 'narrator' || entry.type === 'ascii',
    }));
  },

  /**
   * Marks the typewriter animation as complete.
   */
  setTypingComplete: () => {
    set({ isTyping: false });
  },


  /**
   * Applies state updates from AI response.
   * Handles health_change, inventory_add, inventory_remove.
   * Clamps health between 0-100 and triggers game over at 0.
   * Adds system notifications for inventory changes.
   */
  applyStateUpdate: (update: GameStateUpdate) => {
    const itemAdded = update.inventory_add;
    const itemRemoved = update.inventory_remove;
    
    set((state) => {
      let newHealth = state.health;
      let newInventory = [...state.inventory];

      // Apply health change with clamping
      if (update.health_change !== undefined) {
        newHealth = Math.max(0, Math.min(100, state.health + update.health_change));
      }

      // Add item to inventory if not already present
      if (itemAdded && !newInventory.includes(itemAdded)) {
        newInventory.push(itemAdded);
      }

      // Remove item from inventory
      if (itemRemoved) {
        newInventory = newInventory.filter((item) => item !== itemRemoved);
      }

      return {
        health: newHealth,
        inventory: newInventory,
        isGameOver: newHealth <= 0,
      };
    });

    // Add system notifications for inventory changes (after state update)
    if (itemAdded) {
      get().addNarrativeEntry({
        type: 'system',
        content: `► ACQUIRED: ${itemAdded.toUpperCase()}`,
      });
    }
    if (itemRemoved) {
      get().addNarrativeEntry({
        type: 'system',
        content: `► USED: ${itemRemoved.toUpperCase()}`,
      });
    }
  },

  /**
   * Resets the game to initial state and triggers re-initialization.
   * Preserves the current theme and user preferences.
   */
  resetGame: () => {
    // Increment session to invalidate any pending initialization
    initializationSession++;
    
    const currentTheme = get().currentTheme;
    const isMuted = get().isMuted;
    const textSpeed = get().textSpeed;
    set({ ...INITIAL_STATE, currentTheme, isMuted, textSpeed });
    // Trigger new game initialization after reset
    get().initializeGame();
  },

  /**
   * Sets the game theme and reboots the universe.
   * Triggers resetGame and initializeGame with the new theme's prompt.
   */
  setTheme: (theme: ThemeKey) => {
    // Increment session to invalidate any pending initialization
    initializationSession++;
    
    set({ 
      ...INITIAL_STATE, 
      currentTheme: theme,
      isMuted: get().isMuted,
      textSpeed: get().textSpeed,
    });
    // Trigger new game initialization with new theme
    get().initializeGame();
  },

  /**
   * Initializes the game on first load.
   * Sends __START_GAME__ prompt to generate the prologue.
   * Uses the current theme's system prompt and opening line.
   * Protected against race conditions via session tracking.
   */
  initializeGame: async () => {
    const state = get();
    
    // Only initialize if history is empty and not already processing
    if (state.history.length === 0 && !state.isProcessing) {
      // Capture current session to detect if reset/theme change happens during async call
      const currentSession = initializationSession;
      
      set({ isProcessing: true });

      const themeConfig = THEME_CONFIG[state.currentTheme];
      const systemPrompt = THEMES[state.currentTheme];

      try {
        const response = await generateNarrative({
          command: themeConfig.openingLine,
          history: [],
          playerState: { health: 100, inventory: [] },
          systemPrompt,
        });

        // Check if session changed during async call (user reset/changed theme)
        if (currentSession !== initializationSession) {
          console.log('Initialization cancelled: session changed');
          return;
        }

        if (response.success && response.data) {
          get().applyStateUpdate(response.data.game_state_update);
          get().addNarrativeEntry({
            type: 'narrator',
            content: response.data.narrative,
          });

          // Handle visual cue if present
          if (response.data.visual_cue !== 'none') {
            const art = getASCIIArt(response.data.visual_cue);
            if (art) {
              get().addNarrativeEntry({
                type: 'ascii',
                content: art,
              });
            }
          }

          // Handle sound cue if present
          if (response.data.sound_cue !== 'none') {
            SoundManager.play(response.data.sound_cue);
          }

          // Add to history
          set((state) => ({
            history: [
              ...state.history,
              { role: 'user' as const, content: '__START_GAME__' },
              { role: 'assistant' as const, content: response.data!.narrative },
            ],
          }));
        } else {
          // Handle API error with user feedback
          get().addNarrativeEntry({
            type: 'system',
            content: `CONNECTION TO THE VOID LOST: ${response.error || 'Unknown error'}`,
          });
        }
      } catch (error) {
        // Check session before showing error (might be stale)
        if (currentSession !== initializationSession) {
          return;
        }
        console.error('Failed to initialize game:', error);
        get().addNarrativeEntry({
          type: 'system',
          content: 'CONNECTION TO THE VOID LOST. Please refresh to try again.',
        });
      } finally {
        // Only clear processing if session is still valid
        if (currentSession === initializationSession) {
          set({ isProcessing: false });
        }
      }
    }
  },

  /**
   * Submits a player command for processing.
   * Adds command to log, calls AI, and applies response.
   * Handles static "help" and "instructions" commands locally.
   */
  submitCommand: async (command: string) => {
    const state = get();
    
    // Don't process if already processing or game is over
    if (state.isProcessing || state.isGameOver) {
      return;
    }

    // Add player command to narrative log immediately
    get().addNarrativeEntry({
      type: 'player',
      content: command,
    });

    // Check for static help command (case-insensitive)
    const normalizedCommand = command.trim().toLowerCase();
    if (normalizedCommand === 'help' || normalizedCommand === 'instructions') {
      const themeHelpMessage = THEME_CONFIG[state.currentTheme].helpMessage;
      get().addNarrativeEntry({
        type: 'system',
        content: themeHelpMessage,
      });
      return;
    }

    set({ isProcessing: true });

    try {
      const systemPrompt = THEMES[state.currentTheme];
      const response = await generateNarrative({
        command,
        history: state.history,
        playerState: {
          health: state.health,
          inventory: state.inventory,
        },
        systemPrompt,
      });

      if (response.success && response.data) {
        // Apply state updates
        get().applyStateUpdate(response.data.game_state_update);

        // Add narrative to log
        get().addNarrativeEntry({
          type: 'narrator',
          content: response.data.narrative,
        });

        // Handle visual cue
        if (response.data.visual_cue !== 'none') {
          const art = getASCIIArt(response.data.visual_cue);
          if (art) {
            get().addNarrativeEntry({
              type: 'ascii',
              content: art,
            });
          }
        }

        // Handle sound cue
        if (response.data.sound_cue !== 'none') {
          SoundManager.play(response.data.sound_cue);
        }

        // Update history
        set((state) => ({
          history: [
            ...state.history,
            { role: 'user' as const, content: command },
            { role: 'assistant' as const, content: response.data!.narrative },
          ],
        }));
      } else {
        // Handle API error with clear feedback
        const errorMessage = response.errorType === 'rate_limit'
          ? 'THE VOID IS OVERWHELMED. Wait a moment and try again.'
          : response.errorType === 'auth'
          ? 'AUTHENTICATION FAILED. The void rejects your presence.'
          : response.errorType === 'network'
          ? 'CONNECTION TO THE VOID LOST. Check your connection and try again.'
          : `THE VOID TREMBLES: ${response.error || 'Unknown disturbance'}`;
        
        get().addNarrativeEntry({
          type: 'system',
          content: errorMessage,
        });
      }
    } catch (error) {
      console.error('Failed to process command:', error);
      get().addNarrativeEntry({
        type: 'system',
        content: 'CONNECTION TO THE VOID LOST. Try again.',
      });
    } finally {
      set({ isProcessing: false });
    }
  },
}));
