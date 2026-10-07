import { Pressable, Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import { colors } from '@/theme/colors';

// Icons per tab route; labels come from each Tabs.Screen `title`.
const TAB_ICONS = {
  index: { active: 'home', inactive: 'home-outline' },
  favorites: { active: 'heart', inactive: 'heart-outline' },
  history: { active: 'time', inactive: 'time-outline' },
  settings: { active: 'settings', inactive: 'settings-outline' },
};

function TabItem({ label, icons, isFocused, onPress, onLongPress }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      className="min-h-[52px] flex-1 items-center justify-center py-1"
    >
      {/* Active state = filled icon + pill + bold label, not colour alone.
          collapsable={false}: a flattened (background-less) view loses its
          corner radius on Android when the background is added later. */}
      <View
        collapsable={false}
        className={`h-8 w-14 items-center justify-center rounded-full ${isFocused ? 'bg-primary-soft' : ''}`}
      >
        <Icon
          name={isFocused ? icons.active : icons.inactive}
          size={22}
          color={isFocused ? colors.primary : colors.textMuted}
        />
      </View>
      <Text
        maxFontSizeMultiplier={1.3}
        numberOfLines={1}
        className={`mt-1 text-meta ${isFocused ? 'font-semibold text-primary-dark' : 'font-medium text-ink-secondary'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// Custom tab bar for expo-router's JS Tabs (`tabBar` prop).
export default function BottomNavigation({ state, descriptors, navigation, insets }) {
  return (
    <View
      accessibilityRole="tablist"
      className="flex-row border-t border-border bg-surface px-2 pt-1.5"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

        return (
          <TabItem
            key={route.key}
            label={options.title ?? route.name}
            icons={TAB_ICONS[route.name]}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}
