import { createUnitConverter, linearUnit } from './unitConverter';

// Base unit: kilogram.
export default createUnitConverter({
  defaultUnit: 'kg',
  units: [
    linearUnit('mg', 'mg', 'Milligrams', 0.000001, 'g'),
    linearUnit('g', 'g', 'Grams', 0.001, 'oz'),
    linearUnit('kg', 'kg', 'Kilograms', 1, 'lb'),
    linearUnit('quintal', 'quintal', 'Quintals', 100, 'kg'),
    linearUnit('t', 't', 'Tonnes', 1000, 'kg'),
    linearUnit('oz', 'oz', 'Ounces', 0.028349523125, 'g'),
    linearUnit('lb', 'lb', 'Pounds', 0.45359237, 'kg'),
    linearUnit('tola', 'tola', 'Tola', 0.0116638038, 'g'),
  ],
  note: '1 tola = 11.6638 g (used for gold and silver). 1 quintal = 100 kg.',
});
