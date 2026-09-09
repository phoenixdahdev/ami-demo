import { Country, DEFAULT_COUNTRY } from '@/constants/countries';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

/** Digits required before a phone step will let you continue. */
export const PHONE_MIN_DIGITS = 9;
export const OTP_LENGTH = 6;
export const PIN_LENGTH = 4;

/** How long the simulated backend "takes" to check a code. */
const VERIFY_MS = 1400;
/** And how long unlocking appears to take (394:4060). */
const UNLOCK_MS = 900;

const STORAGE_KEY = 'am1.auth';

type Profile = {
  name: string;
};

type AuthState = {
  // The phone/OTP draft. Sign up and log in walk the same two steps, so they
  // share it rather than keeping two copies in sync. Not persisted.
  country: Country;
  /** Digits only, no spaces — formatting is a display concern. */
  phone: string;
  otp: string;
  isVerifying: boolean;

  // Persisted: what a returning user still has after a relaunch.
  /** The PIN, set during sign up and checked on unlock. */
  pin: string;
  isSignedIn: boolean;
  profile: Profile;

  setCountry: (country: Country) => void;
  setPhone: (phone: string) => void;
  setOtp: (otp: string) => void;
  setPin: (pin: string) => void;
  verifyOtp: () => Promise<boolean>;
  confirmPin: (candidate: string) => boolean;
  /** Unlock with the stored PIN. Resolves false when it doesn't match. */
  unlockWithPin: (candidate: string) => Promise<boolean>;
  signIn: () => void;
  signOut: () => void;
  resetDraft: () => void;
};

const emptyDraft = {
  country: DEFAULT_COUNTRY,
  phone: '',
  otp: '',
  isVerifying: false,
};

/**
 * The simulated app has no account service, so the person is seeded — the kit
 * greets "Ulvin" and none of the flows collect a name.
 */
const SEEDED_PROFILE: Profile = { name: 'Ulvin' };

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

const localStorageAdapter: StateStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
};

/** Persistence is a convenience; a failure must never keep the app from booting. */
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
 * Auth state for the simulated app.
 *
 * There is no backend: `verifyOtp` waits and succeeds, which is what the
 * "verifying" frames show. The PIN comparisons are the one piece of real logic
 * — `confirmPin` drives sign-up's "Incorrect PIN", and `unlockWithPin` drives
 * the returning-user lock screen.
 *
 * Session and PIN persist so a relaunch lands on unlock rather than onboarding.
 * A real bank would never keep the PIN itself — it would hold a key in the
 * keychain and let the device verify — but nothing here talks to a server.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...emptyDraft,
      pin: '',
      isSignedIn: false,
      profile: SEEDED_PROFILE,

      setCountry: (country) => set({ country }),
      setPhone: (phone) => set({ phone: phone.replace(/\D/g, '') }),
      setOtp: (otp) =>
        set({ otp: otp.replace(/\D/g, '').slice(0, OTP_LENGTH) }),
      setPin: (pin) => set({ pin }),

      verifyOtp: async () => {
        set({ isVerifying: true });
        await new Promise((resolve) => setTimeout(resolve, VERIFY_MS));
        set({ isVerifying: false });
        return true;
      },

      confirmPin: (candidate) => {
        const matches = candidate === get().pin;
        if (matches) set({ isSignedIn: true });
        return matches;
      },

      unlockWithPin: async (candidate) => {
        // A stored PIN is required; without one there is nothing to check
        // against and the person has to go back through log in.
        if (!get().pin) return false;

        set({ isVerifying: true });
        await new Promise((resolve) => setTimeout(resolve, UNLOCK_MS));
        set({ isVerifying: false });

        return candidate === get().pin;
      },

      signIn: () => set({ isSignedIn: true }),
      signOut: () => set({ ...emptyDraft, pin: '', isSignedIn: false }),
      resetDraft: () => set(emptyDraft),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        safeStorage(Platform.OS === 'web' ? localStorageAdapter : secureStorage)
      ),
      // Only what a returning user should still have. The phone/OTP draft is
      // deliberately left behind.
      partialize: ({ pin, isSignedIn, profile }) => ({
        pin,
        isSignedIn,
        profile,
      }),
    }
  )
);

/** True once the phone number is long enough to submit. */
export const selectCanSubmitPhone = (state: AuthState) =>
  state.phone.length >= PHONE_MIN_DIGITS;

/** "Good morning" / "Good afternoon" / "Good evening", by the clock. */
export function greetingFor(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
