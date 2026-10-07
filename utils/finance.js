// Shared financial maths. Rates are annual percentages (8.5 means 8.5% p.a.).

// Equated monthly instalment on a reducing balance.
export function loanEmi(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const growth = (1 + r) ** months;
  return (principal * r * growth) / (growth - 1);
}

// Year-by-year amortisation: principal and interest paid, balance left.
export function amortizeByYear(principal, annualRate, months, emi) {
  const r = annualRate / 12 / 100;
  const years = [];
  let balance = principal;
  let year = { principal: 0, interest: 0 };

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * r;
    const principalPaid = Math.min(emi - interest, balance);
    balance -= principalPaid;
    year.principal += principalPaid;
    year.interest += interest;
    if (month % 12 === 0 || month === months) {
      years.push({ year: years.length + 1, ...year, balance: Math.max(0, balance) });
      year = { principal: 0, interest: 0 };
    }
  }
  return years;
}

// Amount after compounding `periodsPerYear` times a year for `years`.
export function compoundAmount(principal, annualRate, years, periodsPerYear = 1) {
  return principal * (1 + annualRate / 100 / periodsPerYear) ** (periodsPerYear * years);
}

export const COMPOUNDING_OPTIONS = [
  { value: '12', label: 'Monthly' },
  { value: '4', label: 'Quarterly' },
  { value: '2', label: 'Half-yearly' },
  { value: '1', label: 'Yearly' },
];
