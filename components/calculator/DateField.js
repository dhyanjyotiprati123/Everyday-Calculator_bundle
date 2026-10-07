import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, Text, View } from 'react-native';

import { FieldHelper, FieldLabel } from '@/components/calculator/FieldLabel';
import Icon from '@/components/ui/Icon';
import { colors } from '@/theme/colors';
import { formatDate, parseISODate, toISODate, weekdayName } from '@/utils/dates';

const resolveLimit = (limit) => (limit === 'today' ? new Date() : limit ? parseISODate(limit) : undefined);

export default function DateField({ field, label, value, error, onChange }) {
  const date = parseISODate(value) ?? new Date();
  const limits = { minimumDate: resolveLimit(field.minDate), maximumDate: resolveLimit(field.maxDate) };
  // Fires only when a date is picked (not on dismiss).
  const handleValueChange = (_event, selected) => onChange(toISODate(selected));

  if (Platform.OS === 'ios') {
    return (
      <View>
        <FieldLabel>{label}</FieldLabel>
        <View className="min-h-[52px] flex-row items-center justify-between rounded-xl bg-surface-soft px-3.5">
          <Text className="text-caption text-ink-secondary">{weekdayName(date)}</Text>
          <DateTimePicker value={date} mode="date" display="compact" onValueChange={handleValueChange} {...limits} />
        </View>
        <FieldHelper error={error} hint={field.hint} />
      </View>
    );
  }

  return (
    <View>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        onPress={() => DateTimePickerAndroid.open({ value: date, mode: 'date', onValueChange: handleValueChange, ...limits })}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${formatDate(date)}`}
        accessibilityHint="Opens a calendar to pick a date"
        className={`min-h-[52px] flex-row items-center rounded-xl border px-3.5 active:opacity-80 ${
          error ? 'border-danger bg-danger-soft' : 'border-transparent bg-surface-soft'
        }`}
      >
        <Icon name="calendar-outline" size={18} color={colors.textSecondary} />
        <Text className="ml-2.5 flex-1 text-label font-semibold text-ink">{formatDate(date)}</Text>
        <Text className="text-caption text-ink-secondary">{weekdayName(date)}</Text>
      </Pressable>
      <FieldHelper error={error} hint={field.hint} />
    </View>
  );
}
