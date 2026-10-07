import { Pressable, Text, View } from 'react-native';

export default function SectionHeader({ title, subtitle, actionLabel, actionAccessibilityLabel, onAction }) {
  return (
    <View className="mb-3 flex-row items-end justify-between px-5">
      <View className="flex-1 pr-3">
        <Text accessibilityRole="header" className="text-section font-semibold text-ink">
          {title}
        </Text>
        {subtitle ? <Text className="mt-0.5 text-caption text-ink-secondary">{subtitle}</Text> : null}
      </View>

      {actionLabel ? (
        <Pressable
          onPress={onAction}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
          className="py-1 active:opacity-60"
        >
          <Text className="text-body font-semibold text-primary-dark">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
