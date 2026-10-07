import { formatNumber } from '../../utils/format';
import { choiceField, numberField } from '../fields';

const SQ_M_PER_SQ_FT = 0.09290304;
const SHAPES = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' },
];
const unitSuffix = (values) => (values.unit === 'm' ? 'm' : 'ft');
const lengthField = (key, label, defaultValue, shape) =>
  numberField(key, label, defaultValue, { suffix: unitSuffix, min: 0.01, max: 1e6, visibleWhen: (values) => values.shape === shape });

function areaOf({ shape, length, width, radius, base, height }) {
  if (shape === 'circle') return Math.PI * radius * radius;
  if (shape === 'triangle') return (base * height) / 2;
  return length * width;
}

export default {
  fields: [
    choiceField('shape', 'Shape', SHAPES, 'rectangle'),
    choiceField(
      'unit',
      'Measured in',
      [
        { value: 'ft', label: 'Feet' },
        { value: 'm', label: 'Metres' },
      ],
      'ft'
    ),
    lengthField('length', 'Length', '40', 'rectangle'),
    lengthField('width', 'Width', '30', 'rectangle'),
    lengthField('radius', 'Radius', '10', 'circle'),
    lengthField('base', 'Base', '20', 'triangle'),
    lengthField('height', 'Height', '15', 'triangle'),
  ],

  compute(inputs) {
    const area = areaOf(inputs);
    const sqFt = inputs.unit === 'm' ? area / SQ_M_PER_SQ_FT : area;
    const sqM = sqFt * SQ_M_PER_SQ_FT;
    const fmt = (value) => formatNumber(value, { maxDecimals: 2 });

    return {
      primary:
        inputs.unit === 'm'
          ? { label: 'Area', value: `${fmt(sqM)} sq m`, caption: `${fmt(sqFt)} sq ft` }
          : { label: 'Area', value: `${fmt(sqFt)} sq ft`, caption: `${fmt(sqM)} sq m` },
      rows: [
        { label: 'Square feet', value: `${fmt(sqFt)} sq ft` },
        { label: 'Square metres', value: `${fmt(sqM)} sq m` },
        { label: 'Square yards (gaj)', value: `${fmt(sqFt / 9)} sq yd` },
        { label: 'Acres', value: formatNumber(sqFt / 43560, { maxDecimals: 4 }) },
      ],
    };
  },

  summary: (inputs) => `${formatNumber(areaOf(inputs), { maxDecimals: 1 })} sq ${inputs.unit === 'm' ? 'm' : 'ft'}`,
};
