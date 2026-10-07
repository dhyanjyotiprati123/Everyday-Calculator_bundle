import { Tabs } from 'expo-router/js-tabs';

import BottomNavigation from '@/components/navigation/BottomNavigation';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
