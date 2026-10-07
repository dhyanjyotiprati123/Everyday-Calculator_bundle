import { View } from 'react-native';

// White rounded container that groups ListRows into one card.
export default function ListGroup({ children }) {
  return <View className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface">{children}</View>;
}
