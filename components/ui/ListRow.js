import { Pressable, Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import IconChip from '@/components/ui/IconChip';
import { colors } from '@/theme/colors';

// One tappable row inside a grouped white list (recents, search, category).
export default function ListRow({ icon, accent, title, subtitle, onPress, showDivider = false }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      className="active:bg-surface-soft"
    >
      {showDivider ? <View className="absolute left-16 right-0 top-0 h-px bg-border" /> : null}
      <View className="min-h-[64px] flex-row items-center px-4 py-3">
        <IconChip icon={icon} accent={accent} size="sm" />
        <View className="ml-3 flex-1 pr-2">
          <Text className="text-label font-semibold text-ink" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-caption text-ink-secondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}
