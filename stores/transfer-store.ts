import { RECIPIENT, Recipient } from '@/constants/transfer-data';
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
  send: () => Promise<void>;
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
 * `send` waits and resolves — there is nothing to talk to.
 */
export const useTransferStore = create<TransferState>((set) => ({
  ...empty,

  setRecipient: (recipient) => set({ recipient }),
  setAmount: (amount) => set({ amount: amount.replace(/\D/g, '').slice(0, 9) }),
  setNote: (note) => set({ note }),

  send: async () => {
    set({ isSending: true });
    await new Promise((resolve) => setTimeout(resolve, SEND_MS));
    set({ isSending: false });
  },

  reset: () => set(empty),
}));

/** The amount as a number, 0 when empty. */
export const selectAmountValue = (state: TransferState) =>
  Number(state.amount || 0);
