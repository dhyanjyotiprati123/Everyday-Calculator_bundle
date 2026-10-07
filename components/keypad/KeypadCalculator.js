import { Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  clearHistory,
  formatExpression,
  pressKey,
  previewResult,
  recallHistory,
  restoreState,
} from '@/calculators/basic/expression';
import KeypadButton from '@/components/keypad/KeypadButton';
import IconButton from '@/components/ui/IconButton';
import { useRecents } from '@/providers/RecentsProvider';

const SAVE_DELAY_MS = 500;
const VISIBLE_HISTORY = 3;

// [key, label, variant, accessibility label]
const ROWS = [
  [['clear', 'AC', 'function', 'All clear'], ['()', '( )', 'function', 'Brackets'], ['%', '%', 'function', 'Percent'], ['÷', '÷', 'operator', 'Divide']],
  [['7'], ['8'], ['9'], ['×', '×', 'operator', 'Multiply']],
  [['4'], ['5'], ['6'], ['−', '−', 'operator', 'Minus']],
  [['1'], ['2'], ['3'], ['+', '+', 'operator', 'Plus']],
  [['0'], ['.', '.', 'digit', 'Decimal point'], ['back', null, 'digit', 'Backspace'], ['=', '=', 'equals', 'Equals']],
];

// Shrinks the main line as the expression grows so it stays on screen.
function displaySize(text) {
  if (text.length <= 10) return { fontSize: 48, lineHeight: 58 };
  if (text.length <= 14) return { fontSize: 40, lineHeight: 48 };
  if (text.length <= 20) return { fontSize: 32, lineHeight: 40 };
  return { fontSize: 26, lineHeight: 34 };
}

function HistoryRow({ entry, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${entry.expression} equals ${entry.result}`}
      accessibilityHint="Uses this result"
      className="items-end rounded-xl px-2 py-1.5 active:bg-surface-soft"
    >
      <Text numberOfLines={1} className="text-body text-ink-secondary">
        {entry.expression} = <Text className="font-semibold text-ink">{entry.result}</Text>
      </Text>
    </Pressable>
  );
}

export default function KeypadCalculator({ calculator }) {
  const insets = useSafeAreaInsets();
  const { recents, addRecent } = useRecents();

  // Reopening restores the last expression and history.
  const [state, setState] = useState(() =>
    restoreState(recents.find((entry) => entry.calculatorId === calculator.id)?.values)
  );
  const press = useCallback((key) => setState((current) => pressKey(current, key)), []);

  // Save to Recently used once input pauses; the newest result is the summary.
  const latest = state.history[0];
  const summary = latest ? `${latest.expression} = ${latest.result}` : undefined;
  const saved = useMemo(
    () => ({ expression: state.expression, history: state.history, carry: state.carry, justEvaluated: state.justEvaluated }),
    [state.expression, state.history, state.carry, state.justEvaluated]
  );
  useEffect(() => {
    const timer = setTimeout(() => addRecent(calculator.id, summary, saved), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [addRecent, calculator.id, summary, saved]);

  const hasHistory = state.history.length > 0;
  const screenOptions = useMemo(
    () => ({
      title: calculator.name,
      headerRight: hasHistory
        ? () => (
            <View className="-mr-2">
              <IconButton
                icon="trash-outline"
                label="Clear history"
                bordered={false}
                onPress={() => setState((current) => clearHistory(current))}
              />
            </View>
          )
        : undefined,
    }),
    [calculator.name, hasHistory]
  );

  const display = state.expression ? formatExpression(state.expression) : '0';
  const preview = state.justEvaluated ? null : previewResult(state.expression, state.carry);
  const history = state.history.slice(0, VISIBLE_HISTORY).reverse();

  return (
    <>
      <Stack.Screen options={screenOptions} />
      <View className="flex-1 bg-background">
        {/* Display: newest content sits at the bottom, older history scrolls off the top. */}
        <View className="flex-1 justify-end overflow-hidden px-4 pb-4">
          {history.map((entry, index) => (
            <HistoryRow
              key={`${state.history.length - index}-${entry.result}`}
              entry={entry}
              onPress={() => setState((current) => recallHistory(current, entry))}
            />
          ))}
          <Text
            selectable
            accessibilityLiveRegion="polite"
            accessibilityLabel={state.justEvaluated ? `Result ${display}` : display}
            className={`mt-2 px-2 text-right ${state.justEvaluated ? 'font-bold' : 'font-medium'} text-ink`}
            style={[displaySize(display), { fontVariant: ['tabular-nums'] }]}
          >
            {display}
          </Text>
          <Text
            selectable
            numberOfLines={1}
            className={`mt-1 min-h-[30px] px-2 text-right text-[22px] ${state.error ? 'text-danger' : 'text-ink-secondary'}`}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {state.error ?? (preview ? `= ${preview}` : '')}
          </Text>
        </View>

        <View className="gap-2.5 border-t border-border bg-surface px-4 pt-4" style={{ paddingBottom: insets.bottom + 12 }}>
          {ROWS.map((row) => (
            <View key={row[0][0]} className="flex-row gap-2.5">
              {row.map(([key, label = key, variant = 'digit', accessibilityLabel]) => (
                <KeypadButton
                  key={key}
                  label={label}
                  icon={key === 'back' ? 'backspace-outline' : undefined}
                  variant={variant}
                  accessibilityLabel={accessibilityLabel}
                  accessibilityHint={key === 'back' ? 'Long press to clear everything' : undefined}
                  onPress={() => press(key)}
                  onLongPress={key === 'back' ? () => press('clear') : undefined}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
