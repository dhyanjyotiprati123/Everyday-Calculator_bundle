import { FlatList, View } from 'react-native';

import PopularCalculatorCard from '@/components/home/PopularCalculatorCard';
import SectionHeader from '@/components/ui/SectionHeader';

export default function PopularCalculators({ calculators, onSelect, onSeeAll }) {
  return (
    <View className="mt-7">
      <SectionHeader
        title="Popular"
        actionLabel="See all"
        actionAccessibilityLabel="See all calculators"
        onAction={onSeeAll}
      />
      <FlatList
        horizontal
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PopularCalculatorCard calculator={item} onPress={() => onSelect(item.id)} />}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-5"
      />
    </View>
  );
}
