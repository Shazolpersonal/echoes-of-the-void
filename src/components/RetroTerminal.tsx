'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { THEME_CONFIG, type ThemeKey } from '@/lib/prompts';
import type { TextSpeed } from '@/types/game';

const TEXT_SPEED_OPTIONS: { value: TextSpeed; label: string }[] = [
  { value: 'slow', label: 'SLOW' },
  { value: 'normal', label: 'NORMAL' },
  { value: 'fast', label: 'FAST' },
  { value: 'instant', label: 'INSTANT' },
];

export type CRTTheme = 'green' | 'amber';

/**
 * Retro-styled speaker icon SVG for unmuted state.
 */
function SpeakerOnIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Speaker body */}
      <rect x="2" y="5" width="3" height="6" />
      <polygon points="5,5 9,2 9,14 5,11" />
      {/* Sound waves */}
      <rect x="11" y="4" width="1" height="2" />
      <rect x="11" y="10" width="1" height="2" />
      <rect x="12" y="6" width="1" height="4" />
      <rect x="13" y="3" width="1" height="2" />
      <rect x="13" y="11" width="1" height="2" />
      <rect x="14" y="5" width="1" height="6" />
    </svg>
  );
}

/**
 * Retro-styled muted speaker icon SVG.
 */
function SpeakerOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Speaker body */}
      <rect x="2" y="5" width="3" height="6" />
      <polygon points="5,5 9,2 9,14 5,11" />
      {/* X mark */}
      <rect x="11" y="5" width="1" height="1" />
      <rect x="12" y="6" width="1" height="1" />
      <rect x="13" y="7" width="1" height="2" />
      <rect x="12" y="9" width="1" height="1" />
      <rect x="11" y="10" width="1" height="1" />
      <rect x="14" y="5" width="1" height="1" />
      <rect x="14" y="10" width="1" height="1" />
    </svg>
  );
}

/**
 * Retro-styled gear/settings icon SVG.
 */
function GearIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Gear teeth */}
      <rect x="7" y="1" width="2" height="2" />
      <rect x="7" y="13" width="2" height="2" />
      <rect x="1" y="7" width="2" height="2" />
      <rect x="13" y="7" width="2" height="2" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      {/* Center circle */}
      <rect x="5" y="5" width="6" height="6" />
      <rect x="6" y="6" width="4" height="4" fill="black" />
    </svg>
  );
}

interface RetroTerminalProps {
  children: ReactNode;
  /** Color theme for the terminal. Defaults to 'green'. */
  theme?: CRTTheme;
}

const BOOT_MESSAGES = [
  'VOID SYSTEMS BIOS v6.66',
  'COPYRIGHT (C) 2025 KIRO INDUSTRIES',
  '',
  'INITIALIZING MEMORY.............. OK',
  'LOADING VOID KERNEL.............. OK',
  'SCANNING NEURAL PATHWAYS......... OK',
  'CONNECTING TO NEURAL NET......... OK',
  'CALIBRATING FEAR SENSORS......... OK',
  '',
  'ALL SYSTEMS NOMINAL',
  'ENTERING THE VOID...',
];

