// Builders for the field shapes most calculators share.

export const amountField = (key, label, defaultValue, extra) => ({
  key,
  label,
  type: 'number',
  prefix: '₹',
  grouping: true,
  inWords: true,
  min: 1,
  max: 1e11,
  default: defaultValue,
  ...extra,
});

export const rateField = (key, label, defaultValue, extra) => ({
  key,
  label,
  type: 'number',
  suffix: '% p.a.',
  decimal: true,
  min: 0,
  max: 50,
  default: defaultValue,
  ...extra,
});

export const yearsField = (key, label, defaultValue, extra) => ({
  key,
  label,
  type: 'number',
  suffix: 'years',
  decimal: true,
  min: 0.1,
  max: 50,
  default: defaultValue,
  ...extra,
});

export const numberField = (key, label, defaultValue, extra) => ({
  key,
  label,
  type: 'number',
  decimal: true,
  min: 0,
  max: 1e12,
  default: defaultValue,
  ...extra,
});

export const choiceField = (key, label, options, defaultValue, extra) => ({
  key,
  label,
  type: 'choice',
  options,
  default: defaultValue,
  ...extra,
});
