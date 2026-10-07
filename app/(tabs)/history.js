import { useRouter } from 'expo-router';
import { Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RecentCalculatorItem from '@/components/home/RecentCalculatorItem';
import EmptyState from '@/components/ui/EmptyState';
import IconButton from '@/components/ui/IconButton';
import ListGroup from '@/components/ui/ListGroup';
import ScreenBackground from '@/components/ui/ScreenBackground';
import ScreenHeader from '@/components/ui/ScreenHeader';
import { useRecents } from '@/providers/RecentsProvider';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { recents, clearRecents } = useRecents();
  const hasHistory = recents.length > 0;

  const confirmClear = () =>
    Alert.alert('Clear history?', 'This removes your recently used calculators from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearRecents },
    ]);

  return (
    <ScreenBackground style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="pb-8">
        <ScreenHeader
          title="History"
          subtitle="Calculators you've used recently"
          action={hasHistory ? <IconButton icon="trash-outline" label="Clear history" onPress={confirmClear} /> : null}
        />
        {hasHistory ? (
          <ListGroup>
            {recents.map((entry, index) => (
              <RecentCalculatorItem
                key={entry.calculatorId}
                entry={entry}
                onPress={() => router.push({ pathname: '/calculator/[id]', params: { id: entry.calculatorId } })}
                showDivider={index > 0}
              />
            ))}
          </ListGroup>
        ) : (
          <EmptyState
            icon="time-outline"
            accent="sky"
            title="No history yet"
            message="Calculators you use will show up here so you can get back to them quickly."
          />
        )}
      </ScrollView>
    </ScreenBackground>
  );
}
