import { create } from 'zustand';
import type { GameState, NarrativeEntry, ConversationTurn } from '@/types/game';
import type { GameStateUpdate } from '@/lib/schema';
import { generateNarrative } from '@/app/actions/generate-narrative';
import { getASCIIArt } from '@/lib/ascii';
import { SoundManager } from '@/lib/sound-manager';

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
   */
  applyStateUpdate: (update: GameStateUpdate) => {
    set((state) => {
      let newHealth = state.health;
      let newInventory = [...state.inventory];

      // Apply health change with clamping
      if (update.health_change !== undefined) {
        newHealth = Math.max(0, Math.min(100, state.health + update.health_change));
      }

      // Add item to inventory if not already present
      if (update.inventory_add && !newInventory.includes(update.inventory_add)) {
        newInventory.push(update.inventory_add);
      }

      // Remove item from inventory
      if (update.inventory_remove) {
        newInventory = newInventory.filter((item) => item !== update.inventory_remove);
      }

      return {
        health: newHealth,
        inventory: newInventory,
        isGameOver: newHealth <= 0,
      };
    });
  },

  /**
   * Resets the game to initial state and triggers re-initialization.
   */
  resetGame: () => {
    set({ ...INITIAL_STATE });
    // Trigger new game initialization after reset
    get().initializeGame();
  },

  /**
   * Initializes the game on first load.
   * Sends __START_GAME__ prompt to generate the prologue.
   */
  initializeGame: async () => {
    const state = get();
    
    // Only initialize if history is empty and not already processing
    if (state.history.length === 0 && !state.isProcessing) {
      set({ isProcessing: true });

      try {
        const response = await generateNarrative({
          command: '__START_GAME__',
          history: [],
          playerState: { health: 100, inventory: [] },
        });

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
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        get().addNarrativeEntry({
          type: 'system',
          content: 'The void stirs... but something prevents your entry. Try again.',
        });
      } finally {
        set({ isProcessing: false });
      }
    }
  },

  /**
   * Submits a player command for processing.
   * Adds command to log, calls AI, and applies response.
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

    set({ isProcessing: true });

    try {
      const response = await generateNarrative({
        command,
        history: state.history,
        playerState: {
          health: state.health,
          inventory: state.inventory,
        },
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
        // Handle error response
        get().addNarrativeEntry({
          type: 'narrator',
          content: response.error || 'The void shifts around you, reality flickering for a moment...',
        });
      }
    } catch (error) {
      console.error('Failed to process command:', error);
      get().addNarrativeEntry({
        type: 'system',
        content: 'Connection lost to The Void... Try again.',
      });
    } finally {
      set({ isProcessing: false });
    }
  },
}));
