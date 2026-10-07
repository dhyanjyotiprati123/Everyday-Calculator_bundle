import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import Icon from '@/components/ui/Icon';
import { colors } from '@/theme/colors';

const cellClass = (index) => (index === 0 ? 'flex-[0.8] text-left' : 'flex-1 text-right');

export default function ResultTable({ title, columns, rows, collapsible = true }) {
  const [open, setOpen] = useState(!collapsible);

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-surface">
      {collapsible ? (
        <Pressable
          onPress={() => setOpen((value) => !value)}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          className="min-h-[52px] flex-row items-center justify-between px-4 active:bg-surface-soft"
        >
          <Text className="text-label font-semibold text-ink">{title}</Text>
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
        </Pressable>
      ) : (
        <Text accessibilityRole="header" className="px-4 pb-1 pt-4 text-label font-semibold text-ink">
          {title}
        </Text>
      )}

      {open ? (
        <View className="px-4 pb-2">
          <View className="flex-row border-b border-border pb-2 pt-1">
            {columns.map((column, index) => (
              <Text key={column || index} className={`${cellClass(index)} text-meta font-semibold text-ink-secondary`}>
                {column}
              </Text>
            ))}
          </View>
          {rows.map((row, rowIndex) => (
            <View
              key={row[0] || rowIndex}
              className={`flex-row py-2.5 ${rowIndex === rows.length - 1 ? '' : 'border-b border-border'}`}
            >
              {row.map((cell, index) => (
                <Text
                  key={index}
                  className={`${cellClass(index)} text-caption ${index === 0 ? 'text-ink-secondary' : 'font-medium text-ink'}`}
                >
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
