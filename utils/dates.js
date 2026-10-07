// Calendar-date helpers. Dates are stored as local 'YYYY-MM-DD' strings so they
// serialise cleanly and never shift with time zones.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_MS = 24 * 60 * 60 * 1000;

const pad = (n) => String(n).padStart(2, '0');

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISODate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const isoDaysFromToday = (days) => toISODate(addDays(new Date(), days));

// "12 Mar 1995"
export function formatDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export const weekdayName = (date) => WEEKDAYS[date.getDay()];

// "6:05 PM"
export function formatTime(date) {
  const hours = date.getHours() % 12 || 12;
  return `${hours}:${pad(date.getMinutes())} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
}

// Whole days between two calendar dates (DST-safe).
export function daysBetween(start, end) {
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((b - a) / DAY_MS);
}

const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

// Adds whole months, clamping to the last day of shorter months (31 Jan + 1 → 28 Feb).
function addMonthsClamped(date, months) {
  const monthIndex = date.getMonth() + months;
  const year = date.getFullYear() + Math.floor(monthIndex / 12);
  const month = ((monthIndex % 12) + 12) % 12;
  return new Date(year, month, Math.min(date.getDate(), daysInMonth(year, month)));
}

// Calendar difference as years, months and days (start <= end): the most whole
// months that fit, then the remaining days.
export function diffYMD(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let anchor = addMonthsClamped(start, months);
  if (anchor > end) {
    months -= 1;
    anchor = addMonthsClamped(start, months);
  }
  return { years: Math.floor(months / 12), months: months % 12, days: daysBetween(anchor, end) };
}

// "1 year, 2 months, 3 days" — zero parts are left out.
export function formatYMD({ years, months, days }) {
  const parts = [
    [years, 'year'],
    [months, 'month'],
    [days, 'day'],
  ]
    .filter(([value]) => value > 0)
    .map(([value, unit]) => `${value} ${unit}${value === 1 ? '' : 's'}`);
  return parts.length ? parts.join(', ') : '0 days';
}

// Birthday in a given year; 29 Feb falls back to 28 Feb in non-leap years.
export function birthdayInYear(birth, year) {
  const day = Math.min(birth.getDate(), daysInMonth(year, birth.getMonth()));
  return new Date(year, birth.getMonth(), day);
}

// Monday–Friday days in [start, end) — `end` excluded.
export function countWeekdays(start, end) {
  const total = daysBetween(start, end);
  const fullWeeks = Math.floor(total / 7);
  let weekdays = fullWeeks * 5;
  const startDay = start.getDay();
  for (let i = 0; i < total % 7; i += 1) {
    const day = (startDay + i) % 7;
    if (day !== 0 && day !== 6) weekdays += 1;
  }
  return weekdays;
}
