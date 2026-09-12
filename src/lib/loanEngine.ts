export type RepaymentFrequency = 'weekly' | 'monthly';
export type CalculationMethod = 'flat' | 'reducing';

export type LoanType = 
  | 'logbook' 
  | 'imara' 
  | 'nawiri' 
  | 'dharura' 
  | 'busara' 
  | 'dairy' 
  | 'wash'
  | 'mali'
  | 'housing'
  | 'ipf'
  | 'green-energy'
  | 'boresha';

export interface LoanInput {
  loanType: LoanType;
  loanAmount: number;
  repaymentPeriod: number; // in months
  repaymentFrequency: RepaymentFrequency;
  calculationMethod: CalculationMethod;
  // Optional modifiers
  isFirstTime?: boolean;
  hasNawiriLoan?: boolean;
  vehicleValue?: number;
  isInGroup?: boolean;
}

export interface FeeBreakdown {
  label: string;
  amount: number;
  isDeducted: boolean; // if true, deducted from disbursed amount. If false, it's paid upfront or separately
}

export interface LockedFundBreakdown {
  label: string;
  amount: number;
}

export interface LoanOutput {
  interestRate: number; // annual or monthly based on internal logic, but we'll store display rate
  rateType: 'monthly' | 'annually' | 'upfront';
  totalInterest: number;
  fees: FeeBreakdown[];
  lockedFunds: LockedFundBreakdown[];
  totalDeductions: number;
  netDisbursedAmount: number;
  totalRepayable: number;
  installmentAmount: number; // Based on required frequency
  monthlyEquivalent: number;
  weeklyEquivalent: number;
  yearlyEquivalent: number; // for info
  error?: string;
  warnings?: string[];
}

export const PMT = (ratePerPeriod: number, periods: number, presentValue: number) => {
  if (ratePerPeriod === 0) return presentValue / periods;
  return (presentValue * ratePerPeriod) / (1 - Math.pow(1 + ratePerPeriod, -periods));
};

