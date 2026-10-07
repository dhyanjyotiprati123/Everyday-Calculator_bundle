import { createUnitConverter } from './unitConverter';

// Base unit: kelvin.
const UNITS = [
  { value: 'c', symbol: '°C', name: 'Celsius', pair: 'f', toBase: (v) => v + 273.15, fromBase: (k) => k - 273.15 },
  { value: 'f', symbol: '°F', name: 'Fahrenheit', pair: 'c', toBase: (v) => ((v - 32) * 5) / 9 + 273.15, fromBase: (k) => ((k - 273.15) * 9) / 5 + 32 },
  { value: 'k', symbol: 'K', name: 'Kelvin', pair: 'c', toBase: (v) => v, fromBase: (k) => k },
];

export default createUnitConverter({
  defaultUnit: 'c',
  defaultValue: '37',
  allowNegative: true,
  units: UNITS,
  validate({ value, unit }) {
    const kelvin = UNITS.find((candidate) => candidate.value === unit).toBase(value);
    return kelvin < -1e-9 ? { value: 'That is below absolute zero (−273.15 °C)' } : null;
  },
  note: 'Normal body temperature is about 37 °C (98.6 °F). Water boils at 100 °C (212 °F).',
});
