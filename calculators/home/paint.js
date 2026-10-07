import { formatNumber, plural } from '../../utils/format';
import { roundUp } from '../../utils/math';
import { choiceField, numberField } from '../fields';

const DOOR_SQ_FT = 21; // 3 × 7 ft
const WINDOW_SQ_FT = 12; // 3 × 4 ft

const feet = (key, label, defaultValue, extra) =>
  numberField(key, label, defaultValue, { suffix: 'ft', min: 0.5, max: 1000, section: 'Room size', ...extra });
const count = (key, label, defaultValue, extra) =>
  numberField(key, label, defaultValue, { decimal: false, min: 0, max: 50, ...extra });

export default {
  fields: [
    feet('length', 'Length', '12'),
    feet('width', 'Width', '10'),
    feet('height', 'Wall height', '10'),
    count('doors', 'Doors', '1', { section: 'Openings' }),
    count('windows', 'Windows', '2', { section: 'Openings' }),
    choiceField(
      'ceiling',
      'Paint the ceiling too?',
      [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ],
      'no',
      { section: 'Paint' }
    ),
    count('coats', 'Number of coats', '2', { min: 1, max: 5, section: 'Paint' }),
    numberField('coverage', 'Coverage per litre (one coat)', '120', {
      suffix: 'sq ft',
      min: 10,
      max: 500,
      section: 'Paint',
      hint: 'Printed on the can — usually 100–140 sq ft for emulsions',
    }),
  ],

  compute({ length, width, height, doors, windows, ceiling, coats, coverage }) {
    const walls = 2 * (length + width) * height;
    const openings = doors * DOOR_SQ_FT + windows * WINDOW_SQ_FT;
    const ceilingArea = ceiling === 'yes' ? length * width : 0;
    const area = Math.max(0, walls - openings + ceilingArea);
    const litres = (area * coats) / coverage;

    return {
      primary: {
        label: 'Paint needed',
        value: plural(litres, 'litre', 'litres', 1),
        caption: `${coats} ${coats === 1 ? 'coat' : 'coats'} over ${formatNumber(area, { maxDecimals: 0 })} sq ft`,
      },
      rows: [
        { label: 'Wall area', value: `${formatNumber(walls, { maxDecimals: 0 })} sq ft` },
        { label: 'Doors and windows', value: `${formatNumber(-openings, { maxDecimals: 0 })} sq ft` },
        ...(ceilingArea ? [{ label: 'Ceiling', value: `${formatNumber(ceilingArea, { maxDecimals: 0 })} sq ft` }] : []),
        { label: 'Area to paint', value: `${formatNumber(area, { maxDecimals: 0 })} sq ft` },
        { label: 'Buy at least', value: plural(roundUp(litres), 'litre'), strong: true },
      ],
    };
  },

  summary: ({ length, width }) => `${formatNumber(length)} × ${formatNumber(width)} ft room`,
  note: 'Doors are counted as 3 × 7 ft and windows as 3 × 4 ft. New or porous walls may need a primer coat as well.',
};
