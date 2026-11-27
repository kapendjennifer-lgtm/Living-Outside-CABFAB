// Stamp card row: 8 circles, filled ones are earned.
import { StyleSheet, View } from 'react-native';
import { STAMPS_PER_VOUCHER } from '../lib/rules';
import { colors } from '../theme';
import { Icon } from './Icons';

export function StampRow({ count, onDark }: { count: number; onDark?: boolean }) {
  const filled = count % STAMPS_PER_VOUCHER || (count > 0 ? STAMPS_PER_VOUCHER : 0);
  const edge = onDark ? colors.cream : colors.plum;
  return (
    <View style={s.row} accessibilityLabel={`${filled} of ${STAMPS_PER_VOUCHER} stamps`}>
      {Array.from({ length: STAMPS_PER_VOUCHER }, (_, i) => (
        <View
          key={i}
          style={[s.dot, { borderColor: edge, backgroundColor: i < filled ? colors.plum : 'transparent' }, i === filled - 1 && s.latest]}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5 },
  latest: { backgroundColor: colors.yellow, borderColor: colors.plum },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  big: { width: '22%', aspectRatio: 1, borderRadius: 999, borderWidth: 1.5, borderColor: colors.plum, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  mid: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.plum, borderStyle: 'dashed' },
});

// Home "YOUR STAMPS" card: 4 x 2 big circles, earned ones filled with an activity icon.
const GRID_ICONS = ['laptop', 'walk', 'cup', 'group'] as const;
export function StampGrid({ count }: { count: number }) {
  const filled = count % STAMPS_PER_VOUCHER || (count > 0 ? STAMPS_PER_VOUCHER : 0);
  return (
    <View style={s.grid}>
      {Array.from({ length: STAMPS_PER_VOUCHER }, (_, i) => {
        const on = i < filled;
        const bg = on ? (i % 2 ? colors.plum : colors.sky) : 'transparent';
        return (
          <View key={i} style={[s.big, on ? { backgroundColor: bg, borderStyle: 'solid' } : null]}>
            {on ? <Icon name={GRID_ICONS[i % 4]} size={30} color={i % 2 ? colors.yellow : colors.plum} /> : null}
          </View>
        );
      })}
    </View>
  );
}

// Summary card dots: plum filled, the newest one yellow, empty ones dashed.
export function StampDots({ count, fresh }: { count: number; fresh?: boolean }) {
  const filled = count % STAMPS_PER_VOUCHER || (count > 0 ? STAMPS_PER_VOUCHER : 0);
  return (
    <View style={s.row} accessibilityLabel={`${filled} of ${STAMPS_PER_VOUCHER} stamps`}>
      {Array.from({ length: STAMPS_PER_VOUCHER }, (_, i) => (
        <View
          key={i}
          style={[
            s.mid,
            i < filled ? { backgroundColor: colors.plum, borderStyle: 'solid' } : null,
            fresh && i === filled - 1 ? { backgroundColor: colors.yellow, borderStyle: 'solid' } : null,
          ]}
        />
      ))}
    </View>
  );
}
