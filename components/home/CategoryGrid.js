import { View } from 'react-native';

import CategoryCard from '@/components/home/CategoryCard';
import SectionHeader from '@/components/ui/SectionHeader';

function toRows(items, perRow) {
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) rows.push(items.slice(i, i + perRow));
  return rows;
}

// Two-column grid built from flex rows, so cards share width evenly and
// cards in the same row match heights on any screen size.
export default function CategoryGrid({ categories, onSelect }) {
  return (
    <View className="mt-8">
      <SectionHeader title="Explore calculators" subtitle="Everything you need, organized simply." />
      <View className="gap-3 px-5">
        {toRows(categories, 2).map((row) => (
          <View key={row[0].id} className="flex-row gap-3">
            {row.map((category) => (
              <CategoryCard key={category.id} category={category} onPress={() => onSelect(category.id)} />
            ))}
            {row.length === 1 ? <View className="flex-1" /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}
