import { formatINR, formatPercent } from '../../utils/format';
import { amountField, choiceField, numberField } from '../fields';

const UNITS = [
  { value: 'g', label: 'g', per: 100 },
  { value: 'kg', label: 'kg', per: 1 },
  { value: 'ml', label: 'ml', per: 100 },
  { value: 'L', label: 'L', per: 1 },
  { value: 'pcs', label: 'pieces', per: 1 },
];
const unitInfo = (value) => UNITS.find((unit) => unit.value === value) ?? UNITS[0];
const unitSuffix = (values) => unitInfo(values.unit).label;
const money = (value) => formatINR(value, { maxDecimals: 2 });

const optionFields = (letter, price, quantity) => [
  amountField(`price${letter}`, 'Price', price, { section: `Option ${letter}`, decimal: true, min: 0.01, inWords: false }),
  numberField(`qty${letter}`, 'Quantity', quantity, { suffix: unitSuffix, min: 0.001 }),
];

export default {
  fields: [
    choiceField(
      'unit',
      'Measured in',
      UNITS.map(({ value, label }) => ({ value, label })),
      'g'
    ),
    ...optionFields('A', '120', '500'),
    ...optionFields('B', '210', '1000'),
  ],

  compute({ unit, priceA, qtyA, priceB, qtyB }) {
    const { label, per } = unitInfo(unit);
    const perLabel = per === 1 ? label.replace(/s$/, '') : `${per} ${label}`;
    const a = (priceA / qtyA) * per;
    const b = (priceB / qtyB) * per;
    const cheaper = a <= b ? 'A' : 'B';
    const low = Math.min(a, b);
    const high = Math.max(a, b);
    const difference = high > 0 ? ((high - low) / high) * 100 : 0;
    const same = difference < 0.05;

    return {
      primary: same
        ? { label: 'Better value', value: 'Same price', caption: `${money(a)} per ${perLabel} for both` }
        : { label: 'Better value', value: `Option ${cheaper}`, caption: `${formatPercent(difference, 1)} cheaper per ${perLabel}` },
      rows: [
        { label: 'Option A', value: `${money(a)} / ${perLabel}`, strong: !same && cheaper === 'A' },
        { label: 'Option B', value: `${money(b)} / ${perLabel}`, strong: !same && cheaper === 'B' },
        ...(same ? [] : [{ label: 'You save', value: `${money(high - low)} / ${perLabel}`, tone: 'positive' }]),
      ],
    };
  },

  summary: ({ priceA, priceB }) => `${money(priceA)} vs ${money(priceB)}`,
  note: 'Enter both quantities in the same unit. Prices are compared per 100 g / 100 ml, or per kg, litre or piece.',
};
