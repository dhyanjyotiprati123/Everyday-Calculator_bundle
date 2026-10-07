import { formatINR, formatPercent, plural } from '../../utils/format';
import { amountField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('monthly', 'Monthly deposit', '5000', { min: 100, max: 1e8 }),
    rateField('rate', 'Interest rate', '6.8', { max: 20 }),
    yearsField('years', 'Tenure', '5', { min: 0.5, max: 10 }),
  ],

  compute({ monthly, rate, years }) {
    const months = Math.max(1, Math.round(years * 12));
    const quarterlyRate = rate / 4 / 100;

    // Each instalment compounds quarterly for the months it stays invested.
    let maturity = 0;
    for (let remaining = 1; remaining <= months; remaining += 1) {
      maturity += monthly * (1 + quarterlyRate) ** (remaining / 3);
    }
    const deposited = monthly * months;
    const interest = maturity - deposited;

    return {
      primary: { label: 'Maturity amount', value: formatINR(maturity), caption: `after ${plural(months, 'month')}` },
      rows: [
        { label: 'Total deposited', value: formatINR(deposited) },
        { label: 'Interest earned', value: formatINR(interest), tone: 'positive' },
        { label: 'Maturity amount', value: formatINR(maturity), strong: true },
      ],
      breakdown: [
        { label: 'Deposited', amount: deposited, display: formatINR(deposited) },
        { label: 'Interest', amount: interest, display: formatINR(interest) },
      ],
    };
  },

  summary: ({ monthly, rate }) => `${formatINR(monthly)}/month at ${formatPercent(rate)}`,
  note: 'Uses quarterly compounding, the method used by most Indian banks and India Post.',
};
