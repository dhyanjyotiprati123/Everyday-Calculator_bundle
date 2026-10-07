import { formatDuration, formatINR, formatNumber } from '../../utils/format';
import { numberField } from '../fields';

const CHARGING_EFFICIENCY = 0.9;

export default {
  fields: [
    numberField('battery', 'Battery capacity', '30', { suffix: 'kWh', min: 1, max: 300 }),
    numberField('from', 'Current charge', '20', { suffix: '%', decimal: false, max: 100, section: 'Charge level' }),
    numberField('to', 'Charge up to', '80', { suffix: '%', decimal: false, min: 1, max: 100, section: 'Charge level' }),
    numberField('rate', 'Electricity price', '8', {
      prefix: '₹',
      suffix: 'per kWh',
      max: 100,
      section: 'Charging',
      hint: 'Home tariff is usually ₹6–9; public fast chargers ₹18–25',
    }),
    numberField('power', 'Charger power', '7.2', { suffix: 'kW', min: 0.5, max: 400, section: 'Charging', presets: [3.3, 7.2, 30, 60], presetSuffix: ' kW' }),
    numberField('range', 'Range on a full charge', '300', { suffix: 'km', min: 1, max: 2000, decimal: false, section: 'Charging' }),
  ],

  validate: ({ from, to }) => (to <= from ? { to: 'Must be higher than the current charge' } : null),

  compute({ battery, from, to, rate, power, range }) {
    const energyStored = (battery * (to - from)) / 100;
    const energyDrawn = energyStored / CHARGING_EFFICIENCY;
    const cost = energyDrawn * rate;
    const rangeAdded = (range * (to - from)) / 100;

    return {
      primary: {
        label: 'Charging cost',
        value: formatINR(cost),
        caption: `${from}% → ${to}% · about ${formatDuration(energyDrawn / power)}`,
      },
      rows: [
        { label: 'Energy added to battery', value: `${formatNumber(energyStored, { maxDecimals: 1 })} kWh` },
        { label: 'Energy drawn (incl. losses)', value: `${formatNumber(energyDrawn, { maxDecimals: 1 })} kWh` },
        { label: 'Charging time (approx.)', value: formatDuration(energyDrawn / power) },
        { label: 'Range added', value: `${formatNumber(rangeAdded, { maxDecimals: 0 })} km` },
        { label: 'Cost per km', value: formatINR(cost / rangeAdded, { maxDecimals: 2 }), strong: true },
      ],
    };
  },

  summary: ({ from, to, battery }) => `${from}% → ${to}% · ${formatNumber(battery)} kWh`,
  note: 'Assumes 90% charging efficiency. Fast chargers slow down above about 80%, so real charging times can be longer.',
};
