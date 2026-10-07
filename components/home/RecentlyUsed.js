import { View } from 'react-native';

import RecentCalculatorItem from '@/components/home/RecentCalculatorItem';
import ListGroup from '@/components/ui/ListGroup';
import SectionHeader from '@/components/ui/SectionHeader';

export default function RecentlyUsed({ entries, onSelect, onSeeAll }) {
  return (
    <View className="mt-8">
      <SectionHeader
        title="Recently used"
        actionLabel="See all"
        actionAccessibilityLabel="See all history"
        onAction={onSeeAll}
      />
      <ListGroup>
        {entries.map((entry, index) => (
          <RecentCalculatorItem
            key={entry.calculatorId}
            entry={entry}
            onPress={() => onSelect(entry.calculatorId)}
            showDivider={index > 0}
          />
        ))}
      </ListGroup>
    </View>
  );
}
