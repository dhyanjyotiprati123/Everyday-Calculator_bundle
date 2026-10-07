import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmptyState from '@/components/ui/EmptyState';
import Icon from '@/components/ui/Icon';
import IconButton from '@/components/ui/IconButton';
import ListGroup from '@/components/ui/ListGroup';
import ListRow from '@/components/ui/ListRow';
import { searchCalculators } from '@/data/calculators';
import { colors } from '@/theme/colors';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const results = searchCalculators(query);
  const hasQuery = query.trim().length > 0;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-1 pb-2 pl-2 pr-5 pt-2">
        <IconButton icon="arrow-back" label="Back" bordered={false} onPress={() => router.back()} />
        <View className="min-h-[48px] flex-1 flex-row items-center rounded-2xl border border-border bg-surface pl-3.5 pr-2">
          <Icon name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search calculators…"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Search calculators"
            className="ml-2 flex-1 py-2 text-label text-ink"
          />
          {query ? (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              className="h-8 w-8 items-center justify-center active:opacity-60"
            >
              <Icon name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {results.length > 0 ? (
          <>
            <Text className="px-5 pb-2 pt-3 text-caption font-medium text-ink-secondary">
              {hasQuery ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'All calculators'}
            </Text>
            <ListGroup>
              {results.map((calculator, index) => (
                <ListRow
                  key={calculator.id}
                  icon={calculator.icon}
                  accent={calculator.accent}
                  title={calculator.name}
                  subtitle={calculator.subtitle}
                  showDivider={index > 0}
                  onPress={() => router.push({ pathname: '/calculator/[id]', params: { id: calculator.id } })}
                />
              ))}
            </ListGroup>
          </>
        ) : (
          <EmptyState
            icon="search-outline"
            title="No calculators found"
            message={`Nothing matches “${query.trim()}”. Try “loan”, “tax” or “fuel”.`}
          />
        )}
      </ScrollView>
    </View>
  );
}
