import type { VisualCue } from './schema';

/**
 * ASCII art mappings for visual cues in the game.
 * Each key corresponds to a VisualCue enum value.
 */
export const ASCII_ART: Record<VisualCue, string> = {
  none: '',

  skeleton: `
    .---.
   /     \\
   \\.@-@./
    /\`\\_/\`\\
   //  _  \\\\
  | \\     / |
   \\|  |  |/
    |  |  |
   /___|___\\
  `,

  door: `
   ______________
  |\\             \\
  | \\             \\
  |  \\-------------\\
  |   |            |
  |   |    .-.     |
  |   |    | |     |
  |   |    '-'     |
   \\  |            |
    \\ |            |
     \\|____________|
  `,

  chest: `
      ____
     /    \\
    /______\\
   |  ____  |
   | |    | |
   | |____| |
   |________|
  `,

  monster: `
      ,     ,
     /(     )\\
    /  \\   /  \\
   /    ) (    \\
  /   .' _ '.   \\
 /   /   ^   \\   \\
(   (  (o o)  )   )
 \\   \\  \\_/  /   /
  '._/       \\_.'
  `,

  void: `
    . . .  .  . . .
   .  *  .   .  *  .
  . .   . . . .   . .
    .  .  ___  .  .
   . . . |   | . . .
  .  *  .|   |.  *  .
   . . . |___|. . .
    .  .  . .  .  .
   .  *  .   .  *  .
    . . .  .  . . .
  `,
};

/**
 * Gets the ASCII art string for a given visual cue.
 * @param cue - The visual cue to get art for
 * @returns The ASCII art string, or empty string if cue is 'none'
 */
export function getASCIIArt(cue: VisualCue): string {
  return ASCII_ART[cue] || '';
}

/**
 * Checks if a visual cue has associated ASCII art.
 * @param cue - The visual cue to check
 * @returns True if the cue has non-empty ASCII art
 */
export function hasASCIIArt(cue: VisualCue): boolean {
  return cue !== 'none' && ASCII_ART[cue] !== '';
}
