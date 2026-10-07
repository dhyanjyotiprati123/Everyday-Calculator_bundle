// Income tax for tax year 2026-27 (FY 2026-27), resident individuals.
// Slabs, rebate, standard deduction, surcharge and cess are as set in Budget
// 2025 and left unchanged by Budget 2026. Update the tables below when rates change.

import { formatINR, formatINRWords, formatPercent } from '../../utils/format';
import { amountField, choiceField } from '../fields';

// [upper limit of slab, rate]
const NEW_REGIME_SLABS = [
  [400000, 0],
  [800000, 0.05],
  [1200000, 0.1],
  [1600000, 0.15],
  [2000000, 0.2],
  [2400000, 0.25],
  [Infinity, 0.3],
];

const OLD_REGIME_SLABS = {
  below60: [[250000, 0], [500000, 0.05], [1000000, 0.2], [Infinity, 0.3]],
  senior: [[300000, 0], [500000, 0.05], [1000000, 0.2], [Infinity, 0.3]],
  superSenior: [[500000, 0], [1000000, 0.2], [Infinity, 0.3]],
};

// [income above which the surcharge applies, rate]; the new regime caps at 25%.
const NEW_REGIME_SURCHARGE = [[5e6, 0.1], [1e7, 0.15], [2e7, 0.25]];
const OLD_REGIME_SURCHARGE = [[5e6, 0.1], [1e7, 0.15], [2e7, 0.25], [5e7, 0.37]];

const STANDARD_DEDUCTION = { new: 75000, old: 50000 };
const NEW_REGIME_REBATE_LIMIT = 1200000; // full 87A rebate up to this taxable income
const OLD_REGIME_REBATE_LIMIT = 500000;
const OLD_REGIME_MAX_REBATE = 12500;
const CESS_RATE = 0.04;

function slabTax(income, slabs) {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of slabs) {
    if (income > lower) tax += (Math.min(income, upper) - lower) * rate;
    lower = upper;
  }
  return tax;
}

// Tax after the section 87A rebate, including marginal relief just above ₹12 lakh.
function newRegimeTax(income) {
  if (income <= NEW_REGIME_REBATE_LIMIT) return 0;
  return Math.min(slabTax(income, NEW_REGIME_SLABS), income - NEW_REGIME_REBATE_LIMIT);
}

function oldRegimeTax(income, slabs) {
  const tax = slabTax(income, slabs);
  return income <= OLD_REGIME_REBATE_LIMIT ? Math.max(0, tax - OLD_REGIME_MAX_REBATE) : tax;
}

// Surcharge with marginal relief: crossing a threshold can't cost more in
// extra tax than the income earned above it.
function surchargeFor(income, taxFor, bands) {
  let band = -1;
  bands.forEach(([threshold], index) => {
    if (income > threshold) band = index;
  });
  if (band < 0) return 0;

  const [threshold, rate] = bands[band];
  const previousRate = band > 0 ? bands[band - 1][1] : 0;
  const tax = taxFor(income);
  const cap = taxFor(threshold) * (1 + previousRate) + (income - threshold);
  return Math.max(0, Math.min(tax * rate, cap - tax));
}

function regimeBreakdown(taxable, slabs, taxFor, surchargeBands) {
  const slab = slabTax(taxable, slabs);
  const tax = taxFor(taxable);
  const surcharge = surchargeFor(taxable, taxFor, surchargeBands);
  const cess = (tax + surcharge) * CESS_RATE;
  return { taxable, slab, rebate: slab - tax, surcharge, cess, total: tax + surcharge + cess };
}

export function calculateIncomeTax({ income, salaried, age, deductions }) {
  const oldSlabs = OLD_REGIME_SLABS[age];
  const newTaxable = Math.max(0, income - (salaried ? STANDARD_DEDUCTION.new : 0));
  const oldTaxable = Math.max(0, income - (salaried ? STANDARD_DEDUCTION.old : 0) - deductions);

  return {
    newRegime: regimeBreakdown(newTaxable, NEW_REGIME_SLABS, newRegimeTax, NEW_REGIME_SURCHARGE),
    oldRegime: regimeBreakdown(oldTaxable, oldSlabs, (value) => oldRegimeTax(value, oldSlabs), OLD_REGIME_SURCHARGE),
  };
}

export default {
  fields: [
    amountField('income', 'Annual income', '1500000', { min: 0, hint: 'Gross yearly income before any deductions' }),
    choiceField(
      'incomeType',
      'Income type',
      [
        { value: 'salaried', label: 'Salary / pension' },
        { value: 'other', label: 'Business / other' },
      ],
      'salaried',
      { hint: 'Salary and pension get a standard deduction' }
    ),
    choiceField(
      'age',
      'Age',
      [
        { value: 'below60', label: 'Below 60' },
        { value: 'senior', label: '60 – 79' },
        { value: 'superSenior', label: '80+' },
      ],
      'below60'
    ),
    amountField('deductions', 'Deductions (old regime only)', '150000', {
      min: 0,
      optional: true,
      hint: '80C, 80D, HRA, home-loan interest and similar',
    }),
  ],

  compute({ income, incomeType, age, deductions }) {
    const { newRegime, oldRegime } = calculateIncomeTax({
      income,
      salaried: incomeType === 'salaried',
      age,
      deductions,
    });
    const newIsBetter = newRegime.total <= oldRegime.total;
    const best = newIsBetter ? newRegime : oldRegime;
    const saving = Math.abs(newRegime.total - oldRegime.total);
    const bestName = newIsBetter ? 'new' : 'old';

    const row = (label, pick) => [label, formatINR(pick(newRegime)), formatINR(pick(oldRegime))];

    return {
      primary: {
        label: `Tax payable · ${bestName} regime`,
        value: formatINR(best.total),
        caption:
          saving >= 1
            ? `${formatINR(saving)} less than the ${newIsBetter ? 'old' : 'new'} regime`
            : 'Same under both regimes',
      },
      rows: [
        { label: 'Effective tax rate', value: income > 0 ? formatPercent((best.total / income) * 100) : '0%' },
        { label: 'Tax per month', value: formatINR(best.total / 12) },
        { label: 'Income after tax', value: formatINR(income - best.total), strong: true },
      ],
      insight:
        saving >= 1
          ? { tone: 'positive', text: `Choosing the ${bestName} regime saves you ${formatINR(saving)} a year.` }
          : undefined,
      table: {
        title: 'Regime comparison',
        collapsible: false,
        columns: ['', 'New', 'Old'],
        rows: [
          row('Taxable income', (r) => r.taxable),
          row('Tax on slabs', (r) => r.slab),
          row('Rebate (87A)', (r) => -r.rebate),
          row('Surcharge', (r) => r.surcharge),
          row('Cess (4%)', (r) => r.cess),
          row('Total tax', (r) => r.total),
        ],
      },
    };
  },

  summary: ({ income }) => `${formatINRWords(income)} income`,
  note: 'Tax year 2026-27 rates (unchanged in Budget 2026). New regime: ₹75,000 standard deduction and no tax up to ₹12 lakh taxable income. Old regime: ₹50,000 standard deduction. Includes surcharge with marginal relief and 4% cess. Capital gains and other special-rate income are not covered — this is an estimate, not tax advice.',
};
