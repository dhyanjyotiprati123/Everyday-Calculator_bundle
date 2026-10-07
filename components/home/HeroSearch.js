import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import PressableScale from '@/components/ui/PressableScale';
import { accents, colors } from '@/theme/colors';

const HERO_GRADIENT = [colors.primarySoft, accents.lavender.soft, colors.surface];
const FIELD_SHADOW = { boxShadow: '0px 2px 10px rgba(24, 32, 42, 0.06)' };

// Hero card with the search entry point. Looks like a search field; tapping it
// opens the search screen.
export default function HeroSearch({ onPress }) {
  return (
    <View className="mx-5 mt-4 overflow-hidden rounded-[20px] border border-primary-soft">
      <LinearGradient
        colors={HERO_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View className="p-5">
        <Text className="text-headline font-semibold text-ink">What do you need to calculate?</Text>
        <Text className="mt-1.5 text-body text-ink-secondary">
          Quick answers for money, shopping, home, vehicles and more.
        </Text>

        <PressableScale
          onPress={onPress}
          scaleTo={0.98}
          className="mt-4"
          accessibilityRole="button"
          accessibilityLabel="Search calculators"
          accessibilityHint="Opens calculator search"
        >
          <View
            className="min-h-[54px] flex-row items-center rounded-2xl border border-border bg-surface py-1.5 pl-4 pr-1.5"
            style={FIELD_SHADOW}
          >
            <Text className="flex-1 text-label text-ink-secondary" numberOfLines={1}>
              Search calculators…
            </Text>
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Icon name="search" size={19} color={colors.surface} />
            </View>
          </View>
        </PressableScale>
      </View>
    </View>
  );
}
