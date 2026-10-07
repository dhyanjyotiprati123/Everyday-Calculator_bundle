import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { RecentsProvider } from '@/providers/RecentsProvider';
import { colors } from '@/theme/colors';

// Screens opened directly (deep links) still have Home underneath, so Back
// returns to the app instead of leaving it.
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  return (
    <RecentsProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </RecentsProvider>
  );
}
