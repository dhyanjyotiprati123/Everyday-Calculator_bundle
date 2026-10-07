import { formatINR, formatINRWords, formatPercent } from '../../utils/format';
import { amountField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('principal', 'Principal amount', '100000', { decimal: true }),
    rateField('rate', 'Interest rate', '8', { max: 100 }),
    yearsField('years', 'Time period', '3', { min: 0.01 }),
  ],

  compute({ principal, rate, years }) {
    const interest = (principal * rate * years) / 100;
    const total = principal + interest;

    return {
      primary: { label: 'Simple interest', value: formatINR(interest, { maxDecimals: 2 }), caption: `on ${formatINR(principal)} at ${formatPercent(rate)} a year` },
      rows: [
        { label: 'Principal', value: formatINR(principal, { maxDecimals: 2 }) },
        { label: 'Interest', value: formatINR(interest, { maxDecimals: 2 }), tone: 'positive' },
        { label: 'Total amount', value: formatINR(total, { maxDecimals: 2 }), strong: true },
      ],
      breakdown: [
        { label: 'Principal', amount: principal, display: formatINR(principal) },
        { label: 'Interest', amount: interest, display: formatINR(interest) },
      ],
    };
  },

  summary: ({ principal, rate }) => `${formatINRWords(principal)} at ${formatPercent(rate)}`,
  note: 'Simple interest = Principal × Rate × Time ÷ 100. Interest is earned on the principal only.',
};
