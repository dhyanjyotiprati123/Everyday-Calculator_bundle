import { formatINR, formatINRShort, formatINRWords } from '../../utils/format';
import { amountField, rateField, yearsField } from '../fields';

export default {
  fields: [
    amountField('yearly', 'Yearly investment', '150000', { min: 500, max: 150000, hint: 'Allowed: ₹500 to ₹1,50,000 a year' }),
    rateField('rate', 'Interest rate', '7.1', { max: 15, hint: 'Government rate for Oct–Dec 2026' }),
    yearsField('years', 'Time period', '15', { decimal: false, min: 15, max: 50, hint: '15 years, extendable in blocks of 5' }),
  ],

  compute({ yearly, rate, years }) {
    let balance = 0;
    const table = [];
    for (let year = 1; year <= years; year += 1) {
      balance = (balance + yearly) * (1 + rate / 100);
      table.push([String(year), formatINRShort(yearly * year), formatINRShort(balance)]);
    }
    const invested = yearly * years;
    const interest = balance - invested;

    return {
      primary: { label: 'Maturity value', value: formatINR(balance), caption: `after ${years} years · tax-free` },
      rows: [
        { label: 'Total invested', value: formatINR(invested) },
        { label: 'Interest earned', value: formatINR(interest), tone: 'positive' },
        { label: 'Maturity value', value: formatINR(balance), strong: true },
      ],
      breakdown: [
        { label: 'Invested', amount: invested, display: formatINR(invested) },
        { label: 'Interest', amount: interest, display: formatINR(interest) },
      ],
      table: { title: 'Balance by year', columns: ['Year', 'Invested', 'Balance'], rows: table },
    };
  },

  summary: ({ yearly }) => `${formatINRWords(yearly)}/year PPF`,
  note: 'Assumes you deposit before 5 April each year so the full year earns interest. PPF interest and maturity are tax-free. The rate is reviewed by the government every quarter.',
};
