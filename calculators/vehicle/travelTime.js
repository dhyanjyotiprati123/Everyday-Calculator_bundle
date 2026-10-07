import { daysBetween, formatTime, weekdayName } from '../../utils/dates';
import { formatDuration, formatNumber } from '../../utils/format';
import { numberField } from '../fields';

function arrivalDay(departure, arrival) {
  const days = daysBetween(departure, arrival);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return weekdayName(arrival);
}

export default {
  fields: [
    numberField('distance', 'Distance', '350', { suffix: 'km', min: 0.1, max: 100000 }),
    numberField('speed', 'Average speed', '60', { suffix: 'km/h', min: 1, max: 1000, presets: [40, 60, 80], presetSuffix: ' km/h' }),
    numberField('breaks', 'Breaks and stops', '30', { suffix: 'minutes', decimal: false, optional: true, max: 10000 }),
  ],

  compute({ distance, speed, breaks }) {
    const driving = distance / speed;
    const total = driving + breaks / 60;
    const now = new Date();
    const arrival = new Date(now.getTime() + total * 60 * 60 * 1000);
    const day = arrivalDay(now, arrival);

    return {
      primary: {
        label: 'Travel time',
        value: formatDuration(total),
        caption: `Leave now and arrive around ${formatTime(arrival)}${day === 'Today' ? '' : day === 'Tomorrow' ? ' tomorrow' : ` on ${day}`}`,
      },
      rows: [
        { label: 'Driving time', value: formatDuration(driving) },
        ...(breaks > 0 ? [{ label: 'Breaks', value: formatDuration(breaks / 60) }] : []),
        { label: 'Total time', value: formatDuration(total), strong: true },
        { label: 'Arrival if you leave now', value: `${day}, ${formatTime(arrival)}` },
      ],
    };
  },

  summary: ({ distance, speed }) => `${formatNumber(distance)} km at ${formatNumber(speed)} km/h`,
  note: 'Highway averages in India are typically 50–70 km/h once traffic and tolls are included.',
};
