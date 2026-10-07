import { Text, View } from 'react-native';

import IconChip from '@/components/ui/IconChip';
import PressableScale from '@/components/ui/PressableScale';

export default function PopularCalculatorCard({ calculator, onPress }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${calculator.name}, ${calculator.subtitle}`}
    >
      {/* min-width keeps cards uniform at default text size and lets them grow with larger system fonts */}
      <View className="min-w-32 rounded-2xl border border-border bg-surface p-3.5">
        <IconChip icon={calculator.icon} accent={calculator.accent} size="sm" />
        <Text className="mt-3 text-label font-semibold text-ink" numberOfLines={1}>
          {calculator.title}
        </Text>
        <Text className="mt-0.5 text-meta text-ink-secondary" numberOfLines={1}>
          {calculator.subtitle}
        </Text>
      </View>
    </PressableScale>
  );
}
