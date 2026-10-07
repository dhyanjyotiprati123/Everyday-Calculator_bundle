import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EmptyState from '@/components/ui/EmptyState';
import IconChip from '@/components/ui/IconChip';
import ListGroup from '@/components/ui/ListGroup';
import ListRow from '@/components/ui/ListRow';
import { getCalculatorsByCategory, getCategory } from '@/data/calculators';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const category = getCategory(id);

  if (!category) {
    return (
      <>
        <Stack.Screen options={{ title: 'Not found' }} />
        <EmptyState icon="alert-circle-outline" title="Category not found" message="It may have been moved or renamed." />
      </>
    );
  }

  const tools = getCalculatorsByCategory(category.id);

  return (
    <>
      <Stack.Screen options={{ title: category.title }} />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View className="flex-row items-center px-5 pb-5 pt-2">
          <IconChip icon={category.icon} accent={category.accent} size="lg" />
          <View className="ml-4 flex-1">
            <Text className="text-body text-ink-secondary">{category.description}</Text>
            <Text className="mt-0.5 text-caption font-medium text-ink">
              {category.count} {category.count === 1 ? 'tool' : 'tools'}
            </Text>
          </View>
        </View>

        <ListGroup>
          {tools.map((calculator, index) => (
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
      </ScrollView>
    </>
  );
}
