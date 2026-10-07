import { createUnitConverter, linearUnit } from './unitConverter';

// Base unit: metre.
export default createUnitConverter({
  defaultUnit: 'm',
  units: [
    linearUnit('mm', 'mm', 'Millimetres', 0.001, 'in'),
    linearUnit('cm', 'cm', 'Centimetres', 0.01, 'in'),
    linearUnit('m', 'm', 'Metres', 1, 'ft'),
    linearUnit('km', 'km', 'Kilometres', 1000, 'mi'),
    linearUnit('in', 'in', 'Inches', 0.0254, 'cm'),
    linearUnit('ft', 'ft', 'Feet', 0.3048, 'm'),
    linearUnit('yd', 'yd', 'Yards', 0.9144, 'm'),
    linearUnit('mi', 'mi', 'Miles', 1609.344, 'km'),
  ],
});
