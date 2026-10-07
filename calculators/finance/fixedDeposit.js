import { compoundAmount, COMPOUNDING_OPTIONS } from '../../utils/finance';
import { formatINR, formatINRWords, formatPercent } from '../../utils/format';
import { amountField, choiceField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('amount', 'Deposit amount', '100000', { min: 1000 }),
    rateField('rate', 'Interest rate', '7', { max: 20 }),
    yearsField('years', 'Tenure', '5', { min: 0.25, max: 20 }),
    choiceField('frequency', 'Interest compounded', COMPOUNDING_OPTIONS, '4'),
  ],

  compute({ amount, rate, years, frequency }) {
    const periods = Number(frequency);
    const maturity = compoundAmount(amount, rate, years, periods);
    const interest = maturity - amount;
    const effectiveYield = ((1 + rate / 100 / periods) ** periods - 1) * 100;

    return {
      primary: { label: 'Maturity amount', value: formatINR(maturity), caption: `after ${years} ${years === 1 ? 'year' : 'years'}` },
      rows: [
        { label: 'Deposit', value: formatINR(amount) },
        { label: 'Interest earned', value: formatINR(interest), tone: 'positive' },
        { label: 'Effective annual yield', value: formatPercent(effectiveYield) },
        { label: 'Maturity amount', value: formatINR(maturity), strong: true },
      ],
      breakdown: [
        { label: 'Deposit', amount, display: formatINR(amount) },
        { label: 'Interest', amount: interest, display: formatINR(interest) },
      ],
    };
  },

  summary: ({ amount, rate }) => `${formatINRWords(amount)} FD at ${formatPercent(rate)}`,
  note: 'Most Indian banks compound FD interest quarterly. Interest is taxable, and TDS may be deducted above the yearly threshold.',
};
