'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { StructuredResponseSchema, type StructuredResponse } from '@/lib/schema';
import { buildContext } from '@/lib/context';
import type { ConversationTurn } from '@/types/game';
import { THEMES } from '@/lib/prompts';

/**
 * Input interface for the generateNarrative server action.
 */
export interface GenerateNarrativeInput {
  command: string;
  history: ConversationTurn[];
  playerState: {
    health: number;
    inventory: string[];
  };
  /** System prompt to use for the AI. Defaults to horror theme. */
  systemPrompt?: string;
}

/**
 * Output interface for the generateNarrative server action.
 */
export interface GenerateNarrativeOutput {
  success: boolean;
  data?: StructuredResponse;
  error?: string;
  errorType?: 'network' | 'validation' | 'rate_limit' | 'auth' | 'unknown';
}

/**
 * Sanitizes error messages for client display.
 * Removes sensitive information while keeping useful context.
 */
function sanitizeErrorMessage(error: unknown): { message: string; type: GenerateNarrativeOutput['errorType'] } {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('401')) {
      return { message: 'Authentication failed with the void.', type: 'auth' };
    }
    if (msg.includes('rate limit') || msg.includes('429') || msg.includes('quota')) {
      return { message: 'The void is overwhelmed. Please wait a moment.', type: 'rate_limit' };
    }
    if (msg.includes('timeout') || msg.includes('network') || msg.includes('fetch')) {
      return { message: 'Connection to the void was lost.', type: 'network' };
    }
    if (msg.includes('parse') || msg.includes('json') || msg.includes('schema') || msg.includes('zod')) {
      return { message: 'The void spoke in tongues we cannot understand.', type: 'validation' };
    }
  }
  
  return { message: 'An unknown disturbance ripples through the void.', type: 'unknown' };
}

/**
 * Server action that generates narrative responses from the AI Dungeon Master.
 * Uses Google Gemini with structured output to ensure consistent response format.
 * 
 * @param input - The command, history, player state, and optional system prompt
 * @returns The AI's structured response or an error
 */
export async function generateNarrative(
  input: GenerateNarrativeInput
): Promise<GenerateNarrativeOutput> {
  try {
    // Use provided system prompt or default to horror theme
    const systemPrompt = input.systemPrompt || THEMES.horror;
    
    // Build context from history and player state
    const context = buildContext(input.history, input.playerState);
    
    // Construct the full prompt
    const prompt = `${context}\n\nPlayer: ${input.command}`;

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: StructuredResponseSchema,
      system: systemPrompt,
      prompt,
    });

    return {
      success: true,
      data: object,
    };
  } catch (error) {
    console.error('AI generation failed:', error);

    const { message, type } = sanitizeErrorMessage(error);
    
    return {
      success: false,
      error: message,
      errorType: type,
    };
  }
}
