import { Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import IconChip from '@/components/ui/IconChip';
import PressableScale from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';

export default function CategoryCard({ category, onPress }) {
  const toolCount = `${category.count} ${category.count === 1 ? 'tool' : 'tools'}`;

  return (
    <PressableScale
      onPress={onPress}
      className="flex-1"
      accessibilityRole="button"
      accessibilityLabel={`${category.title}. ${category.description}. ${toolCount}`}
    >
      <View className="grow rounded-2xl border border-border bg-surface p-4">
        <View className="flex-row items-start justify-between">
          <IconChip icon={category.icon} accent={category.accent} />
          <Icon name="arrow-forward" size={18} color={colors.textMuted} />
        </View>

        <Text className="mt-4 text-label font-semibold text-ink" numberOfLines={2}>
          {category.title}
        </Text>
        <Text className="mt-1 text-meta text-ink-secondary" numberOfLines={3}>
          {category.description}
        </Text>

        <View className="flex-1" />
        <View className="mt-3 self-start rounded-full bg-surface-soft px-2.5 py-1">
          <Text className="text-meta font-medium text-ink">{toolCount}</Text>
        </View>
      </View>
    </PressableScale>
  );
}
