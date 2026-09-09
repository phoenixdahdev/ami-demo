import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/**
 * Where the simulation lives between launches.
 *
 * Two backends, picked by what the data is rather than by convenience:
 *
 * - `secret` is the iOS keychain / Android keystore, for the PIN. It is
 *   encrypted, but Android warns past 2 KB and can drop the write, so only
 *   small secrets go here.
 * - `device` is plain app storage — the phone's own sandbox for this app,
 *   wiped when the app is uninstalled. The ledger and the loan live here:
 *   they grow with every transaction and none of it is a secret.
 */

/** Persistence is a convenience; a failure must never keep the app from booting. */
const tolerant = (base: StateStorage): StateStorage => ({
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

const secret: StateStorage = tolerant({
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
});

const device: StateStorage = tolerant({
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
});

/** For `persist({ storage })`: the keychain. Small secrets only. */
export const secretStorage = <T>() => createJSONStorage<T>(() => secret);

/** For `persist({ storage })`: the app's own storage on the phone. */
export const deviceStorage = <T>() => createJSONStorage<T>(() => device);
