import { Text, View } from 'react-native';

import BreakdownBar from '@/components/calculator/BreakdownBar';
import ResultTable from '@/components/calculator/ResultTable';
import Icon from '@/components/ui/Icon';
import { accents, colors } from '@/theme/colors';

const INSIGHT_STYLES = {
  positive: { icon: 'checkmark-circle', background: accents.mint.soft, color: accents.mint.ink },
  info: { icon: 'bulb-outline', background: colors.primarySoft, color: colors.primaryDark },
  warning: { icon: 'alert-circle', background: accents.peach.soft, color: accents.peach.ink },
};

const TONE_CLASS = { positive: 'text-success', negative: 'text-danger' };

function ResultRow({ row, first }) {
  return (
    <View className={`min-h-[48px] flex-row items-center justify-between py-3 ${first ? '' : 'border-t border-border'}`}>
      <Text className="flex-1 pr-4 text-body text-ink-secondary">{row.label}</Text>
      <Text
        className={`max-w-[60%] text-right ${row.strong ? 'text-label font-bold' : 'text-body font-semibold'} ${
          TONE_CLASS[row.tone] ?? 'text-ink'
        }`}
      >
        {row.value}
      </Text>
    </View>
  );
}

function Insight({ tone = 'info', text }) {
  const style = INSIGHT_STYLES[tone];
  return (
    <View className="flex-row items-start rounded-2xl px-4 py-3.5" style={{ backgroundColor: style.background }}>
      <Icon name={style.icon} size={18} color={style.color} />
      <Text className="ml-2.5 flex-1 text-body text-ink">{text}</Text>
    </View>
  );
}

export default function ResultPanel({ result, hasErrors, accent }) {
  if (!result) {
    return (
      <View className="mx-5 mt-4 items-center rounded-2xl border border-dashed border-border px-6 py-8">
        <Icon name="calculator-outline" size={22} color={colors.textMuted} />
        <Text className="mt-2 text-center text-body text-ink-secondary">
          {hasErrors ? 'Fix the highlighted field to see the result.' : 'Fill in the fields above to see the result.'}
        </Text>
      </View>
    );
  }

  const { primary, rows, breakdown, insight, table } = result;

  return (
    <View className="mt-4 gap-3 px-5">
      <View
        accessible
        accessibilityLabel={`${primary.label}: ${primary.value}${primary.caption ? `. ${primary.caption}` : ''}`}
        className="rounded-2xl px-5 py-5"
        style={{ backgroundColor: accents[accent].soft }}
      >
        <Text className="text-caption font-medium text-ink-secondary">{primary.label}</Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          className="mt-1 text-[30px] font-bold leading-[38px] tracking-[-0.5px] text-ink"
        >
          {primary.value}
        </Text>
        {primary.caption ? <Text className="mt-1 text-body text-ink-secondary">{primary.caption}</Text> : null}
      </View>

      {rows?.length ? (
        <View className="rounded-2xl border border-border bg-surface px-4">
          {rows.map((row, index) => (
            <ResultRow key={`${index}-${row.label}`} row={row} first={index === 0} />
          ))}
        </View>
      ) : null}

      {breakdown ? <BreakdownBar segments={breakdown} /> : null}
      {insight ? <Insight {...insight} /> : null}
      {table ? <ResultTable {...table} /> : null}
    </View>
  );
}
