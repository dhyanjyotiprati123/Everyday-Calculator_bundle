// Calculator logic by catalogue id (see data/calculators.js for titles/icons).
import area from './home/area';
import bricks from './home/bricks';
import concrete from './home/concrete';
import paint from './home/paint';
import tiles from './home/tiles';
import length from './converters/length';
import temperature from './converters/temperature';
import weight from './converters/weight';
import age from './everyday/age';
import dateDifference from './everyday/dateDifference';
import percentage from './everyday/percentage';
import compoundInterest from './finance/compoundInterest';
import emi from './finance/emi';
import fixedDeposit from './finance/fixedDeposit';
import incomeTax from './finance/incomeTax';
import inflation from './finance/inflation';
import lumpsum from './finance/lumpsum';
import ppf from './finance/ppf';
import recurringDeposit from './finance/recurringDeposit';
import simpleInterest from './finance/simpleInterest';
import sip from './finance/sip';
import discount from './shopping/discount';
import gst from './shopping/gst';
import profitMargin from './shopping/profitMargin';
import splitBill from './shopping/splitBill';
import unitPrice from './shopping/unitPrice';
import evCharging from './vehicle/evCharging';
import fuelCost from './vehicle/fuelCost';
import mileage from './vehicle/mileage';
import travelTime from './vehicle/travelTime';

const definitions = {
  emi,
  sip,
  lumpsum,
  'fixed-deposit': fixedDeposit,
  'recurring-deposit': recurringDeposit,
  ppf,
  'simple-interest': simpleInterest,
  'compound-interest': compoundInterest,
  'income-tax': incomeTax,
  inflation,
  gst,
  discount,
  'split-bill': splitBill,
  'unit-price': unitPrice,
  'profit-margin': profitMargin,
  area,
  paint,
  tiles,
  bricks,
  concrete,
  'fuel-cost': fuelCost,
  mileage,
  'travel-time': travelTime,
  'ev-charging': evCharging,
  age,
  'date-difference': dateDifference,
  percentage,
  length,
  weight,
  temperature,
};

export const getDefinition = (id) => definitions[id];
