// Calculator catalogue. Everything on Home (popular row, category counts,
// search, recents) is derived from this file — add a calculator here and it
// shows up everywhere.
//
// Icons are Ionicons names; prefix with `mci:` for MaterialCommunityIcons
// (see components/ui/Icon.js). `accent` keys map to theme/colors.js accents.
// Calculators are form-based (logic in calculators/) unless `kind: 'keypad'`.

const rawCategories = [
  {
    id: 'finance',
    title: 'Finance & Money',
    description: 'Loans, investments & taxes',
    icon: 'wallet-outline',
    accent: 'blue',
  },
  {
    id: 'shopping',
    title: 'Shopping',
    description: 'Discounts, GST & splitting',
    icon: 'bag-handle-outline',
    accent: 'peach',
  },
  {
    id: 'home',
    title: 'Home & Construction',
    description: 'Area, paint, tiles & more',
    icon: 'home-outline',
    accent: 'mint',
  },
  {
    id: 'vehicle',
    title: 'Vehicle',
    description: 'Fuel, mileage & travel',
    icon: 'car-outline',
    accent: 'sky',
  },
  {
    id: 'everyday',
    title: 'Everyday',
    description: 'Age, dates & daily tools',
    icon: 'calendar-outline',
    accent: 'yellow',
  },
  {
    id: 'converters',
    title: 'Converters',
    description: 'Units & measurements',
    icon: 'swap-horizontal-outline',
    accent: 'lavender',
  },
];

const rawCalculators = [
  // Finance & Money
  { id: 'emi', title: 'EMI', subtitle: 'Loan payment', category: 'finance', icon: 'cash-outline' },
  { id: 'sip', title: 'SIP', subtitle: 'Investment', category: 'finance', icon: 'trending-up-outline' },
  { id: 'lumpsum', title: 'Lumpsum', subtitle: 'One-time investment', category: 'finance', icon: 'stats-chart-outline' },
  { id: 'fixed-deposit', title: 'Fixed Deposit', subtitle: 'FD maturity', category: 'finance', icon: 'business-outline' },
  { id: 'recurring-deposit', title: 'Recurring Deposit', subtitle: 'Monthly savings', category: 'finance', icon: 'repeat-outline' },
  { id: 'ppf', title: 'PPF', subtitle: 'Public Provident Fund', category: 'finance', icon: 'shield-checkmark-outline' },
  { id: 'simple-interest', title: 'Simple Interest', subtitle: 'Interest on principal', category: 'finance', icon: 'mci:cash-plus' },
  { id: 'compound-interest', title: 'Compound Interest', subtitle: 'Growth over time', category: 'finance', icon: 'analytics-outline' },
  { id: 'income-tax', title: 'Income Tax', subtitle: 'Tax on income', category: 'finance', icon: 'document-text-outline' },
  { id: 'inflation', title: 'Inflation', subtitle: 'Future value of money', category: 'finance', icon: 'hourglass-outline' },

  // Shopping
  { id: 'gst', title: 'GST', subtitle: 'Tax calculation', category: 'shopping', icon: 'receipt-outline' },
  { id: 'discount', title: 'Discount', subtitle: 'Sale price', category: 'shopping', icon: 'pricetag-outline' },
  { id: 'split-bill', title: 'Split Bill', subtitle: 'Share expenses', category: 'shopping', icon: 'people-outline' },
  { id: 'unit-price', title: 'Unit Price', subtitle: 'Compare value', category: 'shopping', icon: 'scale-outline' },
  { id: 'profit-margin', title: 'Profit Margin', subtitle: 'Cost & selling price', category: 'shopping', icon: 'pie-chart-outline' },

  // Home & Construction
  { id: 'area', title: 'Area', subtitle: 'Rooms & plots', category: 'home', icon: 'expand-outline' },
  { id: 'paint', title: 'Paint', subtitle: 'Litres needed', category: 'home', icon: 'color-fill-outline' },
  { id: 'tiles', title: 'Tiles', subtitle: 'Tiles & boxes', category: 'home', icon: 'grid-outline' },
  { id: 'bricks', title: 'Bricks', subtitle: 'Bricks for a wall', category: 'home', icon: 'mci:wall' },
  { id: 'concrete', title: 'Concrete', subtitle: 'Cement, sand & aggregate', category: 'home', icon: 'cube-outline' },

  // Vehicle
  { id: 'fuel-cost', title: 'Fuel Cost', subtitle: 'Trip expense', category: 'vehicle', icon: 'mci:gas-station-outline' },
  { id: 'mileage', title: 'Mileage', subtitle: 'Fuel efficiency', category: 'vehicle', icon: 'speedometer-outline' },
  { id: 'travel-time', title: 'Travel Time', subtitle: 'Distance & speed', category: 'vehicle', icon: 'time-outline' },
  { id: 'ev-charging', title: 'EV Charging', subtitle: 'Charging cost', category: 'vehicle', icon: 'flash-outline' },

  // Everyday
  { id: 'calculator', title: 'Calculator', name: 'Calculator', subtitle: 'Everyday maths', category: 'everyday', icon: 'calculator-outline', kind: 'keypad' },
  { id: 'age', title: 'Age', subtitle: 'Exact age', category: 'everyday', icon: 'person-outline' },
  { id: 'date-difference', title: 'Date Difference', subtitle: 'Days between dates', category: 'everyday', icon: 'calendar-number-outline' },
  { id: 'percentage', title: 'Percentage', subtitle: 'Quick %', category: 'everyday', icon: 'mci:percent-outline' },

  // Converters
  { id: 'length', title: 'Length', subtitle: 'm, ft, in & more', category: 'converters', icon: 'mci:ruler' },
  { id: 'weight', title: 'Weight', subtitle: 'kg, lb & more', category: 'converters', icon: 'barbell-outline' },
  { id: 'temperature', title: 'Temperature', subtitle: '°C, °F & K', category: 'converters', icon: 'thermometer-outline' },
];

const popularIds = ['calculator', 'emi', 'gst', 'discount', 'sip', 'fuel-cost', 'percentage'];

// Derived data — computed once at module load.

const categoryById = Object.fromEntries(rawCategories.map((category) => [category.id, category]));

export const calculators = rawCalculators.map((calculator) => ({
  ...calculator,
  name: calculator.name ?? `${calculator.title} ${calculator.category === 'converters' ? 'Converter' : 'Calculator'}`,
  accent: categoryById[calculator.category].accent,
}));

const calculatorById = Object.fromEntries(calculators.map((calculator) => [calculator.id, calculator]));

export const categories = rawCategories.map((category) => ({
  ...category,
  count: calculators.filter((calculator) => calculator.category === category.id).length,
}));

export const popularCalculators = popularIds.map((id) => calculatorById[id]);

export const getCalculator = (id) => calculatorById[id];

export const getCategory = (id) => categories.find((category) => category.id === id);

export const getCalculatorsByCategory = (categoryId) =>
  calculators.filter((calculator) => calculator.category === categoryId);

export function searchCalculators(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return calculators;

  const matches = calculators.filter((calculator) => {
    const haystack = [
      calculator.name,
      calculator.subtitle,
      categoryById[calculator.category].title,
    ]
      .join(' ')
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
  // Titles that start with the query come first ("calc" → Calculator).
  const leads = (calculator) => calculator.title.toLowerCase().startsWith(terms[0]);
  return [...matches.filter(leads), ...matches.filter((calculator) => !leads(calculator))];
}
