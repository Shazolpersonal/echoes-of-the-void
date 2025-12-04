'use client';

import { ReactNode } from 'react';

export type CRTTheme = 'green' | 'amber';

interface RetroTerminalProps {
  children: ReactNode;
  /** Color theme for the terminal. Defaults to 'green'. */
  theme?: CRTTheme;
}

/**
 * RetroTerminal - The root container component that applies all CRT visual effects.
 * Creates an authentic 80s terminal aesthetic with scanlines, flicker, curvature, and glow.
 * Supports green (default) and amber color themes.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export function RetroTerminal({ children, theme = 'green' }: RetroTerminalProps) {
  const themeClass = theme === 'amber' ? 'crt-theme-amber' : '';
  
  return (
    <div className={`crt-container ${themeClass}`.trim()}>
      <div className="crt-screen">
        <div className="crt-content">
          {children}
        </div>
        {/* Scanline overlay */}
        <div className="crt-scanlines" aria-hidden="true" />
        {/* Flicker effect overlay */}
        <div className="crt-flicker" aria-hidden="true" />
      </div>
    </div>
  );
}

export default RetroTerminal;
