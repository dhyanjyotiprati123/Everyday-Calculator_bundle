import { Pressable, Text } from 'react-native';

import Icon from '@/components/ui/Icon';
import { colors } from '@/theme/colors';

const VARIANTS = {
  digit: { box: 'border border-border bg-surface', text: 'text-[26px] font-medium text-ink', icon: colors.textPrimary },
  function: { box: 'bg-surface-soft', text: 'text-[20px] font-semibold text-ink', icon: colors.textPrimary },
  operator: { box: 'bg-primary-soft', text: 'text-[28px] font-medium text-primary-dark', icon: colors.primaryDark },
  equals: { box: 'bg-primary', text: 'text-[30px] font-semibold text-white', icon: colors.surface },
};

// One keypad key. Width comes from the row (flex-1); height from the aspect ratio.
export default function KeypadButton({ label, icon, variant = 'digit', accessibilityLabel, accessibilityHint, onPress, onLongPress }) {
  const style = VARIANTS[variant];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      className={`flex-1 items-center justify-center rounded-2xl active:opacity-60 ${style.box}`}
      style={{ aspectRatio: 1.3 }}
    >
      {icon ? (
        <Icon name={icon} size={26} color={style.icon} />
      ) : (
        <Text maxFontSizeMultiplier={1.2} className={style.text}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
