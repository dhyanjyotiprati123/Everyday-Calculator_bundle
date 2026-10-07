import { formatSmart } from '../../utils/format';
import { choiceField, numberField } from '../fields';

// A unit whose conversion to the base unit is a single multiplication.
export const linearUnit = (value, symbol, name, factor, pair) => ({
  value,
  symbol,
  name,
  pair,
  toBase: (amount) => amount * factor,
  fromBase: (base) => base / factor,
});

// Builds a converter definition: enter a value, pick its unit, see it in every
// other unit. `pair` names the unit shown as the headline answer.
export function createUnitConverter({ units, defaultUnit, defaultValue = '1', allowNegative = false, validate, note }) {
  const byValue = Object.fromEntries(units.map((unit) => [unit.value, unit]));
  const show = (amount, unit) => `${formatSmart(amount)} ${unit.symbol}`;

  return {
    fields: [
      numberField('value', 'Value to convert', defaultValue, { allowNegative, grouping: true, min: allowNegative ? undefined : 0, max: 1e12 }),
      choiceField(
        'unit',
        'From',
        units.map((unit) => ({ value: unit.value, label: unit.symbol })),
        defaultUnit,
        { variant: 'chips' }
      ),
    ],

    validate,

    compute({ value, unit }) {
      const from = byValue[unit];
      const base = from.toBase(value);
      const pair = byValue[from.pair];

      return {
        primary: { label: `${show(value, from)} equals`, value: show(pair.fromBase(base), pair), caption: pair.name },
        rows: units
          .filter((candidate) => candidate.value !== unit)
          .map((candidate) => ({ label: candidate.name, value: show(candidate.fromBase(base), candidate) })),
      };
    },

    summary: ({ value, unit }) => show(value, byValue[unit]),
    note,
  };
}
