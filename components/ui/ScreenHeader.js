import { Text, View } from 'react-native';

// Title block for top-level tab screens (Favorites, History, Settings).
export default function ScreenHeader({ title, subtitle, action }) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
      <View className="flex-1 pr-3">
        <Text accessibilityRole="header" className="text-title font-bold text-ink">
          {title}
        </Text>
        {subtitle ? <Text className="mt-0.5 text-caption text-ink-secondary">{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}
