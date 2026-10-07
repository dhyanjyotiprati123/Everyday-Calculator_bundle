import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildShareText, defaultValues, evaluate, restoreValues } from '@/calculators/engine';
import { getDefinition } from '@/calculators';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import ResultPanel from '@/components/calculator/ResultPanel';
import KeypadCalculator from '@/components/keypad/KeypadCalculator';
import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import IconButton from '@/components/ui/IconButton';
import { getCalculator } from '@/data/calculators';
import { useRecents } from '@/providers/RecentsProvider';
import { colors } from '@/theme/colors';

const SAVE_DELAY_MS = 500;

function CalculatorView({ calculator, definition }) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { recents, addRecent } = useRecents();

  // Reopening a calculator restores the inputs it was last used with.
  const [values, setValues] = useState(() =>
    restoreValues(definition, recents.find((entry) => entry.calculatorId === calculator.id)?.values)
  );
  const { errors, result, summary } = evaluate(definition, values);
  const isValid = result !== null;

  // Record the visit once typing pauses. Only valid inputs are saved, so a
  // calculator never reopens in an error state.
  useEffect(() => {
    if (!isValid) return undefined;
    const timer = setTimeout(() => addRecent(calculator.id, summary, values), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [addRecent, calculator.id, isValid, summary, values]);

  const setValue = useCallback((key, value) => setValues((current) => ({ ...current, [key]: value })), []);

  // Header actions are memoised so the header isn't re-set on every keystroke;
  // sharing reads the latest result through a ref.
  const latestResult = useRef(result);
  useEffect(() => {
    latestResult.current = result;
  });
  const reset = useCallback(() => setValues(defaultValues(definition)), [definition]);
  const share = useCallback(() => {
    if (latestResult.current) Share.share({ message: buildShareText(calculator.name, latestResult.current) });
  }, [calculator.name]);
  const screenOptions = useMemo(
    () => ({
      title: calculator.name,
      headerRight: () => (
        <View className="-mr-2 flex-row">
          <IconButton icon="refresh-outline" label="Reset to default values" bordered={false} onPress={reset} />
          <IconButton icon="share-social-outline" label="Share result" bordered={false} onPress={share} />
        </View>
      ),
    }),
    [calculator.name, reset, share]
  );

  return (
    <>
      <Stack.Screen options={screenOptions} />
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={headerHeight} className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 32 }}
        >
          <CalculatorForm definition={definition} values={values} errors={errors} onChange={setValue} />
          <ResultPanel result={result} hasErrors={Object.keys(errors).length > 0} accent={calculator.accent} />
          {definition.note ? (
            <View className="mx-5 mt-4 flex-row items-start px-1">
              <Icon name="information-circle-outline" size={16} color={colors.textSecondary} />
              <Text className="ml-2 flex-1 text-meta leading-[18px] text-ink-secondary">{definition.note}</Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default function CalculatorScreen() {
  const { id } = useLocalSearchParams();
  const { isLoaded } = useRecents();
  const calculator = getCalculator(id);
  const definition = getDefinition(id);

  // Saved inputs must be loaded before a calculator restores them — otherwise a
  // cold start straight into this screen (deep link) would begin empty and then
  // save that empty state over the user's data.
  if (!isLoaded) return <Stack.Screen options={{ title: calculator?.name ?? '' }} />;

  // The basic calculator has its own keypad screen instead of a form.
  if (calculator?.kind === 'keypad') return <KeypadCalculator key={calculator.id} calculator={calculator} />;

  if (!calculator || !definition) {
    return (
      <>
        <Stack.Screen options={{ title: 'Not found' }} />
        <EmptyState icon="alert-circle-outline" title="Calculator not found" message="It may have been moved or renamed." />
      </>
    );
  }

  // Keyed so switching calculators starts with fresh state.
  return <CalculatorView key={calculator.id} calculator={calculator} definition={definition} />;
}
