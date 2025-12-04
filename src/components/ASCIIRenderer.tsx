'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { VisualCue } from '@/lib/schema';
import { getASCIIArt, hasASCIIArt } from '@/lib/ascii';

interface ASCIIRendererProps {
  artKey: VisualCue;
  onComplete?: () => void;
  animate?: boolean;
}

/**
 * Get contextual color class based on artKey
 */
function getColorClass(artKey: VisualCue): string {
  switch (artKey) {
    case 'monster':
    case 'skeleton':
      return 'ascii-danger';
    case 'chest':
      return 'ascii-loot';
    case 'door':
    case 'void':
      return 'ascii-info';
    default:
      return '';
  }
}

/**
 * ASCIIRenderer - Utility component for displaying ASCII art with monospace formatting.
 * Supports optional typewriter-style animation for dramatic reveal.
 * 
 * Requirements: 7.1, 7.3
 */
export function ASCIIRenderer({ 
  artKey, 
  onComplete, 
  animate = false 
}: ASCIIRendererProps) {
  const colorClass = useMemo(() => getColorClass(artKey), [artKey]);
  const [displayedArt, setDisplayedArt] = useState('');
  const [isComplete, setIsComplete] = useState(!animate);

  const fullArt = getASCIIArt(artKey);

  useEffect(() => {
    if (!animate || !hasASCIIArt(artKey)) {
      setDisplayedArt(fullArt);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Animate character by character
    let currentIndex = 0;
    const speed = 5; // Fast for ASCII art

    const timer = setInterval(() => {
      if (currentIndex <= fullArt.length) {
        setDisplayedArt(fullArt.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [artKey, fullArt, animate, onComplete]);

  // Don't render anything for 'none' cue
  if (!hasASCIIArt(artKey)) {
    return null;
  }

  return (
    <div 
      className={`crt-ascii-renderer ${colorClass}`.trim()} 
      aria-label={`ASCII art: ${artKey}`}
    >
      <pre className="crt-ascii-pre">
        {displayedArt}
        {!isComplete && <span className="crt-cursor" aria-hidden="true" />}
      </pre>
    </div>
  );
}

export default ASCIIRenderer;
