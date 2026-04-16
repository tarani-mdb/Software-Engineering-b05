'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const stored = window.localStorage.getItem('theme-mode');
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return stored === 'dark' || stored === 'light' ? stored : preferredDark ? 'dark' : 'light';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      onClick={() => {
        const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        window.localStorage.setItem('theme-mode', nextTheme);
        applyTheme(nextTheme);
      }}
      className="theme-toggle"
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__label">{theme === 'light' ? 'Light' : 'Dark'}</span>
        <span className="theme-toggle__thumb" aria-hidden="true">{theme === 'light' ? '☀' : '☾'}</span>
      </span>
    </button>
  );
}
