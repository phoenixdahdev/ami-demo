import { useAuthStore } from '@/stores/auth-store';
import { useLedgerStore } from '@/stores/ledger-store';
import { useLoanStore } from '@/stores/loan-store';
import { useTransferStore } from '@/stores/transfer-store';

/**
 * The simulation's lifecycle, in one place.
 *
 * Signing up doesn't only flip a flag — it opens the accounts, writes their
 * history and puts money in them. Keeping that here rather than in the auth
 * store means the stores stay independent of each other's ordering, and there
 * is a single answer to "what happens when someone joins".
 */

/** Sign up finished: open the accounts and let them in. */
export function startSimulation(): void {
  useLedgerStore.getState().seed();
}

/**
 * Logged in on a device that has no ledger yet. Seeding is idempotent, so an
 * existing customer keeps the balances they left.
 */
export function resumeSimulation(): void {
  useAuthStore.getState().signIn();
  useLedgerStore.getState().seed();
}

/**
 * Wipes the simulation: the account, the money, the loan, and everything they
 * left on the phone. The next launch starts at onboarding.
 *
 * State is reset before storage is cleared. The two can race — persist writes
 * the reset state back as `clearStorage` removes it — but both outcomes are
 * the fresh-install state, so either is correct.
 */
export async function resetSimulation(): Promise<void> {
  useTransferStore.getState().reset();
  useLoanStore.getState().reset();
  useLedgerStore.getState().reset();
  useAuthStore.getState().signOut();

  await Promise.all([
    useLoanStore.persist.clearStorage(),
    useLedgerStore.persist.clearStorage(),
    useAuthStore.persist.clearStorage(),
  ]);
}
