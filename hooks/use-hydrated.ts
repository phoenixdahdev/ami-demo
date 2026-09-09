import { useAuthStore } from '@/stores/auth-store';
import { useLedgerStore } from '@/stores/ledger-store';
import { useLoanStore } from '@/stores/loan-store';
import { useEffect, useState } from 'react';

type Hydratable = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
};

/** Every store that reads from the phone on boot. */
const PERSISTED: Hydratable[] = [useAuthStore, useLedgerStore, useLoanStore];

const allHydrated = () => PERSISTED.every((store) => store.persist.hasHydrated());

/**
 * True once every persisted store has finished reading from the phone.
 *
 * The reads are asynchronous, so for the first moments of a launch a returning
 * customer looks exactly like a new one — signed out, no accounts. Anything
 * that decides where to send them has to wait for this, or it will bounce them
 * to onboarding and throw away their session.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    if (hydrated) return;

    let cancelled = false;
    const check = () => {
      if (!cancelled && allHydrated()) setHydrated(true);
    };

    const unsubscribe = PERSISTED.map((store) =>
      store.persist.onFinishHydration(check)
    );

    // A store may have finished between the render and this effect, in which
    // case its listener will never fire.
    check();

    return () => {
      cancelled = true;
      unsubscribe.forEach((off) => off());
    };
  }, [hydrated]);

  return hydrated;
}
