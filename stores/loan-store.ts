import {
  Assessment,
  assess,
  quote,
  Quote,
  TERMS_MONTHS,
} from '@/lib/loan-risk';
import { create } from 'zustand';

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

  setIdDocument: (doc: UploadedDocument) => void;
  setPayslip: (doc: UploadedDocument) => void;
  setMonthlyIncome: (value: string) => void;
  setMonthsEmployed: (value: string) => void;
  setPrincipal: (value: number) => void;
  setTermMonths: (value: number) => void;
  /** Runs the model against the collected inputs. */
  runAssessment: (balance: number) => Promise<Assessment>;
  accept: () => void;
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
};

/**
 * The loan application. Documents are real files the person picked; the
 * decision is real arithmetic over what they entered (see `lib/loan-risk`).
 * Only the delay is theatre.
 */
export const useLoanStore = create<LoanState>((set, get) => ({
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

  accept: () => set({ status: 'active' }),
  decline: () => set({ ...empty }),
  reset: () => set(empty),
}));

/** The live quote for the current principal and term, or null before an offer. */
export function selectQuote(state: LoanState): Quote | null {
  if (!state.assessment?.approved || state.principal <= 0) return null;
  return quote(state.assessment, state.principal, state.termMonths);
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
