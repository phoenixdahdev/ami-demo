/**
 * The lending decision.
 *
 * There is no bureau to call, so the score is computed here from what the
 * applicant actually supplied — income, how long they have been employed, and
 * the balance they already hold with us. The arithmetic below is the whole
 * model: it is deliberately legible so the offer screen can explain itself,
 * and so the numbers move when the inputs do.
 */

export type RiskBand = 'A' | 'B' | 'C' | 'D';

export type RiskInputs = {
  /** Net monthly income, in whole currency units. */
  monthlyIncome: number;
  monthsEmployed: number;
  /** What they already hold with us, as a stability signal. */
  balance: number;
  hasIdDocument: boolean;
  hasPayslip: boolean;
};

export type Assessment = {
  score: number;
  band: RiskBand;
  approved: boolean;
  /** Annual percentage rate offered to this band. */
  aprPercent: number;
  /** One-off credit-life premium, as a percentage of the principal. */
  insuranceRatePercent: number;
  /** The most we will lend, derived from income. */
  maxAmount: number;
  /** What drove the score, for the offer screen to show. */
  factors: { label: string; points: number }[];
};

export const TERMS_MONTHS = [6, 12, 24];

const BAND_TERMS: Record<Exclude<RiskBand, 'D'>, {
  apr: number;
  insurance: number;
  incomeMultiple: number;
}> = {
  A: { apr: 12, insurance: 1.5, incomeMultiple: 6 },
  B: { apr: 18, insurance: 2.5, incomeMultiple: 4 },
  C: { apr: 26, insurance: 3.5, incomeMultiple: 2.5 },
};

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));

/** Rounds down to a figure a bank would actually quote. */
const toLendableAmount = (value: number) => Math.floor(value / 50) * 50;

export function assess(inputs: RiskInputs): Assessment {
  // Tuned so the bands actually discriminate: a mid earner with a year of
  // tenure lands in C, not A. Ceilings keep any single factor from carrying
  // an application on its own.
  const income = clamp(inputs.monthlyIncome / 250, 25);
  const tenure = clamp(inputs.monthsEmployed / 2, 20);
  const holdings = clamp((inputs.balance / 2000) * 3, 15);
  const identity = inputs.hasIdDocument ? 5 : 0;
  const employment = inputs.hasPayslip ? 5 : 0;

  const factors = [
    { label: 'Monthly income', points: Math.round(income) },
    { label: 'Time in employment', points: Math.round(tenure) },
    { label: 'Balance held with us', points: Math.round(holdings) },
    { label: 'Identity verified', points: identity },
    { label: 'Employment verified', points: employment },
  ];

  const score = Math.min(
    100,
    Math.round(20 + income + tenure + holdings + identity + employment)
  );

  const band: RiskBand =
    score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D';

  if (band === 'D') {
    return {
      score,
      band,
      approved: false,
      aprPercent: 0,
      insuranceRatePercent: 0,
      maxAmount: 0,
      factors,
    };
  }

  const terms = BAND_TERMS[band];

  return {
    score,
    band,
    approved: true,
    aprPercent: terms.apr,
    insuranceRatePercent: terms.insurance,
    maxAmount: toLendableAmount(inputs.monthlyIncome * terms.incomeMultiple),
    factors,
  };
}

export type Quote = {
  principal: number;
  termMonths: number;
  aprPercent: number;
  /** The credit-life premium, financed alongside the principal. */
  insurance: number;
  monthlyPayment: number;
  totalRepayable: number;
  totalInterest: number;
};

/**
 * A standard annuity: the premium is financed with the principal, then the
 * whole balance amortises over the term at the band's monthly rate.
 */
export function quote(
  assessment: Assessment,
  principal: number,
  termMonths: number
): Quote {
  const insurance =
    Math.round(principal * assessment.insuranceRatePercent) / 100;
  const financed = principal + insurance;
  const monthlyRate = assessment.aprPercent / 100 / 12;

  const monthlyPayment =
    monthlyRate === 0
      ? financed / termMonths
      : (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

  const totalRepayable = monthlyPayment * termMonths;

  return {
    principal,
    termMonths,
    aprPercent: assessment.aprPercent,
    insurance,
    monthlyPayment,
    totalRepayable,
    totalInterest: totalRepayable - financed,
  };
}

export const money = (value: number) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const BAND_LABEL: Record<RiskBand, string> = {
  A: 'Excellent',
  B: 'Good',
  C: 'Fair',
  D: 'Not eligible',
};
