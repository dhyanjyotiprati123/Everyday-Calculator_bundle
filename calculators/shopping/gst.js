import { formatINR, formatPercent } from '../../utils/format';
import { amountField, choiceField, numberField } from '../fields';

const money = (value) => formatINR(value, { maxDecimals: 2 });

export default {
  fields: [
    choiceField(
      'mode',
      'Calculation',
      [
        { value: 'add', label: 'Add GST' },
        { value: 'remove', label: 'Remove GST' },
      ],
      'add'
    ),
    amountField('amount', (values) => (values.mode === 'remove' ? 'Price including GST' : 'Price before GST'), '1000', {
      decimal: true,
      min: 0.01,
    }),
    numberField('rate', 'GST rate', '18', { suffix: '%', max: 100, presets: [5, 18, 40], presetSuffix: '%' }),
    choiceField(
      'supply',
      'Supply type',
      [
        { value: 'intra', label: 'Within state' },
        { value: 'inter', label: 'Between states' },
      ],
      'intra',
      { hint: 'Within a state: CGST + SGST. Between states: IGST.' }
    ),
  ],

  compute({ mode, amount, rate, supply }) {
    const net = mode === 'remove' ? amount / (1 + rate / 100) : amount;
    const gst = (net * rate) / 100;
    const gross = net + gst;

    const taxRows =
      supply === 'inter'
        ? [{ label: `IGST (${formatPercent(rate)})`, value: money(gst) }]
        : [
            { label: `CGST (${formatPercent(rate / 2)})`, value: money(gst / 2) },
            { label: `SGST (${formatPercent(rate / 2)})`, value: money(gst / 2) },
          ];

    return {
      primary:
        mode === 'remove'
          ? { label: 'Price before GST', value: money(net), caption: `includes ${money(gst)} GST at ${formatPercent(rate)}` }
          : { label: 'Price including GST', value: money(gross), caption: `adds ${money(gst)} GST at ${formatPercent(rate)}` },
      rows: [
        { label: 'Price before GST', value: money(net) },
        ...taxRows,
        { label: 'Total GST', value: money(gst) },
        { label: 'Price including GST', value: money(gross), strong: true },
      ],
      breakdown: [
        { label: 'Base price', amount: net, display: money(net) },
        { label: 'GST', amount: gst, display: money(gst) },
      ],
    };
  },

  summary: ({ rate }) => `${formatPercent(rate)} GST`,
  note: 'Since GST 2.0 (22 Sept 2025), most goods and services are taxed at 5% or 18%, with 40% for select luxury and sin goods. Some items, like gold (3%), have special rates.',
};
