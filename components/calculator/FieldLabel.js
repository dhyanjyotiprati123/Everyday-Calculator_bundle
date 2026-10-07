import { Text } from 'react-native';

export function FieldLabel({ children }) {
  return <Text className="mb-1.5 text-caption font-medium text-ink-secondary">{children}</Text>;
}

// Hint below a field; errors replace the hint and are shown in red.
export function FieldHelper({ error, hint }) {
  if (!error && !hint) return null;
  return (
    <Text className={`mt-1.5 text-meta ${error ? 'font-medium text-danger' : 'text-ink-secondary'}`}>{error ?? hint}</Text>
  );
}
