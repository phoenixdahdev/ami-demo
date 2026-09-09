import * as SecureStore from 'expo-secure-store';
import { Appearance, Platform } from 'react-native';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

export type Mode = 'light' | 'dark' | 'system';

type ModeState = {
  /** What the app was asked for, including the `'system'` passthrough. */
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const STORAGE_KEY = 'bna-ui.mode';

const isMode = (value: unknown): value is Mode =>
  value === 'light' || value === 'dark' || value === 'system';

/**
 * Mirrors the override into React Native's global `Appearance` so native chrome
 * follows the toggle too — the status bar, the Android navigation bar, native
 * sheet presentation, and anything reading the OS scheme *outside* React (root
 * layouts do exactly that to colour the system UI).
 *
 * `Appearance.setColorScheme` landed in React Native 0.73, so feature-detect
 * rather than assume.
 */
function syncNativeAppearance(mode: Mode) {
  if (typeof Appearance.setColorScheme !== 'function') return;
  // RN 0.86 replaced the old `null` sentinel ("follow the system") with
  // `'unspecified'`.
  Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
}

/**
 * Where the choice is persisted.
 */
const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

/**
 * Persistence is a convenience and must never be able to break boot, so every
 * call is swallowed: a missing store or a locked keychain leaves the default
 * in place rather than throwing.
 */
const safeStorage = (base: StateStorage): StateStorage => ({
  getItem: async (name) => {
    try {
      return await base.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await base.setItem(name, value);
    } catch {}
  },
  removeItem: async (name) => {
    try {
      await base.removeItem(name);
    } catch {}
  },
});

/**
 * The app-wide source of truth for light/dark/system.
 *
 * A store rather than a provider, so nothing has to be mounted for the theme to
 * work and non-React code can read or set it:
 * `useModeStore.getState().setMode('dark')`.
 *
 * Note this holds the *request* (`'system'` included), not the resolved scheme.
 * Read `useColorScheme()` for what to actually render as — resolving `'system'`
 * needs RN's `useColorScheme()`, which is a subscription and belongs in React.
 */
export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      // The app is light-only, so 'light' rather than following the OS.
      mode: 'light',
      setMode: (mode) => {
        syncNativeAppearance(mode);
        set({ mode });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        safeStorage(secureStorage)
      ),
      // Only the choice is persisted; `setMode` is rebuilt on every launch.
      partialize: ({ mode }) => ({ mode }),
      // A malformed or unrecognised saved value leaves the default in place.
      merge: (persisted, current) => {
        const saved = (persisted as Partial<ModeState> | undefined)?.mode;
        return isMode(saved) ? { ...current, mode: saved } : current;
      },
      // Rehydration bypasses `setMode`, so the native `Appearance` override has
      // to be re-applied by hand once the saved value lands.
      onRehydrateStorage: () => (state) => {
        if (state) syncNativeAppearance(state.mode);
      },
    }
  )
);
