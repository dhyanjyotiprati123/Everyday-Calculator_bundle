import { Pressable, Text } from 'react-native';

// Small selectable pill used for quick presets and multi-option choices.
export default function Chip({ label, selected, onPress, role = 'button' }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      collapsable={false}
      accessibilityRole={role}
      accessibilityState={role === 'radio' ? { checked: selected } : { selected }}
      className={`min-h-[36px] items-center justify-center rounded-full border px-3.5 active:opacity-70 ${
        selected ? 'border-primary bg-primary-soft' : 'border-border bg-surface'
      }`}
    >
      <Text className={`text-caption ${selected ? 'font-semibold text-primary-dark' : 'font-medium text-ink-secondary'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
