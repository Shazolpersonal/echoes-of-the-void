'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import type { ConversationTurn } from '@/types/game';
import { StructuredResponseSchema, type StructuredResponse } from '@/lib/schema';
import { SYSTEM_PROMPT, INITIAL_PROMPT } from '@/lib/prompts';
import { buildContext } from '@/lib/context';

/**
 * Input for the generateNarrative server action.
 */
export interface GenerateNarrativeInput {
  command: string;
  history: ConversationTurn[];
  playerState: {
    health: number;
    inventory: string[];
  };
}

/**
 * Output from the generateNarrative server action.
 */
export interface GenerateNarrativeOutput {
  success: boolean;
  data?: StructuredResponse;
  error?: string;
}

/**
 * Fallback response when AI generation fails.
 */
const FALLBACK_RESPONSE: StructuredResponse = {
  narrative: 'The void shifts around you, reality flickering for a moment. You sense something went wrong in the fabric of this place...',
  visual_cue: 'none',
  game_state_update: {},
  sound_cue: 'wind',
};

/**
 * Server action to generate narrative responses from the AI Dungeon Master.
 * Uses Vercel AI SDK with Google Gemini 1.5 Flash.
 * 
 * @param input - The command, history, and player state
 * @returns The structured response from the AI
 */
export async function generateNarrative(
  input: GenerateNarrativeInput
): Promise<GenerateNarrativeOutput> {
  const isStartGame = input.command === '__START_GAME__';
  
  try {
    // Build the context from history and player state
    const context = buildContext(input.history, input.playerState);
    
    // Build the prompt based on whether this is game start or regular command
    const userPrompt = isStartGame
      ? INITIAL_PROMPT
      : `${context}\n\nPlayer: ${input.command}`;

    // Call Google Gemini with structured output
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: StructuredResponseSchema,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
    });

    return {
      success: true,
      data: object,
    };
  } catch (error) {
    // Log error for debugging
    console.error('AI generation failed:', error);
    
    // Return fallback response to maintain game flow
    return {
      success: true,
      data: FALLBACK_RESPONSE,
    };
  }
}
