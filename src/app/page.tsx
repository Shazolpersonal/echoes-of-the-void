'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/game-store';
import { SoundManager } from '@/lib/sound-manager';
import {
  RetroTerminal,
  StatusBar,
  NarrativeLog,
  CommandInput,
  GameOverScreen,
} from '@/components';

/**
 * Main game page for Echoes of the Void.
 * Assembles all game components within the RetroTerminal wrapper.
 * 
 * Requirements: 1.1, 2.1, 3.1, 3.3, 4.1, 5.4, 5.5
 */
export default function GamePage() {
  const {
    health,
    inventory,
    isGameOver,
    isProcessing,
    isTyping,
    narrativeEntries,
    initializeGame,
    submitCommand,
    setTypingComplete,
    resetGame,
  } = useGameStore();

  // Initialize game and preload sounds on mount
  useEffect(() => {
    // Preload all sound assets
    SoundManager.preloadAll();
    
    // Initialize the game (generates prologue)
    initializeGame();
  }, [initializeGame]);

  // Handle command submission
  const handleSubmit = (command: string) => {
    submitCommand(command);
  };

  // Determine if input should be disabled
  const isInputDisabled = isProcessing || isGameOver;

  // Show loading state while generating prologue
  const isLoading = narrativeEntries.length === 0 && isProcessing;

  return (
    <RetroTerminal>
      <div className="crt-game-layout">
        {/* Status bar at the top */}
        <StatusBar
          health={health}
          inventory={inventory}
          isGameOver={isGameOver}
        />

        {/* Main narrative area */}
        <div className="crt-main-area">
          {isLoading ? (
            <div className="crt-loading">
              <span className="crt-loading-text">
                Entering The Void<span className="crt-dots">...</span>
              </span>
            </div>
          ) : (
            <NarrativeLog
              entries={narrativeEntries}
              isTyping={isTyping}
              onSkipTyping={setTypingComplete}
            />
          )}
        </div>

        {/* Command input at the bottom */}
        <CommandInput
          onSubmit={handleSubmit}
          disabled={isInputDisabled}
          placeholder="What do you do?"
        />

        {/* Game over overlay */}
        {isGameOver && <GameOverScreen onRestart={resetGame} />}
      </div>
    </RetroTerminal>
  );
}
