import { formatINR, formatPercent } from '../../utils/format';
import { amountField } from '../fields';

const money = (value) => formatINR(value, { maxDecimals: 2 });

export default {
  fields: [
    amountField('cost', 'Cost price', '800', { decimal: true, min: 0.01, inWords: false }),
    amountField('selling', 'Selling price', '1000', { decimal: true, min: 0.01, inWords: false }),
  ],

  compute({ cost, selling }) {
    const profit = selling - cost;
    const isLoss = profit < 0;
    const margin = (profit / selling) * 100;
    const markup = (profit / cost) * 100;

    return {
      primary: {
        label: isLoss ? 'Loss' : 'Profit',
        value: money(Math.abs(profit)),
        caption: `${formatPercent(margin)} margin · ${formatPercent(markup)} markup`,
      },
      rows: [
        { label: 'Cost price', value: money(cost) },
        { label: 'Selling price', value: money(selling) },
        { label: isLoss ? 'Loss' : 'Profit', value: money(Math.abs(profit)), tone: isLoss ? 'negative' : 'positive', strong: true },
        { label: 'Margin (on selling price)', value: formatPercent(margin) },
        { label: 'Markup (on cost price)', value: formatPercent(markup) },
      ],
      insight: isLoss ? { tone: 'warning', text: 'The selling price is below cost, so each sale loses money.' } : undefined,
    };
  },

  summary: ({ cost, selling }) => `${money(cost)} → ${money(selling)}`,
  note: 'Margin is profit as a share of the selling price; markup is profit as a share of the cost price.',
};
