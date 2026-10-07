import { View } from 'react-native';

import Icon from '@/components/ui/Icon';
import { accents } from '@/theme/colors';

const SIZES = {
  sm: { className: 'h-9 w-9 rounded-xl', icon: 18 },
  md: { className: 'h-11 w-11 rounded-xl', icon: 22 },
  lg: { className: 'h-14 w-14 rounded-2xl', icon: 26 },
};

// Rounded pastel square holding an icon — the only place category colour appears.
export default function IconChip({ icon, accent = 'blue', size = 'md' }) {
  const { soft, ink } = accents[accent];
  const { className, icon: iconSize } = SIZES[size];

  return (
    <View className={`items-center justify-center ${className}`} style={{ backgroundColor: soft }}>
      <Icon name={icon} size={iconSize} color={ink} />
    </View>
  );
}
