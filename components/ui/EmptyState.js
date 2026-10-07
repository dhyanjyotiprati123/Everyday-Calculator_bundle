import { Text, View } from 'react-native';

import IconChip from '@/components/ui/IconChip';

export default function EmptyState({ icon, accent = 'blue', title, message, children }) {
  return (
    <View className="items-center px-8 py-12">
      <IconChip icon={icon} accent={accent} size="lg" />
      <Text className="mt-4 text-center text-section font-semibold text-ink">{title}</Text>
      {message ? (
        <Text className="mt-1.5 max-w-[300px] text-center text-body text-ink-secondary">{message}</Text>
      ) : null}
      {children}
    </View>
  );
}
