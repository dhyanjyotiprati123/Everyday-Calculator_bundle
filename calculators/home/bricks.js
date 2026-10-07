import { formatNumber, plural } from '../../utils/format';
import { roundUp } from '../../utils/math';
import { choiceField, numberField } from '../fields';

const M_PER_FT = 0.3048;
const CU_FT_PER_M3 = 35.3147;
const BRICK_WITH_MORTAR_M3 = 0.2 * 0.1 * 0.1; // modular brick + 10 mm joints
const BRICK_M3 = 0.19 * 0.09 * 0.09; // 190 × 90 × 90 mm
const DRY_MORTAR_FACTOR = 1.33;
const CEMENT_KG_PER_M3 = 1440;
const WALL_THICKNESS_M = { 4.5: 0.115, 9: 0.23 };

export default {
  fields: [
    numberField('length', 'Wall length', '10', { suffix: 'ft', min: 0.5, max: 10000 }),
    numberField('height', 'Wall height', '10', { suffix: 'ft', min: 0.5, max: 200 }),
    choiceField(
      'thickness',
      'Wall thickness',
      [
        { value: '4.5', label: '4.5 in (half brick)' },
        { value: '9', label: '9 in (full brick)' },
      ],
      '9'
    ),
    choiceField(
      'ratio',
      'Mortar mix (cement : sand)',
      [
        { value: '4', label: '1 : 4' },
        { value: '6', label: '1 : 6' },
      ],
      '6',
      { hint: '1 : 4 for half-brick walls, 1 : 6 for most full-brick walls' }
    ),
    numberField('wastage', 'Extra bricks for breakage', '5', { suffix: '%', max: 30, optional: true }),
  ],

  compute({ length, height, thickness, ratio, wastage }) {
    const volume = length * M_PER_FT * height * M_PER_FT * WALL_THICKNESS_M[thickness];
    const bricksExact = volume / BRICK_WITH_MORTAR_M3;
    const bricks = roundUp(bricksExact * (1 + wastage / 100));

    const dryMortar = (volume - bricksExact * BRICK_M3) * DRY_MORTAR_FACTOR;
    const sandParts = Number(ratio);
    const cement = dryMortar / (1 + sandParts);
    const cementBags = (cement * CEMENT_KG_PER_M3) / 50;
    const sand = cement * sandParts;

    return {
      primary: { label: 'Bricks needed', value: plural(bricks, 'brick'), caption: `incl. ${formatNumber(wastage)}% extra` },
      rows: [
        { label: 'Wall volume', value: `${formatNumber(volume, { maxDecimals: 2 })} m³ · ${formatNumber(volume * CU_FT_PER_M3, { maxDecimals: 1 })} cu ft` },
        { label: 'Cement (50 kg bags)', value: plural(cementBags, 'bag', 'bags', 1), strong: true },
        { label: 'Sand', value: `${formatNumber(sand * CU_FT_PER_M3, { maxDecimals: 1 })} cu ft` },
        { label: 'Mortar mix', value: `1 : ${ratio}` },
      ],
    };
  },

  summary: ({ length, height }) => `${formatNumber(length)} × ${formatNumber(height)} ft wall`,
  note: 'Based on standard modular bricks (190 × 90 × 90 mm) with 10 mm joints — about 500 bricks per m³. Deduct doors and windows from the wall size first.',
};
