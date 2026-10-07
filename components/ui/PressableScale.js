import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const PRESS_IN = { duration: 120 };
const PRESS_OUT = { duration: 160 };

// Pressable that scales its content down slightly while pressed.
// `className` styles the outer Pressable (layout, e.g. `flex-1`); put visual
// classes on the child so they scale with it. To fill a stretched parent, give
// the child `grow` (not `flex-1`, whose zero basis collapses auto heights).
export default function PressableScale({ children, scaleTo = 0.97, onPressIn, onPressOut, ...props }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={(event) => {
        scale.value = withTiming(scaleTo, PRESS_IN);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withTiming(1, PRESS_OUT);
        onPressOut?.(event);
      }}
      {...props}
    >
      <Animated.View style={[{ flexGrow: 1 }, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
