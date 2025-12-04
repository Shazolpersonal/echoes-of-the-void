'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  disabled: boolean;
  placeholder?: string;
}

/**
 * CommandInput - Terminal-style input field for player commands.
 * Features auto-focus, clear on submit, and processing indicator.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
export function CommandInput({ 
  onSubmit, 
  disabled, 
  placeholder = 'Enter command...' 
}: CommandInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Re-focus after processing completes
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedValue = value.trim();
    if (trimmedValue && !disabled) {
      onSubmit(trimmedValue);
      setValue(''); // Clear input after submission
    }
  }, [value, disabled, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className="crt-input-container">
      <span className="crt-prompt">&gt; </span>
      {disabled ? (
        <span className="crt-processing-text">
          Processing<span className="crt-dots">...</span>
        </span>
      ) : (
        <>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="crt-input"
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
            aria-label="Command input"
          />
          {!value && <span className="crt-cursor" aria-hidden="true" />}
        </>
      )}
    </form>
  );
}

export default CommandInput;
