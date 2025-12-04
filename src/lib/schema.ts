import { z } from 'zod';

export const VisualCueEnum = z.enum([
  'none',
  'skeleton',
  'door',
  'chest',
  'monster',
  'void'
]);

export const SoundCueEnum = z.enum([
  'none',
  'wind',
  'scream',
  'drip',
  'combat'
]);

export const GameStateUpdateSchema = z.object({
  health_change: z.number().optional()
    .describe('Amount to add/subtract from player health. Negative for damage.'),
  inventory_add: z.string().optional()
    .describe('Single item name to add to player inventory.'),
  inventory_remove: z.string().optional()
    .describe('Single item name to remove from player inventory.'),
});

export const StructuredResponseSchema = z.object({
  narrative: z.string()
    .describe('The atmospheric story description based on the player action. 2-4 sentences in dark, horror tone.'),
  visual_cue: VisualCueEnum
    .describe('Key to trigger ASCII art display. Use sparingly for impactful moments.'),
  game_state_update: GameStateUpdateSchema
    .describe('Changes to apply to player state based on story events.'),
  sound_cue: SoundCueEnum
    .describe('Audio atmosphere trigger for immersion.'),
});

// Export TypeScript types from schema
export type StructuredResponse = z.infer<typeof StructuredResponseSchema>;
export type VisualCue = z.infer<typeof VisualCueEnum>;
export type SoundCue = z.infer<typeof SoundCueEnum>;
export type GameStateUpdate = z.infer<typeof GameStateUpdateSchema>;
