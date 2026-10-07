import { compoundAmount } from '../../utils/finance';
import { formatINR, formatINRShort, formatINRWords } from '../../utils/format';
import { amountField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('amount', 'Investment amount', '100000', { min: 100 }),
    rateField('rate', 'Expected return', '12', { max: 40 }),
    yearsField('years', 'Time period', '10', { decimal: false, min: 1 }),
  ],

  compute({ amount, rate, years }) {
    const value = compoundAmount(amount, rate, years);
    const returns = value - amount;
    const yearly = Array.from({ length: years }, (_, index) => [
      String(index + 1),
      formatINRShort(compoundAmount(amount, rate, index + 1)),
    ]);

    return {
      primary: { label: 'Estimated value', value: formatINR(value), caption: `after ${years} ${years === 1 ? 'year' : 'years'}` },
      rows: [
        { label: 'Amount invested', value: formatINR(amount) },
        { label: 'Estimated returns', value: formatINR(returns), tone: 'positive' },
        { label: 'Total value', value: formatINR(value), strong: true },
      ],
      breakdown: [
        { label: 'Invested', amount, display: formatINR(amount) },
        { label: 'Returns', amount: returns, display: formatINR(returns) },
      ],
      table: { title: 'Growth by year', columns: ['Year', 'Value'], rows: yearly },
    };
  },

  summary: ({ amount }) => `${formatINRWords(amount)} invested`,
  note: 'Assumes the return compounds once a year. Market-linked returns are not guaranteed.',
};
