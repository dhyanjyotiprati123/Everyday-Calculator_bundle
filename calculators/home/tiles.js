import { formatNumber, plural } from '../../utils/format';
import { roundUp } from '../../utils/math';
import { choiceField, numberField } from '../fields';

const TILE_SIZES = [
  { value: '1x1', label: '1 × 1 ft', area: 1 },
  { value: '1x2', label: '1 × 2 ft', area: 2 },
  { value: '2x2', label: '2 × 2 ft', area: 4 },
  { value: '2x4', label: '2 × 4 ft', area: 8 },
];

export default {
  fields: [
    numberField('length', 'Floor length', '12', { suffix: 'ft', min: 0.5, max: 1000 }),
    numberField('width', 'Floor width', '10', { suffix: 'ft', min: 0.5, max: 1000 }),
    choiceField(
      'tile',
      'Tile size',
      TILE_SIZES.map(({ value, label }) => ({ value, label })),
      '2x2',
      { hint: '2 × 2 ft is the common 600 × 600 mm tile' }
    ),
    numberField('wastage', 'Extra for cutting and breakage', '10', {
      suffix: '%',
      max: 50,
      optional: true,
      presets: [5, 10, 15],
      presetSuffix: '%',
    }),
    numberField('perBox', 'Tiles per box', '4', { decimal: false, min: 1, max: 100, hint: 'Printed on the box' }),
  ],

  compute({ length, width, tile, wastage, perBox }) {
    const size = TILE_SIZES.find((option) => option.value === tile);
    const area = length * width;
    const exact = roundUp(area / size.area);
    const tiles = roundUp((area / size.area) * (1 + wastage / 100));
    const boxes = roundUp(tiles / perBox);

    return {
      primary: { label: 'Tiles needed', value: plural(tiles, 'tile'), caption: `${boxes} ${boxes === 1 ? 'box' : 'boxes'} of ${perBox}` },
      rows: [
        { label: 'Floor area', value: `${formatNumber(area, { maxDecimals: 1 })} sq ft` },
        { label: 'Tile size', value: size.label },
        { label: 'Tiles without extra', value: formatNumber(exact) },
        { label: `Extra (${formatNumber(wastage)}%)`, value: formatNumber(tiles - exact) },
        { label: 'Boxes to buy', value: formatNumber(boxes), strong: true },
      ],
    };
  },

  summary: ({ length, width }) => `${formatNumber(length)} × ${formatNumber(width)} ft floor`,
  note: 'Add 10% for straight layouts and about 15% for diagonal patterns or rooms with many corners.',
};
