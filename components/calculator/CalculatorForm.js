import { Text, View } from 'react-native';

import { isFieldVisible, resolve } from '@/calculators/engine';
import ChoiceField from '@/components/calculator/ChoiceField';
import DateField from '@/components/calculator/DateField';
import NumberField from '@/components/calculator/NumberField';

const FIELD_COMPONENTS = { number: NumberField, choice: ChoiceField, date: DateField };

// Renders a definition's visible fields in one card, with optional section headings.
export default function CalculatorForm({ definition, values, errors, onChange }) {
  const fields = definition.fields.filter((field) => isFieldVisible(field, values));

  return (
    <View className="mx-5 rounded-2xl border border-border bg-surface p-4">
      {fields.map((field, index) => {
        const FieldComponent = FIELD_COMPONENTS[field.type];
        const heading = field.section && field.section !== fields[index - 1]?.section ? field.section : null;

        return (
          <View key={field.key} className={index === 0 ? '' : heading ? 'mt-6' : 'mt-5'}>
            {heading ? (
              <Text accessibilityRole="header" className="mb-3 text-label font-semibold text-ink">
                {heading}
              </Text>
            ) : null}
            <FieldComponent
              field={field}
              label={resolve(field.label, values)}
              suffix={resolve(field.suffix, values)}
              value={values[field.key]}
              error={errors[field.key]}
              onChange={(value) => onChange(field.key, value)}
            />
          </View>
        );
      })}
    </View>
  );
}
