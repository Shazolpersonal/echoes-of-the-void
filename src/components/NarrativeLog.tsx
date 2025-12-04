'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import type { NarrativeEntry } from '@/types/game';
import { createTypewriter, TYPEWRITER_SPEEDS, type TypewriterController } from '@/lib/typewriter';

interface NarrativeLogProps {
  entries: NarrativeEntry[];
  isTyping: boolean;
  onSkipTyping: () => void;
}

/**
 * NarrativeLog - Scrollable story display area with typewriter effect.
 * Renders entries with appropriate styling per type and supports click-to-skip.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
export function NarrativeLog({ entries, isTyping, onSkipTyping }: NarrativeLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<TypewriterController | null>(null);
  const [displayedText, setDisplayedText] = useState<Map<string, string>>(new Map());
  const [completedEntries, setCompletedEntries] = useState<Set<string>>(new Set());

  // Get the last entry that needs typewriter effect
  const lastNarratorEntry = entries.filter(
    e => e.type === 'narrator' || e.type === 'ascii'
  ).slice(-1)[0];

  // Typewriter effect for the latest narrator/ascii entry using the typewriter utility
  useEffect(() => {
    if (!lastNarratorEntry || completedEntries.has(lastNarratorEntry.id)) {
      return;
    }

    const speed = lastNarratorEntry.type === 'ascii' 
      ? TYPEWRITER_SPEEDS.ascii 
      : TYPEWRITER_SPEEDS.narrative;

    const controller = createTypewriter(lastNarratorEntry.content, {
      speed,
      onUpdate: (text) => {
        setDisplayedText(prev => new Map(prev).set(lastNarratorEntry.id, text));
      },
      onComplete: () => {
        setCompletedEntries(prev => new Set(prev).add(lastNarratorEntry.id));
        onSkipTyping();
      },
    });

    typewriterRef.current = controller;
    controller.start();

    return () => {
      controller.stop();
      typewriterRef.current = null;
    };
  }, [lastNarratorEntry, completedEntries, onSkipTyping]);


  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries, displayedText]);

  // Handle click to skip typewriter animation using the controller
  const handleSkip = useCallback(() => {
    if (isTyping && typewriterRef.current && !typewriterRef.current.isComplete()) {
      typewriterRef.current.skip();
    }
  }, [isTyping]);

  // Handle keypress to skip
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip on any key except modifier keys
      if (!e.ctrlKey && !e.altKey && !e.metaKey && isTyping) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTyping, handleSkip]);

  const getEntryClassName = (type: NarrativeEntry['type']): string => {
    switch (type) {
      case 'player':
        return 'crt-text-player';
      case 'narrator':
        return 'crt-text-narrator';
      case 'ascii':
        return 'crt-text-ascii';
      case 'system':
        return 'crt-text-system';
      default:
        return '';
    }
  };

  const getDisplayText = (entry: NarrativeEntry): string => {
    // Player and system entries show immediately
    if (entry.type === 'player' || entry.type === 'system') {
      return entry.content;
    }

    // Check if this is the entry being typed
    if (entry.id === lastNarratorEntry?.id && !completedEntries.has(entry.id)) {
      return displayedText.get(entry.id) || '';
    }

    // Completed entries show full text
    return entry.content;
  };

  return (
    <div 
      ref={containerRef}
      className="crt-narrative-log"
      onClick={handleSkip}
      role="log"
      aria-live="polite"
      aria-label="Game narrative"
    >
      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className={`crt-narrative-entry ${getEntryClassName(entry.type)}`}
        >
          {entry.type === 'player' && <span className="crt-player-prefix">&gt; </span>}
          <span className={entry.type === 'ascii' ? 'crt-ascii-content' : ''}>
            {getDisplayText(entry)}
          </span>
          {entry.id === lastNarratorEntry?.id && 
           !completedEntries.has(entry.id) && 
           isTyping && (
            <span className="crt-cursor" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

export default NarrativeLog;
