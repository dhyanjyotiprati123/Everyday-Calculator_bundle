import { Text, View } from 'react-native';

import IconButton from '@/components/ui/IconButton';

export default function HomeHeader({ onSearchPress, onSettingsPress }) {
  return (
    <View className="px-5 pb-1 pt-3">
      <View className="flex-row items-center justify-between">
        <Text
          accessibilityRole="header"
          className="flex-1 pr-3 text-title font-bold tracking-[-0.3px] text-ink"
          numberOfLines={1}
          // Shrinks slightly on narrow screens / large text instead of truncating.
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          Calcular Bundle
        </Text>
        <View className="flex-row gap-2">
          <IconButton icon="search-outline" label="Search calculators" onPress={onSearchPress} />
          <IconButton icon="settings-outline" label="Settings" onPress={onSettingsPress} />
        </View>
      </View>
      {/* Full-width line so it never competes with the icon buttons on narrow screens. */}
      <Text className="-mt-1 text-caption text-ink-secondary">One app for every calculation</Text>
    </View>
  );
}
