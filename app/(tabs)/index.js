import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CategoryGrid from '@/components/home/CategoryGrid';
import HeroSearch from '@/components/home/HeroSearch';
import HomeHeader from '@/components/home/HomeHeader';
import PopularCalculators from '@/components/home/PopularCalculators';
import RecentlyUsed from '@/components/home/RecentlyUsed';
import ScreenBackground from '@/components/ui/ScreenBackground';
import { categories, popularCalculators } from '@/data/calculators';
import { useRecents } from '@/providers/RecentsProvider';

const RECENTS_ON_HOME = 3;

// One gentle entrance for the whole screen rather than per-element animation.
const entrance = FadeInDown.duration(320).withInitialValues({ opacity: 0, transform: [{ translateY: 8 }] });

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recents } = useRecents();

  const openSearch = () => router.push('/search');
  const openCalculator = (id) => router.push({ pathname: '/calculator/[id]', params: { id } });
  const openCategory = (id) => router.push({ pathname: '/category/[id]', params: { id } });

  return (
    <ScreenBackground style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <Animated.View entering={entrance}>
          <HomeHeader onSearchPress={openSearch} onSettingsPress={() => router.navigate('/settings')} />
          <HeroSearch onPress={openSearch} />
          <PopularCalculators calculators={popularCalculators} onSelect={openCalculator} onSeeAll={openSearch} />
          <CategoryGrid categories={categories} onSelect={openCategory} />
          {recents.length > 0 ? (
            <RecentlyUsed
              entries={recents.slice(0, RECENTS_ON_HOME)}
              onSelect={openCalculator}
              onSeeAll={() => router.navigate('/history')}
            />
          ) : null}
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}
