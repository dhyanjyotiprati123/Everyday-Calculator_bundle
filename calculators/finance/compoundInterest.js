import { compoundAmount, COMPOUNDING_OPTIONS } from '../../utils/finance';
import { formatINR, formatINRShort, formatINRWords, formatPercent } from '../../utils/format';
import { amountField, choiceField, rateField, yearsField } from '../fields';

const FREQUENCIES = [...COMPOUNDING_OPTIONS, { value: '365', label: 'Daily' }];

export default {
  fields: [
    amountField('principal', 'Principal amount', '100000', { decimal: true }),
    rateField('rate', 'Interest rate', '8'),
    yearsField('years', 'Time period', '5', { min: 0.1 }),
    choiceField('frequency', 'Compounded', FREQUENCIES, '1'),
  ],

  compute({ principal, rate, years, frequency }) {
    const periods = Number(frequency);
    const total = compoundAmount(principal, rate, years, periods);
    const interest = total - principal;
    const effectiveRate = ((1 + rate / 100 / periods) ** periods - 1) * 100;
    const wholeYears = Math.min(Math.floor(years), 50);

    return {
      primary: { label: 'Total amount', value: formatINR(total), caption: `${formatINR(interest)} interest earned` },
      rows: [
        { label: 'Principal', value: formatINR(principal) },
        { label: 'Compound interest', value: formatINR(interest), tone: 'positive' },
        { label: 'Effective annual rate', value: formatPercent(effectiveRate) },
        { label: 'Total amount', value: formatINR(total), strong: true },
      ],
      breakdown: [
        { label: 'Principal', amount: principal, display: formatINR(principal) },
        { label: 'Interest', amount: interest, display: formatINR(interest) },
      ],
      table:
        wholeYears >= 2
          ? {
              title: 'Balance by year',
              columns: ['Year', 'Balance'],
              rows: Array.from({ length: wholeYears }, (_, index) => [
                String(index + 1),
                formatINRShort(compoundAmount(principal, rate, index + 1, periods)),
              ]),
            }
          : undefined,
    };
  },

  summary: ({ principal, rate }) => `${formatINRWords(principal)} at ${formatPercent(rate)}`,
  note: 'Amount = P × (1 + r/n)^(n × t), where n is the number of times interest is added each year.',
};
