import { formatSmart } from '../../utils/format';
import { choiceField, numberField } from '../fields';

const MODES = [
  { value: 'of', label: '% of a number' },
  { value: 'whatPercent', label: 'What % is it?' },
  { value: 'change', label: '% change' },
  { value: 'adjust', label: 'Add or remove %' },
];
const inMode = (mode) => (values) => values.mode === mode;
const field = (mode, key, label, defaultValue, extra) =>
  numberField(key, label, defaultValue, { max: 1e12, grouping: true, visibleWhen: inMode(mode), ...extra });

const COMPUTE = {
  of({ ofPercent, ofNumber }) {
    const part = (ofNumber * ofPercent) / 100;
    return {
      primary: { label: `${formatSmart(ofPercent)}% of ${formatSmart(ofNumber)}`, value: formatSmart(part) },
      rows: [
        { label: `${formatSmart(ofNumber)} + ${formatSmart(ofPercent)}%`, value: formatSmart(ofNumber + part) },
        { label: `${formatSmart(ofNumber)} − ${formatSmart(ofPercent)}%`, value: formatSmart(ofNumber - part) },
      ],
    };
  },
  whatPercent({ part, whole }) {
    const percent = (part / whole) * 100;
    return {
      primary: { label: `${formatSmart(part)} out of ${formatSmart(whole)}`, value: `${formatSmart(percent)}%` },
      rows:
        percent <= 100
          ? [{ label: 'Remaining', value: `${formatSmart(100 - percent)}%` }]
          : [{ label: 'More than the whole by', value: `${formatSmart(percent - 100)}%` }],
    };
  },
  change({ from, to }) {
    const change = ((to - from) / from) * 100;
    if (to === from) {
      return {
        primary: { label: 'No change', value: '0%', caption: `both values are ${formatSmart(from)}` },
        rows: [{ label: 'Difference', value: '0' }],
      };
    }
    return {
      primary: {
        label: change >= 0 ? 'Increase' : 'Decrease',
        value: `${change >= 0 ? '+' : '−'}${formatSmart(Math.abs(change))}%`,
        caption: `from ${formatSmart(from)} to ${formatSmart(to)}`,
      },
      rows: [{ label: 'Difference', value: `${to >= from ? '+' : '−'}${formatSmart(Math.abs(to - from))}` }],
    };
  },
  adjust({ base, direction, adjustPercent }) {
    const amount = (base * adjustPercent) / 100;
    const result = direction === 'decrease' ? base - amount : base + amount;
    return {
      primary: {
        label: `${formatSmart(base)} ${direction === 'decrease' ? '−' : '+'} ${formatSmart(adjustPercent)}%`,
        value: formatSmart(result),
      },
      rows: [{ label: direction === 'decrease' ? 'Amount removed' : 'Amount added', value: formatSmart(amount) }],
    };
  },
};

const SUMMARY = {
  of: ({ ofPercent, ofNumber }) => `${formatSmart(ofPercent)}% of ${formatSmart(ofNumber)}`,
  whatPercent: ({ part, whole }) => `${formatSmart(part)} of ${formatSmart(whole)}`,
  change: ({ from, to }) => `${formatSmart(from)} → ${formatSmart(to)}`,
  adjust: ({ base, direction, adjustPercent }) => `${formatSmart(base)} ${direction === 'decrease' ? '−' : '+'} ${formatSmart(adjustPercent)}%`,
};

export default {
  fields: [
    choiceField('mode', 'What do you want to find?', MODES, 'of'),
    field('of', 'ofPercent', 'Percentage', '18', { suffix: '%' }),
    field('of', 'ofNumber', 'Of the number', '2500'),
    field('whatPercent', 'part', 'Value', '450'),
    field('whatPercent', 'whole', 'Out of', '1800'),
    field('change', 'from', 'Original value', '1200'),
    field('change', 'to', 'New value', '1500'),
    field('adjust', 'base', 'Number', '1000'),
    choiceField(
      'direction',
      'Add or remove',
      [
        { value: 'increase', label: 'Add %' },
        { value: 'decrease', label: 'Remove %' },
      ],
      'increase',
      { visibleWhen: inMode('adjust') }
    ),
    field('adjust', 'adjustPercent', 'Percentage', '10', { suffix: '%' }),
  ],

  validate({ mode, whole, from }) {
    if (mode === 'whatPercent' && whole === 0) return { whole: 'Must be more than 0' };
    if (mode === 'change' && from === 0) return { from: 'Must be more than 0' };
    return null;
  },

  compute: (inputs) => COMPUTE[inputs.mode](inputs),
  summary: (inputs) => SUMMARY[inputs.mode](inputs),
};
