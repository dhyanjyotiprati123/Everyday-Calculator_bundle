// Number formatting with Indian digit grouping (10,00,000). Implemented by hand
// rather than with Intl so output is identical on every device and engine.

const LAKH = 1e5;
const CRORE = 1e7;

export function groupIndian(digits) {
  if (digits.length <= 3) return digits;
  const head = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${head},${digits.slice(-3)}`;
}

// toFixed() switches to exponent notation at 1e21; BigInt keeps plain digits.
function toPlainFixed(abs, maxDecimals) {
  return abs < 1e21 ? abs.toFixed(maxDecimals) : BigInt(Math.round(abs)).toString();
}

// formatNumber(1234567.891) → "12,34,567.89"
export function formatNumber(value, { maxDecimals = 2, minDecimals = 0 } = {}) {
  if (!Number.isFinite(value)) return '—';
  const fixed = toPlainFixed(Math.abs(value), maxDecimals);
  const [integer, fraction = ''] = fixed.split('.');
  let decimals = fraction.replace(/0+$/, '');
  while (decimals.length < minDecimals) decimals += '0';
  const sign = value < 0 && Number(fixed) !== 0 ? '-' : '';
  return `${sign}${groupIndian(integer)}${decimals ? `.${decimals}` : ''}`;
}

// formatINR(8678.4) → "₹8,678"; formatINR(847.457, { maxDecimals: 2 }) → "₹847.46"
export function formatINR(value, { maxDecimals = 0, minDecimals = 0 } = {}) {
  if (!Number.isFinite(value)) return '—';
  const formatted = formatNumber(Math.abs(value), { maxDecimals, minDecimals });
  return `${value < 0 && formatted !== '0' ? '-' : ''}₹${formatted}`;
}

function trimDecimals(value, decimals) {
  return formatNumber(value, { maxDecimals: decimals });
}

// "₹25,000", "₹10 lakh", "₹1.25 crore" — for summaries and hints.
export function formatINRWords(value) {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= CRORE) return `${sign}₹${trimDecimals(abs / CRORE, 2)} crore`;
  if (abs >= LAKH) return `${sign}₹${trimDecimals(abs / LAKH, 2)} lakh`;
  return formatINR(value);
}

// "₹9.62 L", "₹1.2 Cr" — for dense tables.
export function formatINRShort(value) {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= CRORE) return `${sign}₹${trimDecimals(abs / CRORE, 2)} Cr`;
  if (abs >= LAKH) return `${sign}₹${trimDecimals(abs / LAKH, 2)} L`;
  return formatINR(value);
}

// Amount hint shown under currency inputs: "10 lakh", "2.5 crore", "45 thousand".
export function amountInWords(value) {
  const abs = Math.abs(value);
  if (abs >= CRORE) return `${trimDecimals(abs / CRORE, 2)} crore`;
  if (abs >= LAKH) return `${trimDecimals(abs / LAKH, 2)} lakh`;
  if (abs >= 1000) return `${trimDecimals(abs / 1000, 2)} thousand`;
  return null;
}

export function formatPercent(value, maxDecimals = 2) {
  return `${formatNumber(value, { maxDecimals })}%`;
}

// Sensible precision for any magnitude: 1,234.5 · 3.2808 · 0.0006214
export function formatSmart(value) {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs === 0) return '0';
  if (abs >= 1000) return formatNumber(value, { maxDecimals: 2 });
  if (abs >= 1) return formatNumber(value, { maxDecimals: 4 });
  const decimals = Math.min(10, Math.ceil(-Math.log10(abs)) + 3);
  return formatNumber(value, { maxDecimals: decimals });
}

// formatDuration(3.42) → "3 hr 25 min"
export function formatDuration(hours) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${formatNumber(h)} hr`;
  return `${formatNumber(h)} hr ${m} min`;
}

// plural(1, 'tile') → "1 tile"; plural(2.5, 'litre', 'litres', 1) → "2.5 litres".
// The singular is chosen from the displayed number, so 0.99 shown as "1" reads "1 litre".
export function plural(count, singular, pluralForm = `${singular}s`, maxDecimals = 2) {
  const text = formatNumber(count, { maxDecimals });
  return `${text} ${text === '1' ? singular : pluralForm}`;
}
