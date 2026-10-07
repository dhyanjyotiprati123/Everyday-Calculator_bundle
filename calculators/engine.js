// Calculator engine: turns a definition plus raw input strings into validated
// inputs and a result. Pure functions only — no React — so it is unit-testable.
//
// A definition is { fields, compute(inputs), validate?(inputs), summary?(inputs), note? }.
// Field types:
//   number  { prefix, suffix, decimal, allowNegative, grouping, inWords, min, max,
//             optional, presets, hint }
//   choice  { options: [{ value, label }], variant?: 'segmented' | 'chips' }
//   date    { minDate?, maxDate? ('today' or 'YYYY-MM-DD') }
// Any field may set `section`, `hint`, `visibleWhen(values)`, `persist: false`,
// and `label` / `suffix` as functions of the current values.
// compute() returns { primary, rows, breakdown, insight, table } (all optional
// except primary).

import { parseISODate } from '../utils/dates';
import { formatNumber, groupIndian } from '../utils/format';

const MAX_DECIMALS = 4;
const MAX_INTEGER_DIGITS = 13;

const resolveDefault = (field) => (typeof field.default === 'function' ? field.default() : (field.default ?? ''));

export const resolve = (property, values) => (typeof property === 'function' ? property(values) : property);

export const isFieldVisible = (field, values) => !field.visibleWhen || field.visibleWhen(values);

export function defaultValues(definition) {
  return Object.fromEntries(definition.fields.map((field) => [field.key, resolveDefault(field)]));
}

// Saved values (from Recently used) layered over defaults, ignoring anything stale.
export function restoreValues(definition, saved) {
  const values = defaultValues(definition);
  if (!saved || typeof saved !== 'object') return values;

  for (const field of definition.fields) {
    const value = saved[field.key];
    if (field.persist === false || typeof value !== 'string') continue;
    if (field.type === 'choice' && !field.options.some((option) => option.value === value)) continue;
    if (field.type === 'date' && !parseISODate(value)) continue;
    values[field.key] = value;
  }
  return values;
}

// Keeps only characters valid for the field; strips grouping commas.
export function sanitizeNumberInput(text, { decimal = false, allowNegative = false } = {}) {
  const negative = allowNegative && text.trim().startsWith('-');
  let cleaned = text.replace(decimal ? /[^0-9.]/g : /[^0-9]/g, '');

  const dot = cleaned.indexOf('.');
  if (dot !== -1) {
    cleaned = `${cleaned.slice(0, dot + 1)}${cleaned.slice(dot + 1).replace(/\./g, '').slice(0, MAX_DECIMALS)}`;
  }
  cleaned = cleaned.replace(/^0+(?=\d)/, '');

  const [integer, ...fraction] = cleaned.split('.');
  if (integer.length > MAX_INTEGER_DIGITS) {
    cleaned = [integer.slice(0, MAX_INTEGER_DIGITS), ...fraction].join('.');
  }
  return negative ? `-${cleaned}` : cleaned;
}

// Display form of a raw input: "1000000" → "10,00,000" (keeps a trailing ".").
export function formatNumberInput(raw, grouping) {
  if (!grouping || !raw) return raw ?? '';
  const negative = raw.startsWith('-');
  const [integer, fraction] = (negative ? raw.slice(1) : raw).split('.');
  return `${negative ? '-' : ''}${integer ? groupIndian(integer) : ''}${fraction !== undefined ? `.${fraction}` : ''}`;
}

const isBlank = (raw) => raw == null || raw === '' || raw === '-' || raw === '.' || raw === '-.';

const describeLimit = (field, limit) => `${field.prefix ?? ''}${formatNumber(limit, { maxDecimals: 4 })}`;

export function evaluate(definition, values) {
  const inputs = {};
  const errors = {};
  let missing = false;

  for (const field of definition.fields) {
    if (!isFieldVisible(field, values)) continue;
    const raw = values[field.key];

    if (field.type === 'number') {
      if (isBlank(raw)) {
        if (field.optional) inputs[field.key] = 0;
        else missing = true;
        continue;
      }
      const number = Number(raw);
      if (!Number.isFinite(number)) errors[field.key] = 'Enter a valid number';
      else if (field.min != null && number < field.min) errors[field.key] = `Must be at least ${describeLimit(field, field.min)}`;
      else if (field.max != null && number > field.max) errors[field.key] = `Must be at most ${describeLimit(field, field.max)}`;
      inputs[field.key] = number;
    } else if (field.type === 'date') {
      const date = parseISODate(raw);
      if (date) inputs[field.key] = date;
      else missing = true;
    } else {
      inputs[field.key] = raw;
    }
  }

  if (!missing && Object.keys(errors).length === 0 && definition.validate) {
    Object.assign(errors, definition.validate(inputs) ?? {});
  }

  const valid = !missing && Object.keys(errors).length === 0;
  return {
    inputs,
    errors,
    result: valid ? definition.compute(inputs) : null,
    summary: valid && definition.summary ? definition.summary(inputs) : undefined,
  };
}

export function buildShareText(title, result) {
  const lines = [title, `${result.primary.label}: ${result.primary.value}`];
  if (result.primary.caption) lines.push(result.primary.caption);
  for (const row of result.rows ?? []) lines.push(`${row.label}: ${row.value}`);
  lines.push('', 'Calculated with Calcular Bundle');
  return lines.join('\n');
}
