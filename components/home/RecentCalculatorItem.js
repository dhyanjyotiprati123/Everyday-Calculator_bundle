import ListRow from '@/components/ui/ListRow';
import { getCalculator } from '@/data/calculators';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

// e.g. "EMI Calculator" / "₹25,000 loan · 3 min ago"
export default function RecentCalculatorItem({ entry, onPress, showDivider }) {
  const calculator = getCalculator(entry.calculatorId);
  const context = entry.detail || calculator.subtitle;

  return (
    <ListRow
      icon={calculator.icon}
      accent={calculator.accent}
      title={calculator.name}
      subtitle={`${context} · ${formatRelativeTime(entry.usedAt)}`}
      onPress={onPress}
      showDivider={showDivider}
    />
  );
}
