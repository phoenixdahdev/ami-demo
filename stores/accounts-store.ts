import { ACCOUNTS } from '@/constants/accounts-data';
import { create } from 'zustand';

type AccountsState = {
  /** Which account the balance panel is showing. */
  selectedId: string;
  select: (id: string) => void;
};

/**
 * Lives in a store rather than the screen because the source sheet is its own
 * route — it has no parent to hand a setter down from.
 */
export const useAccountsStore = create<AccountsState>((set) => ({
  selectedId: ACCOUNTS[0].id,
  select: (selectedId) => set({ selectedId }),
}));

/** The selected account, falling back to the first if the id ever goes stale. */
export function selectAccount(state: AccountsState) {
  return ACCOUNTS.find((a) => a.id === state.selectedId) ?? ACCOUNTS[0];
}
