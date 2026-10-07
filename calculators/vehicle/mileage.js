import { formatINR, formatNumber } from '../../utils/format';
import { numberField } from '../fields';

export default {
  fields: [
    numberField('distance', 'Distance driven', '450', { suffix: 'km', min: 0.1, max: 1e6 }),
    numberField('fuel', 'Fuel used', '30', { suffix: 'litres', min: 0.01, max: 10000 }),
    numberField('price', 'Fuel price', '', {
      prefix: '₹',
      suffix: 'per litre',
      optional: true,
      max: 1000,
      hint: 'Optional — adds running cost per km',
    }),
  ],

  compute({ distance, fuel, price }) {
    const kmPerLitre = distance / fuel;

    return {
      primary: {
        label: 'Mileage',
        value: `${formatNumber(kmPerLitre, { maxDecimals: 1 })} km/L`,
        caption: `${formatNumber((fuel / distance) * 100, { maxDecimals: 1 })} L per 100 km`,
      },
      rows: [
        { label: 'Distance', value: `${formatNumber(distance, { maxDecimals: 1 })} km` },
        { label: 'Fuel used', value: `${formatNumber(fuel, { maxDecimals: 2 })} L` },
        ...(price > 0
          ? [
              { label: 'Fuel cost', value: formatINR(fuel * price) },
              { label: 'Running cost per km', value: formatINR((fuel * price) / distance, { maxDecimals: 2 }), strong: true },
            ]
          : []),
      ],
    };
  },

  summary: ({ distance, fuel }) => `${formatNumber(distance)} km on ${formatNumber(fuel)} L`,
  note: 'For an accurate reading: fill the tank fully, reset the trip meter, drive, then fill up again. The litres added is the fuel used.',
};
