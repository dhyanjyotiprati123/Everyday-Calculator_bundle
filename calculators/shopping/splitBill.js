import { formatINR, formatPercent } from '../../utils/format';
import { roundUp } from '../../utils/math';
import { amountField, numberField } from '../fields';

const money = (value) => formatINR(value, { maxDecimals: 2 });

export default {
  fields: [
    amountField('amount', 'Bill amount', '2400', { decimal: true, min: 0.01, inWords: false }),
    numberField('people', 'Number of people', '4', { decimal: false, min: 1, max: 1000 }),
    numberField('tip', 'Tip or service charge', '0', {
      suffix: '%',
      max: 100,
      optional: true,
      presets: [0, 5, 10],
      presetSuffix: '%',
    }),
  ],

  compute({ amount, people, tip }) {
    const tipAmount = (amount * tip) / 100;
    const total = amount + tipAmount;
    const share = total / people;
    const roundedShare = roundUp(share);

    return {
      primary: { label: 'Each person pays', value: money(share), caption: `${people} ${people === 1 ? 'person' : 'people'} · ${money(total)} total` },
      rows: [
        { label: 'Bill amount', value: money(amount) },
        ...(tip > 0 ? [{ label: `Tip (${formatPercent(tip)})`, value: money(tipAmount) }] : []),
        { label: 'Total to pay', value: money(total) },
        ...(roundedShare - share > 0.005 ? [{ label: 'Each person (rounded up)', value: formatINR(roundedShare), strong: true }] : []),
      ],
      insight:
        roundedShare * people > total + 0.005
          ? { tone: 'info', text: `If everyone pays ${formatINR(roundedShare)}, you'll collect ${money(roundedShare * people - total)} extra.` }
          : undefined,
    };
  },

  summary: ({ amount, people }) => `${money(amount)} split ${people} ways`,
};
