import {
  Account,
  ACCOUNT_PROFILES,
  OPENING_BALANCES,
} from '@/constants/accounts-data';
import { deviceStorage } from '@/lib/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'am1.ledger';

/** Statement lines kept per account. Storage is cheap, but not unbounded. */
const HISTORY_LIMIT = 120;

const DAY_MS = 24 * 60 * 60 * 1000;

/** One movement on an account. Amounts are signed minor units. */
export type LedgerEntry = {
  id: string;
  accountId: string;
  merchant: string;
  category: string;
  amount: number;
  /** ISO timestamp — a `Date` would not survive JSON. */
  date: string;
  /** Key into `MERCHANT_LOGOS`; absent rows fall back to an initial. */
  logo?: string;
};

type Posting = Omit<LedgerEntry, 'id' | 'date'> & { date?: string };

type LedgerState = {
  /** When the simulation was opened, or null before sign up. */
  openedAt: string | null;
  accounts: Account[];
  /** Newest first, across every account. */
  transactions: LedgerEntry[];
  /** Which account the balance panel and the transfer flow are pointed at. */
  selectedId: string;

  select: (id: string) => void;
  /** Opens the accounts and writes their history. Safe to call twice. */
  seed: () => void;
  /** Applies a movement and records it. */
  post: (entry: Posting) => LedgerEntry;
  reset: () => void;
};

/** Profiles at zero — what the store looks like before anything is posted. */
const emptyAccounts = (): Account[] =>
  ACCOUNT_PROFILES.map((profile) => ({ ...profile, balance: 0 }));

/**
 * The history each account is opened with. These sum exactly to
 * `OPENING_BALANCES`, so the balance on screen is the sum of the rows under it
 * rather than a number that happens to sit above an unrelated list.
 */
const openingHistory = (now: number): Posting[] => [
  {
    accountId: 'main-usd',
    merchant: 'Opening deposit',
    category: 'Account opened',
    amount: 2_000_000,
    date: new Date(now - 6 * DAY_MS).toISOString(),
  },
  {
    accountId: 'main-usd',
    merchant: 'Northwind Traders',
    category: 'Salary',
    amount: 75_133,
    date: new Date(now - 4 * DAY_MS).toISOString(),
  },
  {
    accountId: 'main-usd',
    merchant: 'Starbucks',
    category: 'Coffee & restaurants',
    amount: -133,
    logo: 'starbucks',
    date: new Date(now - 2 * DAY_MS).toISOString(),
  },
  {
    accountId: 'euro',
    merchant: 'Opening deposit',
    category: 'Account opened',
    amount: 400_000,
    date: new Date(now - 6 * DAY_MS).toISOString(),
  },
  {
    accountId: 'euro',
    merchant: 'Currency exchange',
    category: 'Transfers',
    amount: 8_300,
    date: new Date(now - 3 * DAY_MS).toISOString(),
  },
  {
    accountId: 'savings-gbp',
    merchant: 'Opening deposit',
    category: 'Account opened',
    amount: 31_000,
    date: new Date(now - 6 * DAY_MS).toISOString(),
  },
];

const initial = {
  openedAt: null,
  accounts: emptyAccounts(),
  transactions: [] as LedgerEntry[],
  selectedId: ACCOUNT_PROFILES[0].id,
};

let sequence = 0;
const nextId = () => `tx-${Date.now().toString(36)}-${(sequence++).toString(36)}`;

/**
 * The money in the simulation: what each account holds and every movement that
 * got it there. Persisted to the phone, so the balance you left is the balance
 * you come back to.
 *
 * Everything that moves money goes through `post` — transfers, loan payouts,
 * the opening deposits — which keeps the balance and the statement in step by
 * construction rather than by remembering to update both.
 */
export const useLedgerStore = create<LedgerState>()(
  persist(
    (set, get) => ({
      ...initial,

      select: (selectedId) => set({ selectedId }),

      post: ({ date, ...posting }) => {
        const entry: LedgerEntry = {
          ...posting,
          id: nextId(),
          date: date ?? new Date().toISOString(),
        };

        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === entry.accountId
              ? { ...account, balance: account.balance + entry.amount }
              : account
          ),
          // Kept newest first by date rather than by arrival: the opening
          // history is written back-dated and interleaved across accounts, so
          // the order things are posted in is not the order they happened in.
          // Sorting is stable, so same-instant entries keep the new one first.
          transactions: [entry, ...state.transactions]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, HISTORY_LIMIT),
        }));

        return entry;
      },

      seed: () => {
        // Idempotent: signing up twice on one device shouldn't double the
        // opening balances.
        if (get().openedAt) return;

        const now = Date.now();

        set({
          openedAt: new Date(now).toISOString(),
          accounts: emptyAccounts(),
          transactions: [],
          selectedId: ACCOUNT_PROFILES[0].id,
        });

        openingHistory(now).forEach(get().post);
      },

      reset: () =>
        set({ ...initial, accounts: emptyAccounts(), transactions: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: deviceStorage(),
      partialize: ({ openedAt, accounts, transactions, selectedId }) => ({
        openedAt,
        accounts,
        transactions,
        selectedId,
      }),
    }
  )
);

/**
 * The selected account, falling back to the first if the id ever goes stale.
 * Returns the element itself, so the reference only changes when the account
 * does — which is what zustand compares snapshots by.
 */
export function selectAccount(state: LedgerState): Account {
  return (
    state.accounts.find((account) => account.id === state.selectedId) ??
    state.accounts[0]
  );
}

/** Every account's balance added up, for the "all cards" total. */
export function selectTotalBalance(state: LedgerState): number {
  return state.accounts.reduce((sum, account) => sum + account.balance, 0);
}

/** Looks an account up by the last four digits its card shows. */
export function accountByLast4(
  accounts: Account[],
  last4: string
): Account | undefined {
  return accounts.find((account) => account.last4 === last4);
}

/** Sanity-checks a debit before it is posted. */
export function canAfford(account: Account | undefined, minor: number) {
  return !!account && minor > 0 && account.balance >= minor;
}
