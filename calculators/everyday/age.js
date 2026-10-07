import {
  birthdayInYear,
  daysBetween,
  diffYMD,
  formatDate,
  formatYMD,
  todayISO,
  weekdayName,
} from '../../utils/dates';
import { formatNumber, plural } from '../../utils/format';

export default {
  fields: [
    { key: 'dob', label: 'Date of birth', type: 'date', default: '2000-01-01', maxDate: 'today' },
    { key: 'asOf', label: 'Age on', type: 'date', default: todayISO, persist: false, hint: 'Today by default — change it to find your age on any date' },
  ],

  validate: ({ dob, asOf }) => (daysBetween(dob, asOf) < 0 ? { dob: 'Must be on or before the "Age on" date' } : null),

  compute({ dob, asOf }) {
    const age = diffYMD(dob, asOf);
    const totalDays = daysBetween(dob, asOf);

    let nextBirthday = birthdayInYear(dob, asOf.getFullYear());
    // Born on the "Age on" date: the first birthday is a year later.
    if (daysBetween(asOf, nextBirthday) < 0 || totalDays === 0) nextBirthday = birthdayInYear(dob, asOf.getFullYear() + 1);
    const daysToBirthday = daysBetween(asOf, nextBirthday);
    const isBirthday = daysToBirthday === 0 && totalDays > 0;
    const remainder = formatYMD({ years: 0, months: age.months, days: age.days });

    return {
      primary: {
        label: 'Age',
        value: plural(age.years, 'year'),
        caption: remainder === '0 days' ? 'exactly' : `and ${remainder}`,
      },
      rows: [
        { label: 'Total months', value: formatNumber(age.years * 12 + age.months) },
        { label: 'Total weeks', value: `${plural(Math.floor(totalDays / 7), 'week')}, ${plural(totalDays % 7, 'day')}` },
        { label: 'Total days', value: formatNumber(totalDays) },
        { label: 'Born on a', value: weekdayName(dob) },
        { label: 'Next birthday', value: `${formatDate(nextBirthday)} (${weekdayName(nextBirthday)})` },
        { label: 'Days to next birthday', value: isBirthday ? 'Today!' : plural(daysToBirthday, 'day'), strong: true },
      ],
      insight: isBirthday ? { tone: 'positive', text: `Happy birthday! You turn ${age.years} today.` } : undefined,
    };
  },

  summary: ({ dob }) => `Born ${formatDate(dob)}`,
};
