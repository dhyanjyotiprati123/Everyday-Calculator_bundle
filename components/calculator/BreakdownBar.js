import { Text, View } from 'react-native';

import { chartColors } from '@/theme/colors';

// Proportion bar with a legend; the legend repeats every value so the colours
// are never the only way to read it.
export default function BreakdownBar({ segments }) {
  const total = segments.reduce((sum, segment) => sum + Math.max(0, segment.amount), 0);
  if (total <= 0) return null;

  return (
    <View className="rounded-2xl border border-border bg-surface p-4">
      <View
        className="h-3 flex-row gap-0.5 overflow-hidden rounded-full bg-surface-soft"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {segments.map((segment, index) =>
          segment.amount > 0 ? (
            <View key={segment.label} style={{ flex: segment.amount, backgroundColor: chartColors[index] }} />
          ) : null
        )}
      </View>

      <View className="mt-3.5 gap-2.5">
        {segments.map((segment, index) => (
          <View key={segment.label} className="flex-row items-center">
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[index] }} />
            <Text className="ml-2.5 flex-1 text-body text-ink-secondary">{segment.label}</Text>
            <Text className="text-body font-semibold text-ink">{segment.display}</Text>
            <Text className="ml-2 w-11 text-right text-caption text-ink-secondary">
              {Math.round((Math.max(0, segment.amount) / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
