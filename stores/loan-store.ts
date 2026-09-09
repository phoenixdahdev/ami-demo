import { deviceStorage } from '@/lib/storage';
import {
  Assessment,
  assess,
  quote,
  Quote,
  TERMS_MONTHS,
} from '@/lib/loan-risk';
import { toMinor } from '@/lib/money';
import { selectAccount, useLedgerStore } from '@/stores/ledger-store';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'am1.loan';

/** How long the simulated assessment appears to take. */
const ASSESS_MS = 2200;

export type UploadedDocument = {
  name: string;
  uri: string;
};

export type LoanStatus =
  | 'none'
  | 'collecting'
  | 'assessing'
  | 'offered'
  | 'declined'
  | 'active';

type LoanState = {
  status: LoanStatus;
  idDocument: UploadedDocument | null;
  payslip: UploadedDocument | null;
  monthlyIncome: string;
  monthsEmployed: string;
  assessment: Assessment | null;
  /** What the applicant asked for, and over how long. */
  principal: number;
  termMonths: number;
  /** Set when an offer is taken: when, and into which account it was paid. */
  acceptedAt: string | null;
  disbursedTo: string | null;

  setIdDocument: (doc: UploadedDocument) => void;
  setPayslip: (doc: UploadedDocument) => void;
  setMonthlyIncome: (value: string) => void;
  setMonthsEmployed: (value: string) => void;
  setPrincipal: (value: number) => void;
  setTermMonths: (value: number) => void;
  /** Runs the model against the collected inputs. */
  runAssessment: (balance: number) => Promise<Assessment>;
  /** Takes the offer and pays it into the selected account. */
  accept: () => void;
  /** Clears the balance owed and closes the loan. */
  settle: () => void;
  decline: () => void;
  reset: () => void;
};

const empty = {
  status: 'none' as LoanStatus,
  idDocument: null,
  payslip: null,
  monthlyIncome: '',
  monthsEmployed: '',
  assessment: null,
  principal: 0,
  termMonths: TERMS_MONTHS[1],
  acceptedAt: null,
  disbursedTo: null,
};

/**
 * The loan application. Documents are real files the person picked; the
 * decision is real arithmetic over what they entered (see `lib/loan-risk`).
 * Only the delay is theatre.
 *
 * Persisted, because a loan outlives the launch that took it out: a half-filled
 * application is still there tomorrow, and so is an active one.
 */
export const useLoanStore = create<LoanState>()(
  persist(
    (set, get) => ({
      ...empty,

      setIdDocument: (idDocument) => set({ idDocument, status: 'collecting' }),
      setPayslip: (payslip) => set({ payslip, status: 'collecting' }),
      setMonthlyIncome: (value) =>
        set({ monthlyIncome: value.replace(/\D/g, '').slice(0, 7) }),
      setMonthsEmployed: (value) =>
        set({ monthsEmployed: value.replace(/\D/g, '').slice(0, 3) }),
      setPrincipal: (principal) => set({ principal }),
      setTermMonths: (termMonths) => set({ termMonths }),

      runAssessment: async (balance) => {
        const state = get();
        set({ status: 'assessing' });

        await new Promise((resolve) => setTimeout(resolve, ASSESS_MS));

        const assessment = assess({
          monthlyIncome: Number(state.monthlyIncome || 0),
          monthsEmployed: Number(state.monthsEmployed || 0),
          balance,
          hasIdDocument: !!state.idDocument,
          hasPayslip: !!state.payslip,
        });

        set({
          assessment,
          status: assessment.approved ? 'offered' : 'declined',
          // Open on the full offer; the applicant can dial it down.
          principal: assessment.maxAmount,
        });

        return assessment;
      },

      accept: () => {
        const { assessment, principal, termMonths, status } = get();
        if (status === 'active' || !assessment?.approved || principal <= 0) {
          return;
        }

        // The money has to land somewhere: paying it out is what makes this an
        // offer rather than a screen.
        const ledger = useLedgerStore.getState();
        const account = selectAccount(ledger);

        ledger.post({
          accountId: account.id,
          merchant: 'Loan disbursement',
          category: `${termMonths} months at ${assessment.aprPercent}% APR`,
          amount: toMinor(principal),
        });

        set({
          status: 'active',
          acceptedAt: new Date().toISOString(),
          disbursedTo: account.id,
        });
      },

      settle: () => {
        const { assessment, principal, disbursedTo, status } = get();
        if (status !== 'active' || !assessment) return;

        const ledger = useLedgerStore.getState();
        const account =
          ledger.accounts.find((item) => item.id === disbursedTo) ??
          selectAccount(ledger);

        // Settling early clears the principal and the financed premium; the
        // interest that would have accrued over the remaining term does not.
        const owed = quote(assessment, principal, get().termMonths);

        ledger.post({
          accountId: account.id,
          merchant: 'Loan settled',
          category: 'Loan closed early',
          amount: -toMinor(owed.principal + owed.insurance),
        });

        set(empty);
      },

      decline: () => set({ ...empty }),
      reset: () => set(empty),
    }),
    {
      name: STORAGE_KEY,
      storage: deviceStorage(),
      partialize: (state) => ({
        // Being mid-assessment is not a state worth restoring — the timer that
        // would end it died with the launch. Come back to the form instead.
        status: state.status === 'assessing' ? 'collecting' : state.status,
        idDocument: state.idDocument,
        payslip: state.payslip,
        monthlyIncome: state.monthlyIncome,
        monthsEmployed: state.monthsEmployed,
        assessment: state.assessment,
        principal: state.principal,
        termMonths: state.termMonths,
        acceptedAt: state.acceptedAt,
        disbursedTo: state.disbursedTo,
      }),
    }
  )
);

/**
 * Builds the quote for a given application state.
 *
 * Deliberately NOT a zustand selector: it constructs a new object, and zustand
 * compares snapshots by reference — used as a selector it would re-render
 * forever ("The result of getSnapshot should be cached"). Call it from a
 * `useMemo` over the three values it reads.
 */
export function buildQuote(
  assessment: Assessment | null,
  principal: number,
  termMonths: number
): Quote | null {
  if (!assessment?.approved || principal <= 0) return null;
  return quote(assessment, principal, termMonths);
}

/** True once both documents and both figures are in. */
export function selectCanAssess(state: LoanState) {
  return (
    !!state.idDocument &&
    !!state.payslip &&
    Number(state.monthlyIncome) > 0 &&
    Number(state.monthsEmployed) > 0
  );
}
