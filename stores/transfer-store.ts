import { RECIPIENT, Recipient } from '@/constants/transfer-data';
import { toMinor } from '@/lib/money';
import {
  canAfford,
  LedgerEntry,
  selectAccount,
  useLedgerStore,
} from '@/stores/ledger-store';
import { create } from 'zustand';

/** How long the simulated send "takes". */
const SEND_MS = 1200;

type TransferState = {
  recipient: Recipient;
  /** Digits only, in whole currency units. */
  amount: string;
  note: string;
  reference: string;
  isSending: boolean;

  setRecipient: (recipient: Recipient) => void;
  setAmount: (amount: string) => void;
  setNote: (note: string) => void;
  /** Debits the selected account and writes the statement line. */
  send: () => Promise<LedgerEntry | null>;
  reset: () => void;
};

const empty = {
  recipient: RECIPIENT,
  amount: '',
  note: '',
  reference: 'Sent from DigiFin',
  isSending: false,
};

/**
 * The transfer draft, shared across the hub, the amount step and the review.
 *
 * Not persisted: a half-typed payment is not something to hand back to someone
 * days later. What it produces — the movement on the account — is persisted, by
 * the ledger.
 */
export const useTransferStore = create<TransferState>((set, get) => ({
  ...empty,

  setRecipient: (recipient) => set({ recipient }),
  setAmount: (amount) => set({ amount: amount.replace(/\D/g, '').slice(0, 9) }),
  setNote: (note) => set({ note }),

  send: async () => {
    const { recipient, note, amount } = get();
    const minor = toMinor(Number(amount || 0));

    const ledger = useLedgerStore.getState();
    const source = selectAccount(ledger);

    // The screen disables the button, but the store is the thing that moves the
    // money, so it does its own check rather than trusting the caller.
    if (!canAfford(source, minor)) return null;

    set({ isSending: true });
    await new Promise((resolve) => setTimeout(resolve, SEND_MS));

    const entry = ledger.post({
      accountId: source.id,
      merchant: recipient.name,
      category: note.trim() || 'Transfers',
      amount: -minor,
      logo: 'payee',
    });

    set({ isSending: false });
    return entry;
  },

  reset: () => set(empty),
}));

/** The amount as a number, 0 when empty. */
export const selectAmountValue = (state: TransferState) =>
  Number(state.amount || 0);