/**
 * RetroTerminal - The root container component that applies all CRT visual effects.
 * Creates an authentic 80s terminal aesthetic with scanlines, flicker, curvature, and glow.
 * Supports green (default) and amber color themes.
 * Includes damage feedback effect when player takes damage.
 * Features a fake BIOS boot sequence on initial load.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export function RetroTerminal({ children, theme = 'green' }: RetroTerminalProps) {
  const themeClass = theme === 'amber' ? 'crt-theme-amber' : '';
  const health = useGameStore((state) => state.health);
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const currentTheme = useGameStore((state) => state.currentTheme);
  const setTheme = useGameStore((state) => state.setTheme);
  const textSpeed = useGameStore((state) => state.textSpeed);
  const setTextSpeed = useGameStore((state) => state.setTextSpeed);
  const previousHealthRef = useRef(health);
  const [isDamaged, setIsDamaged] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Boot sequence effect
  useEffect(() => {
    if (!isBooting) return;

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < BOOT_MESSAGES.length) {
        setBootLines((prev) => [...prev, BOOT_MESSAGES[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        // Wait a moment after last message, then clear and show game
        setTimeout(() => {
          setIsBooting(false);
        }, 400);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isBooting]);

  // Monitor health changes and trigger damage effect
  useEffect(() => {
    if (health < previousHealthRef.current) {
      // Player took damage - trigger effect
      setIsDamaged(true);
      const timer = setTimeout(() => {
        setIsDamaged(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    previousHealthRef.current = health;
  }, [health]);

  const containerClasses = [
    'crt-container',
    themeClass,
    isDamaged ? 'damage-effect' : '',
  ].filter(Boolean).join(' ');

  const handleThemeChange = (newTheme: ThemeKey) => {
    setTheme(newTheme);
    setIsSettingsOpen(false);
    // Trigger boot sequence for new theme
    setIsBooting(true);
    setBootLines([]);
  };
  
  return (
    <div className={containerClasses}>
      <div className="crt-screen">
        <div className="crt-content">
          {isBooting ? (
            <div className="crt-boot-sequence">
              {bootLines.map((line, i) => (
                <div key={i} className="crt-boot-line">{line}</div>
              ))}
              <span className="crt-cursor" />
            </div>
          ) : (
            children
          )}
        </div>
        {/* Scanline overlay */}
        <div className="crt-scanlines" aria-hidden="true" />
        {/* Flicker effect overlay */}
        <div className="crt-flicker" aria-hidden="true" />
        {/* System badge */}
        <a
          href="https://kiro.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="system-badge"
        >
          POWERED BY KIRO IDE // KIROWEEN 2025
        </a>
        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="settings-toggle"
          aria-label="Open settings"
          title="Reality Shifter"
        >
          <GearIcon />
        </button>
        {/* Mute toggle button */}
        <button
          onClick={toggleMute}
          className="mute-toggle"
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
        </button>
        {/* Settings Modal - System BIOS style */}
        {isSettingsOpen && (
          <div className="bios-overlay" onClick={() => setIsSettingsOpen(false)}>
            <div className="bios-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bios-header">
                ╔══════════════════════════════════════╗
                <br />
                ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VOID SYSTEMS BIOS v6.66&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
                <br />
                ║&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REALITY CONFIGURATION&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;║
                <br />
                ╠══════════════════════════════════════╣
              </div>
              <div className="bios-content">
                <div className="bios-label">SELECT PROTOCOL:</div>
                {(Object.keys(THEME_CONFIG) as ThemeKey[]).map((themeKey) => (
                  <button
                    key={themeKey}
                    onClick={() => handleThemeChange(themeKey)}
                    className={`bios-button ${currentTheme === themeKey ? 'bios-button-active' : ''}`}
                  >
                    {currentTheme === themeKey ? '► ' : '  '}
                    {THEME_CONFIG[themeKey].displayName}
                    {currentTheme === themeKey ? ' ◄' : ''}
                  </button>
                ))}
                
                <div className="bios-label" style={{ marginTop: '1rem' }}>TEXT SPEED:</div>
                <div className="bios-speed-row">
                  {TEXT_SPEED_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTextSpeed(option.value)}
                      className={`bios-speed-button ${textSpeed === option.value ? 'bios-button-active' : ''}`}
                    >
                      {textSpeed === option.value ? `[${option.label}]` : option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bios-footer">
                ╠══════════════════════════════════════╣
                <br />
                ║&nbsp;&nbsp;WARNING: CHANGING PROTOCOL WILL&nbsp;&nbsp;&nbsp;║
                <br />
                ║&nbsp;&nbsp;RESET CURRENT REALITY INSTANCE&nbsp;&nbsp;&nbsp;║
                <br />
                ╚══════════════════════════════════════╝
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="bios-close"
              >
                [ESC] CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RetroTerminal;