export const calculateLoan = (input: LoanInput): LoanOutput => {
  const {
    loanType,
    loanAmount,
    repaymentPeriod,
    repaymentFrequency,
    calculationMethod,
    isFirstTime = false,
    hasNawiriLoan = false,
    vehicleValue = 0,
    isInGroup = false,
  } = input;

  let out: LoanOutput = {
    interestRate: 0,
    rateType: 'monthly',
    totalInterest: 0,
    fees: [],
    lockedFunds: [],
    totalDeductions: 0,
    netDisbursedAmount: loanAmount,
    totalRepayable: loanAmount,
    installmentAmount: 0,
    monthlyEquivalent: 0,
    weeklyEquivalent: 0,
    yearlyEquivalent: 0,
    warnings: [],
  };

  // Base interest calculations
  let monthlyRate = 0;
  let flatTotalInterest = 0;
  let forceFlat = false;

  switch (loanType) {
    case 'logbook':
      if (vehicleValue > 0) {
        const maxLoan = vehicleValue * 0.7;
        const minLoan = vehicleValue * 0.5;
        // Just warning if out of bounds, but process anyway or throw error?
        if (loanAmount > maxLoan) {
          out.error = `Loan amount exceeds 70% of vehicle value (Max: ${maxLoan.toLocaleString()})`;
          return out;
        }
      }
      out.interestRate = 3;
      out.rateType = 'monthly';
      monthlyRate = 0.03;
      
      const processing = loanAmount * 0.03;
      const insurance = loanAmount * 0.025;
      out.fees.push(
        { label: 'Processing Fee (3%)', amount: processing, isDeducted: true },
        { label: 'Insurance Fee (2.5%)', amount: insurance, isDeducted: true },
        { label: 'Tracker Installation', amount: 10000, isDeducted: false },
        { label: 'Logbook Registration', amount: 2000, isDeducted: false },
        { label: 'Valuation', amount: 3500, isDeducted: false }
      );
      break;

    case 'imara':
      out.interestRate = 2;
      out.rateType = 'monthly';
      monthlyRate = 0.02;
      
      out.fees.push({ label: 'Fees (5%)', amount: loanAmount * 0.05, isDeducted: true });
      out.lockedFunds.push(
        { label: 'Security Guarantee (26%)', amount: loanAmount * 0.26 },
        { label: 'Group Collateral Fund (10%)', amount: loanAmount * 0.10 }
      );
      break;

    case 'nawiri':
      if (isFirstTime && loanAmount > 30000) {
        out.error = 'First time Nawiri loan cannot exceed 30,000.';
        return out;
      }
      out.interestRate = 2;
      out.rateType = 'monthly';
      monthlyRate = 0.02;

      out.fees.push({ label: 'Fees (5%)', amount: loanAmount * 0.05, isDeducted: true });
      out.lockedFunds.push({ label: 'Security Guarantee (26%)', amount: loanAmount * 0.26 });
      
      if (repaymentFrequency !== 'weekly') {
        out.warnings?.push("Nawiri loans support weekly repayment only. Values calculated as weekly.");
      }
      break;

    case 'dharura':
      if (!hasNawiriLoan || !isInGroup) {
        out.error = 'Eligibility Error: Must be servicing a Nawiri loan and be in a group to qualify for Dharura.';
        return out;
      }
      if (loanAmount > 10000) {
        out.error = 'Dharura loan maximum amount is KShs 10,000.';
        return out;
      }
      if (repaymentPeriod > 3) {
        out.error = 'Dharura loan maximum duration is 3 months.';
        return out;
      }
      out.interestRate = 6;
      out.rateType = 'monthly';
      monthlyRate = 0.06;
      break;

    case 'busara':
      if (!hasNawiriLoan || !isInGroup) {
        out.error = 'Eligibility Error: Must be servicing a Nawiri loan and be in a group to qualify for Busara.';
        return out;
      }
      out.interestRate = 2;
      out.rateType = 'monthly';
      monthlyRate = 0.02;
      
      out.fees.push({ label: 'Fees (5%)', amount: loanAmount * 0.05, isDeducted: true });
      out.lockedFunds.push({ label: 'Security Guarantee (26%)', amount: loanAmount * 0.26 });
      break;

    case 'dairy':
      out.interestRate = 2;
      out.rateType = 'monthly';
      monthlyRate = 0.02;
      
      out.lockedFunds.push({ label: 'Security Guarantee (26%)', amount: loanAmount * 0.26 });
      if (repaymentFrequency !== 'weekly') {
        out.warnings?.push("Dairy loans target weekly repayment. Values calculated accordingly.");
      }
      break;

    case 'wash':
      out.interestRate = 1.8;
      out.rateType = 'monthly';
      monthlyRate = 0.018;
      out.fees.push({ label: 'Fees (5%)', amount: loanAmount * 0.05, isDeducted: true });
      break;

    case 'mali':
      out.interestRate = 2;
      out.rateType = 'monthly';
      monthlyRate = 0.02;
      out.fees.push({ label: 'Processing Fee (3%)', amount: loanAmount * 0.03, isDeducted: true });
      break;

    case 'housing':
      out.interestRate = 2;
      out.rateType = 'monthly';
      monthlyRate = 0.02;
      out.fees.push({ label: 'Processing Fee (2%)', amount: loanAmount * 0.02, isDeducted: true });
      break;

    case 'ipf':
      out.interestRate = 3.3;
      out.rateType = 'monthly';
      monthlyRate = 0.033;
      break;

    case 'green-energy':
      out.interestRate = 1.8; // Assume competitive rate like WASH or Mali
      out.rateType = 'monthly';
      monthlyRate = 0.018;
      out.fees.push({ label: 'Fees (5%)', amount: loanAmount * 0.05, isDeducted: true });
      break;

    case 'boresha':
      if (isFirstTime && loanAmount > 10000) {
        out.error = 'First-time loan limit for Boresha is KES 10,000.';
        return out;
      }
      if (repaymentPeriod > 3) {
        out.error = 'Boresha loan maximum duration is 3 months.';
        return out;
      }
      out.interestRate = 2; // competitive monthly rate
      out.rateType = 'monthly';
      monthlyRate = 0.02;
      
      out.fees.push({ label: 'Fees (5%)', amount: loanAmount * 0.05, isDeducted: true });
      out.lockedFunds.push({ label: 'Security Guarantee (26%)', amount: loanAmount * 0.26 });
      
      if (repaymentFrequency !== 'weekly') {
        out.warnings?.push("Boresha loans support weekly repayment only. Values calculated as weekly.");
      }
      break;

    default:
      out.error = 'Unknown loan type.';
      return out;
  }

  // Calculate Net Disbursed and Upfront
  out.totalDeductions = out.fees.filter(f => f.isDeducted).reduce((acc, f) => acc + f.amount, 0);
  out.totalDeductions += out.lockedFunds.reduce((acc, f) => acc + f.amount, 0);
  
  out.netDisbursedAmount = loanAmount - out.totalDeductions;

  // Interest and Total Repayable Calculation
  if (forceFlat) {
    // IPF has fixed interest paid upfront
    out.totalInterest = flatTotalInterest;
    out.totalRepayable = loanAmount; // Full principle is repayable over the 3 months, interest already deducted.
  } else {
    if (calculationMethod === 'reducing') {
      out.monthlyEquivalent = PMT(monthlyRate, repaymentPeriod, loanAmount);
      out.totalRepayable = out.monthlyEquivalent * repaymentPeriod;
      out.totalInterest = out.totalRepayable - loanAmount;
    } else {
      // Flat rate (Default UX)
      out.totalInterest = loanAmount * monthlyRate * repaymentPeriod;
      out.totalRepayable = loanAmount + out.totalInterest;
    }
  }

  // Equivalents
  out.monthlyEquivalent = out.totalRepayable / repaymentPeriod;
  out.weeklyEquivalent = out.totalRepayable / (repaymentPeriod * 4);
  out.yearlyEquivalent = out.monthlyEquivalent * 12;

  // Enforced Frequency installment
  if (loanType === 'nawiri' || loanType === 'dairy' || loanType === 'boresha') {
    out.installmentAmount = out.weeklyEquivalent;
  } else {
    out.installmentAmount = repaymentFrequency === 'weekly' ? out.weeklyEquivalent : out.monthlyEquivalent;
  }

  return out;
};
