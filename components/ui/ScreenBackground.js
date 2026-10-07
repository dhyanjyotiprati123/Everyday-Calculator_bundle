import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';

const GRADIENT = [colors.backgroundTop, colors.background];
const GRADIENT_STOPS = [0, 0.45];

// Full-screen container with a barely-there cool tint fading in from the top.
export default function ScreenBackground({ children, style }) {
  return (
    <View className="flex-1 bg-background" style={style}>
      <LinearGradient colors={GRADIENT} locations={GRADIENT_STOPS} style={StyleSheet.absoluteFill} pointerEvents="none" />
      {children}
    </View>
  );
}
