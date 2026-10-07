import { formatINR, formatPercent } from '../../utils/format';
import { amountField, numberField } from '../fields';

const money = (value) => formatINR(value, { maxDecimals: 2 });

export default {
  fields: [
    amountField('price', 'Original price', '2000', { decimal: true, min: 0.01, inWords: false }),
    numberField('discount', 'Discount', '20', { suffix: '%', max: 100, presets: [10, 20, 30, 50], presetSuffix: '%' }),
    numberField('extra', 'Extra discount', '0', {
      suffix: '%',
      max: 100,
      optional: true,
      hint: 'Applied after the first discount, e.g. a bank or coupon offer',
    }),
  ],

  compute({ price, discount, extra }) {
    const afterFirst = price * (1 - discount / 100);
    const finalPrice = afterFirst * (1 - extra / 100);
    const saved = price - finalPrice;

    return {
      primary: { label: 'You pay', value: money(finalPrice), caption: `You save ${money(saved)}` },
      rows: [
        { label: 'Original price', value: money(price) },
        { label: `Discount (${formatPercent(discount)})`, value: money(afterFirst - price), tone: 'positive' },
        ...(extra > 0
          ? [{ label: `Extra discount (${formatPercent(extra)})`, value: money(finalPrice - afterFirst), tone: 'positive' }]
          : []),
        { label: 'Total saving', value: money(saved), tone: 'positive' },
        { label: 'Effective discount', value: formatPercent((saved / price) * 100) },
        { label: 'Final price', value: money(finalPrice), strong: true },
      ],
      breakdown: [
        { label: 'You pay', amount: finalPrice, display: money(finalPrice) },
        { label: 'You save', amount: saved, display: money(saved) },
      ],
      insight:
        extra > 0
          ? {
              tone: 'info',
              text: `${formatPercent(discount)} + ${formatPercent(extra)} is ${formatPercent((saved / price) * 100)} off in total, not ${formatPercent(discount + extra)}.`,
            }
          : undefined,
    };
  },

  summary: ({ price, discount }) => `${formatPercent(discount)} off ${money(price)}`,
};
