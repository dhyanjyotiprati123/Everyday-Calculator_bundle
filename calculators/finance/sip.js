import { formatINR, formatINRShort } from '../../utils/format';
import { amountField, numberField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('monthly', 'Monthly investment', '10000', { min: 100, max: 1e9 }),
    rateField('rate', 'Expected return', '12', { max: 40 }),
    yearsField('years', 'Time period', '10', { decimal: false, min: 1 }),
    numberField('stepUp', 'Annual step-up', '0', {
      suffix: '%',
      max: 50,
      optional: true,
      hint: 'Increase your SIP by this percentage every year',
    }),
  ],

  compute({ monthly, rate, years, stepUp }) {
    const monthlyRate = rate / 12 / 100;
    let instalment = monthly;
    let invested = 0;
    let value = 0;
    const yearly = [];

    // Instalments go in at the start of each month (annuity due).
    for (let month = 1; month <= years * 12; month += 1) {
      value = (value + instalment) * (1 + monthlyRate);
      invested += instalment;
      if (month % 12 === 0) {
        yearly.push([String(month / 12), formatINRShort(invested), formatINRShort(value)]);
        instalment *= 1 + stepUp / 100;
      }
    }
    const returns = value - invested;

    return {
      primary: { label: 'Estimated value', value: formatINR(value), caption: `after ${years} ${years === 1 ? 'year' : 'years'}` },
      rows: [
        { label: 'Amount invested', value: formatINR(invested) },
        { label: 'Estimated returns', value: formatINR(returns), tone: returns >= 0 ? 'positive' : 'negative' },
        { label: 'Total value', value: formatINR(value), strong: true },
      ],
      breakdown: [
        { label: 'Invested', amount: invested, display: formatINR(invested) },
        { label: 'Returns', amount: Math.max(0, returns), display: formatINR(returns) },
      ],
      table: { title: 'Growth by year', columns: ['Year', 'Invested', 'Value'], rows: yearly },
    };
  },

  summary: ({ monthly }) => `${formatINR(monthly)}/month SIP`,
  note: 'Assumes a steady annual return compounded monthly, with each instalment invested at the start of the month. Actual market returns vary.',
};
