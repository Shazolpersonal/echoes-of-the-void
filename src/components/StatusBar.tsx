'use client';

import React from 'react';

interface StatusBarProps {
  health: number;
  inventory: string[];
  isGameOver: boolean;
}

/**
 * StatusBar - Displays current player state including health bar and inventory.
 * 
 * Requirements: 5.5
 */
export function StatusBar({ health, inventory, isGameOver }: StatusBarProps) {
  const healthPercentage = Math.max(0, Math.min(100, health));
  const isCritical = healthPercentage <= 30;

  return (
    <div className="crt-status-bar">
      <div className="crt-status-section">
        <span className="crt-status-label">HEALTH:</span>
        <div className="crt-health-bar">
          <div className="crt-health-bar-track">
            <div 
              className={`crt-health-bar-fill ${isCritical ? 'critical' : ''}`}
              style={{ width: `${healthPercentage}%` }}
              role="progressbar"
              aria-valuenow={healthPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Health"
            />
          </div>
          <span className="crt-health-value">{healthPercentage}/100</span>
        </div>
      </div>

      <div className="crt-status-section">
        <span className="crt-status-label">INVENTORY:</span>
        <span className="crt-inventory-list">
          {inventory.length > 0 
            ? inventory.join(', ') 
            : '[empty]'
          }
        </span>
      </div>

      {isGameOver && (
        <div className="crt-status-dead">
          [DECEASED]
        </div>
      )}
    </div>
  );
}

export default StatusBar;
