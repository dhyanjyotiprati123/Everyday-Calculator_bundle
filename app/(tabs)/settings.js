import Constants from 'expo-constants';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import IconChip from '@/components/ui/IconChip';
import ListGroup from '@/components/ui/ListGroup';
import ScreenBackground from '@/components/ui/ScreenBackground';
import ScreenHeader from '@/components/ui/ScreenHeader';

const INFO_ROWS = [
  {
    icon: 'information-circle-outline',
    accent: 'blue',
    title: 'Version',
    value: Constants.expoConfig?.version ?? '1.0.0',
  },
  {
    icon: 'cloud-offline-outline',
    accent: 'mint',
    title: 'Works offline',
    value: 'Your history stays on this device',
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerClassName="pb-8">
        <ScreenHeader title="Settings" subtitle="Preferences and app information" />
        <ListGroup>
          {INFO_ROWS.map((row, index) => (
            <View key={row.title} className={`min-h-[64px] flex-row items-center px-4 py-3 ${index > 0 ? 'border-t border-border' : ''}`}>
              <IconChip icon={row.icon} accent={row.accent} size="sm" />
              <View className="ml-3 flex-1">
                <Text className="text-label font-semibold text-ink">{row.title}</Text>
                <Text className="mt-0.5 text-caption text-ink-secondary">{row.value}</Text>
              </View>
            </View>
          ))}
        </ListGroup>
      </ScrollView>
    </ScreenBackground>
  );
}
