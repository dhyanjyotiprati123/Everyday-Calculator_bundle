import { useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';

import { formatNumberInput, sanitizeNumberInput } from '@/calculators/engine';
import Chip from '@/components/calculator/Chip';
import { FieldHelper, FieldLabel } from '@/components/calculator/FieldLabel';
import { colors } from '@/theme/colors';
import { amountInWords } from '@/utils/format';

function keyboardTypeFor(field) {
  // Android's decimal pad has no minus key, so signed fields use the full numeric pad.
  if (field.allowNegative) return Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric';
  return field.decimal ? 'decimal-pad' : 'number-pad';
}

export default function NumberField({ field, label, suffix, value, error, onChange }) {
  const [focused, setFocused] = useState(false);
  const number = value === '' ? NaN : Number(value);
  const words = field.inWords && Number.isFinite(number) ? amountInWords(number) : null;
  const hint = words ? `${field.prefix ?? ''}${words}` : field.hint;

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <View
        className={`min-h-[52px] flex-row items-center rounded-xl border px-3.5 ${
          error ? 'border-danger bg-danger-soft' : focused ? 'border-primary bg-surface' : 'border-transparent bg-surface-soft'
        }`}
      >
        {field.prefix ? <Text className="mr-1.5 text-label font-medium text-ink-secondary">{field.prefix}</Text> : null}
        <TextInput
          value={formatNumberInput(value, field.grouping)}
          onChangeText={(text) => onChange(sanitizeNumberInput(text, field))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardTypeFor(field)}
          returnKeyType="done"
          selectTextOnFocus
          placeholder={field.optional ? 'Optional' : '0'}
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel={suffix ? `${label}, in ${suffix}` : label}
          // Regular weight while empty so the placeholder never looks like an entered value.
          className={`flex-1 py-3 text-label text-ink ${value ? 'font-semibold' : 'font-normal'}`}
        />
        {suffix ? <Text className="ml-2 text-caption text-ink-secondary">{suffix}</Text> : null}
      </View>
      <FieldHelper error={error} hint={hint} />

      {field.presets ? (
        <View className="mt-2.5 flex-row flex-wrap gap-2">
          {field.presets.map((preset) => (
            <Chip
              key={preset}
              label={`${preset}${field.presetSuffix ?? ''}`}
              selected={value !== '' && number === preset}
              onPress={() => onChange(String(preset))}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
