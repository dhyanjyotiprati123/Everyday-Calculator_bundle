import { View } from 'react-native';

import Icon from '@/components/ui/Icon';
import PressableScale from '@/components/ui/PressableScale';
import { colors } from '@/theme/colors';

// 44×44 circular icon button. `label` is required for screen readers.
export default function IconButton({ icon, label, onPress, bordered = true }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.92}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${
          bordered ? 'border border-border bg-surface' : ''
        }`}
      >
        <Icon name={icon} size={20} color={colors.textPrimary} />
      </View>
    </PressableScale>
  );
}
