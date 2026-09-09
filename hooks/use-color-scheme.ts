import { useColorScheme as useRNColorScheme } from 'react-native';

import { useModeStore } from '@/stores/mode-store';

/**
 * The one place the app's colour scheme is decided.
 *
 * The mode store wins whenever it holds an explicit choice, so an in-app
 * light/dark toggle works on every platform — including web, where
 * react-native-web has no `Appearance.setColorScheme` for the toggle to write
 * through. On `'system'` this is just the OS scheme.
 *
 * React Native 0.86 widened `ColorSchemeName` to `'light' | 'dark' |
 * 'unspecified'`. The theme is binary — `Colors` only has `light` and `dark`
 * keys — so collapse the third value here, once, and let every consumer keep
 * indexing with a two-value union.
 */
export function useColorScheme(): 'light' | 'dark' {
  const mode = useModeStore((state) => state.mode);
  const system = useRNColorScheme() === 'dark' ? 'dark' : 'light';

  return mode === 'system' ? system : mode;
}
