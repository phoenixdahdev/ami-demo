import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { useModeStore } from '@/stores/mode-store';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 *
 * Mirrors the native variant: an explicit mode in the store wins, falling back
 * to the OS scheme. The store is what makes the toggle work here at all —
 * react-native-web's `Appearance` is read-only, exposing `getColorScheme` and
 * `addChangeListener` but no setter, so nothing can push an override into the
 * value `useRNColorScheme()` reports.
 *
 * The gate also covers the store's own rehydration: the persisted mode arrives
 * from `localStorage` a tick after mount, and painting it before hydration
 * finishes would mismatch the server-rendered markup.
 *
 * React Native 0.86's `ColorSchemeName` includes `'unspecified'`, which the
 * binary theme has no slot for, so it collapses here.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const mode = useModeStore((state) => state.mode);
  const system = useRNColorScheme() === 'dark' ? 'dark' : 'light';
  const scheme = mode === 'system' ? system : mode;

  if (hasHydrated) {
    return scheme;
  }

  return 'light';
}
