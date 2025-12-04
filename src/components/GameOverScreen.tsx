'use client';

import React, { useEffect, useCallback } from 'react';

interface GameOverScreenProps {
  onRestart: () => void;
}

/**
 * GameOverScreen - Displays GAME OVER message and restart prompt.
 * Handles keypress to trigger game reset.
 * 
 * Requirements: 5.4
 */
export function GameOverScreen({ onRestart }: GameOverScreenProps) {
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Restart on any key press
    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
      onRestart();
    }
  }, [onRestart]);

  const handleClick = useCallback(() => {
    onRestart();
  }, [onRestart]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div 
      className="crt-game-over" 
      onClick={handleClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <div className="crt-game-over-content">
        <pre className="crt-game-over-ascii" aria-hidden="true">
{`
   ▄████  ▄▄▄       ███▄ ▄███▓▓█████ 
  ██▒ ▀█▒▒████▄    ▓██▒▀█▀ ██▒▓█   ▀ 
 ▒██░▄▄▄░▒██  ▀█▄  ▓██    ▓██░▒███   
 ░▓█  ██▓░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄ 
 ░▒▓███▀▒ ▓█   ▓██▒▒██▒   ░██▒░▒████▒
  ░▒   ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░
   ░   ░   ▒   ▒▒ ░░  ░      ░ ░ ░  ░
 ░ ░   ░   ░   ▒   ░      ░      ░   
       ░       ░  ░       ░      ░  ░
                                     
  ▒█████   ██▒   █▓▓█████  ██▀███   
 ▒██▒  ██▒▓██░   █▒▓█   ▀ ▓██ ▒ ██▒ 
 ▒██░  ██▒ ▓██  █▒░▒███   ▓██ ░▄█ ▒ 
 ▒██   ██░  ▒██ █░░▒▓█  ▄ ▒██▀▀█▄   
 ░ ████▓▒░   ▒▀█░  ░▒████▒░██▓ ▒██▒ 
 ░ ▒░▒░▒░    ░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░ 
   ░ ▒ ▒░    ░ ░░   ░ ░  ░  ░▒ ░ ▒░ 
 ░ ░ ░ ▒       ░░     ░     ░░   ░  
     ░ ░        ░     ░  ░   ░      
               ░                    
`}
        </pre>
        <h1 id="game-over-title" className="crt-game-over-text">
          THE VOID CLAIMS YOU
        </h1>
        <p className="crt-restart-prompt">
          Press any key to return to the darkness...
        </p>
      </div>
    </div>
  );
}

export default GameOverScreen;
