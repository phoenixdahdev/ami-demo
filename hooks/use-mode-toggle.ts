import { useCallback } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Mode, useModeStore } from '@/stores/mode-store';

interface UseModeToggleReturn {
  isDark: boolean;
  mode: Mode;
  setMode: (mode: Mode) => void;
  currentMode: 'light' | 'dark';
  toggleMode: () => void;
}

/**
 * Reads and writes the app-wide theme mode held by `useModeStore`.
 *
 * The mode deliberately lives in the store rather than in this hook: it used to
 * be local `useState` paired with a global `Appearance.setColorScheme` call, so
 * remounting the toggle reset the cycle to `'system'` while the app stayed
 * dark, and two toggles on screen disagreed. Sharing the state also makes the
 * toggle work on web, where `Appearance` is read-only.
 */
export function useModeToggle(): UseModeToggleReturn {
  const mode = useModeStore((state) => state.mode);
  const setMode = useModeStore((state) => state.setMode);
  const scheme = useColorScheme();

  // Reads the mode off the store instead of closing over it, so the callback
  // keeps one identity for the life of the component and cannot cycle from a
  // stale value.
  const toggleMode = useCallback(() => {
    const current = useModeStore.getState();

    switch (current.mode) {
      case 'light':
        current.setMode('dark');
        break;
      case 'dark':
        current.setMode('system');
        break;
      case 'system':
        current.setMode('light');
        break;
    }
  }, []);

  return {
    isDark: scheme === 'dark',
    mode,
    setMode,
    currentMode: scheme,
    toggleMode,
  };
}
