import { compoundAmount } from '../../utils/finance';
import { formatINR, formatINRWords, formatPercent } from '../../utils/format';
import { amountField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('amount', "Today's cost", '100000'),
    rateField('rate', 'Inflation rate', '6', { suffix: '% a year', max: 30 }),
    yearsField('years', 'Years from now', '10', { min: 1 }),
  ],

  compute({ amount, rate, years }) {
    const futureCost = compoundAmount(amount, rate, years);
    const purchasingPower = amount / (1 + rate / 100) ** years;

    return {
      primary: {
        label: `Cost in ${years} ${years === 1 ? 'year' : 'years'}`,
        value: formatINR(futureCost),
        caption: `for what costs ${formatINR(amount)} today`,
      },
      rows: [
        { label: "Today's cost", value: formatINR(amount) },
        { label: 'Increase in cost', value: formatINR(futureCost - amount), tone: 'negative' },
        { label: `Value of ${formatINR(amount)} then, in today's money`, value: formatINR(purchasingPower) },
      ],
      insight: {
        tone: 'info',
        text: `At ${formatPercent(rate)} inflation, money loses about half its value every ${Math.round(Math.log(2) / Math.log(1 + rate / 100))} years.`,
      },
    };
  },

  validate: ({ rate }) => (rate <= 0 ? { rate: 'Enter an inflation rate above 0' } : null),
  summary: ({ amount, rate }) => `${formatINRWords(amount)} at ${formatPercent(rate)}`,
  note: "India's retail (CPI) inflation has averaged roughly 5–6% a year over the last decade.",
};
