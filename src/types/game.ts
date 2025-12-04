import type { GameStateUpdate } from '@/lib/schema';

/**
 * Represents a single turn in the conversation history between player and AI.
 * Used to maintain context for the AI Dungeon Master.
 */
export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Represents a single entry in the narrative log display.
 */
export interface NarrativeEntry {
  id: string;
  type: 'player' | 'narrator' | 'ascii' | 'system';
  content: string;
  timestamp: number;
}

/**
 * The complete game state managed by Zustand store.
 */
export interface GameState {
  // Player State
  health: number;
  inventory: string[];
  isGameOver: boolean;

  // Conversation State
  history: ConversationTurn[];

  // UI State
  isProcessing: boolean;
  isTyping: boolean;
  narrativeEntries: NarrativeEntry[];

  // Actions
  submitCommand: (command: string) => Promise<void>;
  applyStateUpdate: (update: GameStateUpdate) => void;
  addNarrativeEntry: (entry: Omit<NarrativeEntry, 'id' | 'timestamp'>) => void;
  setTypingComplete: () => void;
  resetGame: () => void;
  initializeGame: () => Promise<void>;
}
