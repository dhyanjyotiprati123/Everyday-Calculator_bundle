import {
  addDays,
  countWeekdays,
  daysBetween,
  diffYMD,
  formatDate,
  formatYMD,
  isoDaysFromToday,
  todayISO,
} from '../../utils/dates';
import { formatNumber, plural } from '../../utils/format';
import { choiceField } from '../fields';

export default {
  fields: [
    { key: 'start', label: 'Start date', type: 'date', default: todayISO },
    { key: 'end', label: 'End date', type: 'date', default: () => isoDaysFromToday(30) },
    choiceField(
      'includeEnd',
      'Count the end date as well?',
      [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ],
      'no',
      { hint: 'Choose Yes for leave or booking periods that include the last day' }
    ),
  ],

  compute({ start, end, includeEnd }) {
    const swapped = daysBetween(start, end) < 0;
    const [from, to] = swapped ? [end, start] : [start, end];
    const until = includeEnd === 'yes' ? addDays(to, 1) : to;

    const totalDays = daysBetween(from, until);
    const workingDays = countWeekdays(from, until);
    const calendar = diffYMD(from, until);
    // Under a month the y/m/d breakdown would just repeat the headline, so show the dates instead.
    const caption =
      calendar.years || calendar.months ? formatYMD(calendar) : `${formatDate(from)} → ${formatDate(to)}`;

    return {
      primary: { label: 'Difference', value: plural(totalDays, 'day'), caption },
      rows: [
        { label: 'In weeks', value: `${plural(Math.floor(totalDays / 7), 'week')}, ${plural(totalDays % 7, 'day')}` },
        { label: 'Working days (Mon–Fri)', value: formatNumber(workingDays), strong: true },
        { label: 'Weekend days', value: formatNumber(totalDays - workingDays) },
        { label: 'In hours', value: formatNumber(totalDays * 24) },
      ],
      insight: swapped ? { tone: 'info', text: 'The end date is before the start date, so the difference is counted backwards.' } : undefined,
    };
  },

  summary: ({ start, end }) => `${formatDate(start)} → ${formatDate(end)}`,
  note: 'Working days skip Saturdays and Sundays only — public holidays are not removed.',
};
