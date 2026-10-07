import { Pressable, Text, View } from 'react-native';

import Chip from '@/components/calculator/Chip';
import { FieldHelper, FieldLabel } from '@/components/calculator/FieldLabel';

const SELECTED_SHADOW = { boxShadow: '0px 1px 3px rgba(24, 32, 42, 0.12)' };

// Up to three options render as a segmented control, more as wrapping chips.
export default function ChoiceField({ field, label, value, onChange }) {
  const segmented = field.variant !== 'chips' && field.options.length <= 3;

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      {segmented ? (
        <View accessibilityRole="radiogroup" className="flex-row rounded-xl bg-surface-soft p-1">
          {field.options.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
                hitSlop={{ top: 4, bottom: 4 }}
                collapsable={false}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                className={`min-h-[40px] flex-1 items-center justify-center rounded-lg px-2 py-1.5 ${selected ? 'bg-surface' : ''}`}
                style={selected ? SELECTED_SHADOW : undefined}
              >
                <Text
                  numberOfLines={2}
                  className={`text-center text-caption ${selected ? 'font-semibold text-ink' : 'font-medium text-ink-secondary'}`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View accessibilityRole="radiogroup" className="flex-row flex-wrap gap-2">
          {field.options.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              role="radio"
              selected={option.value === value}
              onPress={() => onChange(option.value)}
            />
          ))}
        </View>
      )}
      <FieldHelper hint={field.hint} />
    </View>
  );
}
