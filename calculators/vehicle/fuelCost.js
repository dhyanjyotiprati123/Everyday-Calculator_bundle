import { formatINR, formatNumber, plural } from '../../utils/format';
import { choiceField, numberField } from '../fields';

export default {
  fields: [
    numberField('distance', 'Distance', '300', { suffix: 'km', min: 0.1, max: 1e6 }),
    choiceField(
      'trip',
      'Trip',
      [
        { value: 'one', label: 'One way' },
        { value: 'round', label: 'Round trip' },
      ],
      'one'
    ),
    numberField('mileage', 'Vehicle mileage', '15', { suffix: 'km/L', min: 0.1, max: 200 }),
    numberField('price', 'Fuel price', '103', { prefix: '₹', suffix: 'per litre', min: 1, max: 1000 }),
    numberField('people', 'Split between', '1', { decimal: false, min: 1, max: 100, suffix: (values) => (values.people === '1' ? 'person' : 'people') }),
  ],

  compute({ distance, trip, mileage, price, people }) {
    const km = trip === 'round' ? distance * 2 : distance;
    const litres = km / mileage;
    const cost = litres * price;

    return {
      primary: {
        label: 'Fuel cost',
        value: formatINR(cost),
        caption: `${plural(litres, 'litre', 'litres', 1)} for ${formatNumber(km, { maxDecimals: 1 })} km`,
      },
      rows: [
        { label: 'Total distance', value: `${formatNumber(km, { maxDecimals: 1 })} km` },
        { label: 'Fuel needed', value: `${formatNumber(litres, { maxDecimals: 2 })} L` },
        { label: 'Cost per km', value: formatINR(cost / km, { maxDecimals: 2 }) },
        ...(people > 1 ? [{ label: 'Cost per person', value: formatINR(cost / people), strong: true }] : []),
      ],
    };
  },

  summary: ({ distance, trip }) => `${formatNumber(trip === 'round' ? distance * 2 : distance)} km trip`,
  note: 'Real-world mileage drops in city traffic and with the AC on — use a slightly lower figure for a safer budget.',
};
