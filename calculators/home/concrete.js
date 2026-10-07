import { formatNumber, plural } from '../../utils/format';
import { choiceField, numberField } from '../fields';

const M3_PER_CU_FT = 0.0283168;
const CU_FT_PER_M3 = 35.3147;
const DRY_VOLUME_FACTOR = 1.54;
const CEMENT_KG_PER_M3 = 1440;

// Nominal mixes by volume: cement : sand : aggregate
const GRADES = {
  M10: [1, 3, 6],
  M15: [1, 2, 4],
  M20: [1, 1.5, 3],
};

export default {
  fields: [
    numberField('length', 'Length', '10', { suffix: 'ft', min: 0.1, max: 10000 }),
    numberField('width', 'Width', '10', { suffix: 'ft', min: 0.1, max: 10000 }),
    numberField('thickness', 'Thickness', '5', { suffix: 'inches', min: 0.5, max: 120, hint: 'Roof slabs are usually 4.5–6 in' }),
    choiceField(
      'grade',
      'Concrete grade',
      Object.entries(GRADES).map(([value, [c, s, a]]) => ({ value, label: `${value} (${c}:${s}:${a})` })),
      'M20',
      { hint: 'M20 for slabs, beams and columns; M10–M15 for flooring and PCC' }
    ),
  ],

  compute({ length, width, thickness, grade }) {
    const wetCuFt = length * width * (thickness / 12);
    const wetM3 = wetCuFt * M3_PER_CU_FT;
    const dryM3 = wetM3 * DRY_VOLUME_FACTOR;
    const [c, s, a] = GRADES[grade];
    const cementM3 = (dryM3 * c) / (c + s + a);
    const bags = (cementM3 * CEMENT_KG_PER_M3) / 50;

    return {
      primary: {
        label: 'Concrete volume',
        value: `${formatNumber(wetCuFt, { maxDecimals: 1 })} cu ft`,
        caption: `${formatNumber(wetM3, { maxDecimals: 2 })} m³ of ${grade}`,
      },
      rows: [
        { label: 'Cement (50 kg bags)', value: plural(bags, 'bag', 'bags', 1), strong: true },
        { label: 'Sand', value: `${formatNumber(cementM3 * s * CU_FT_PER_M3, { maxDecimals: 1 })} cu ft` },
        { label: 'Aggregate (gitti)', value: `${formatNumber(cementM3 * a * CU_FT_PER_M3, { maxDecimals: 1 })} cu ft` },
      ],
    };
  },

  summary: ({ grade, length, width }) => `${grade} · ${formatNumber(length)} × ${formatNumber(width)} ft`,
  note: 'Nominal mix by volume. Dry volume = wet volume × 1.54; cement at 1,440 kg/m³. Order 5–10% extra for wastage.',
};
