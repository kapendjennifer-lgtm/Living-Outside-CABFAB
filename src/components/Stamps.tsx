// Stamp card row: 8 circles, filled ones are earned.
import { StyleSheet, View } from 'react-native';
import { STAMPS_PER_VOUCHER } from '../lib/rules';
import { colors } from '../theme';

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
});
