import { amortizeByYear, loanEmi } from '../../utils/finance';
import { formatINR, formatINRShort, formatINRWords, plural } from '../../utils/format';
import { amountField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('amount', 'Loan amount', '1000000', { min: 1000 }),
    rateField('rate', 'Interest rate', '8.5'),
    yearsField('years', 'Loan tenure', '20', { max: 40 }),
  ],

  compute({ amount, rate, years }) {
    const months = Math.max(1, Math.round(years * 12));
    const emi = loanEmi(amount, rate, months);
    const total = emi * months;
    const interest = Math.max(0, total - amount); // guards float noise at 0%

    return {
      primary: { label: 'Monthly EMI', value: formatINR(emi), caption: `for ${plural(months, 'month')}` },
      rows: [
        { label: 'Principal amount', value: formatINR(amount) },
        { label: 'Total interest', value: formatINR(interest) },
        { label: 'Total payable', value: formatINR(total), strong: true },
      ],
      breakdown: [
        { label: 'Principal', amount, display: formatINR(amount) },
        { label: 'Interest', amount: interest, display: formatINR(interest) },
      ],
      table: {
        title: 'Year-by-year repayment',
        columns: ['Year', 'Principal', 'Interest', 'Balance'],
        rows: amortizeByYear(amount, rate, months, emi).map((row) => [
          String(row.year),
          formatINRShort(row.principal),
          formatINRShort(row.interest),
          formatINRShort(row.balance),
        ]),
      },
    };
  },

  summary: ({ amount }) => `${formatINRWords(amount)} loan`,
  note: 'Uses the reducing-balance method with monthly rests, as most Indian banks do. Processing fees and insurance are not included.',
};
