import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmptyState from '@/components/ui/EmptyState';
import PressableScale from '@/components/ui/PressableScale';
import ScreenBackground from '@/components/ui/ScreenBackground';
import ScreenHeader from '@/components/ui/ScreenHeader';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="pb-8">
        <ScreenHeader title="Favorites" subtitle="Your go-to calculators in one place" />
        <EmptyState
          icon="heart-outline"
          accent="peach"
          title="No favorites yet"
          message="Calculators you save as favorites will appear here for quick access."
        >
          <PressableScale
            onPress={() => router.push('/search')}
            className="mt-5"
            accessibilityRole="button"
            accessibilityLabel="Browse calculators"
          >
            <View className="min-h-[44px] items-center justify-center rounded-xl bg-primary-soft px-5">
              <Text className="text-body font-semibold text-primary-dark">Browse calculators</Text>
            </View>
          </PressableScale>
        </EmptyState>
      </ScrollView>
    </ScreenBackground>
  );
}
