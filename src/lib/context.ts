import type { ConversationTurn } from '@/types/game';

/**
 * Player state information used for building AI context.
 */
export interface PlayerState {
  health: number;
  inventory: string[];
}

/**
 * Builds the context string for the AI Dungeon Master.
 * Includes the last 5 turns of conversation history and current player state.
 * 
 * @param history - The full conversation history
 * @param playerState - Current player health and inventory
 * @returns Formatted context string for the AI prompt
 */
export function buildContext(
  history: ConversationTurn[],
  playerState: PlayerState
): string {
  // Last 5 turns = 10 messages (user + assistant pairs)
  const recentHistory = history.slice(-10);

  const stateContext = `
## CURRENT PLAYER STATE
- Health: ${playerState.health}/100 ${playerState.health <= 30 ? '(CRITICAL - describe their weakened state)' : ''}
- Inventory: ${playerState.inventory.length > 0 ? playerState.inventory.join(', ') : 'Empty'}
${playerState.health <= 0 ? '- STATUS: DEAD - Describe their final moments poetically' : ''}

## RECENT HISTORY
${recentHistory.map(turn => `${turn.role.toUpperCase()}: ${turn.content}`).join('\n')}
`;

  return stateContext;
}
