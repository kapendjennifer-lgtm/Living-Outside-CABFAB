// Bigger cards shared by Home, onboarding and the rules screen.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, type } from '../theme';
import { Icon, type IconName } from './Icons';
import { Bar, IconDisc, Label } from './kit';
import { StampGrid } from './Stamps';

// Sky "Your Points" hero: 30 pts out of 50, track, cup circle, arrow.
export function PointsCard({ points, onPress }: { points: number; onPress?: () => void }) {
  const left = 50 - points;
  return (
    <View style={s.points}>
      <Text style={s.pointsLabel}>Your Points</Text>
      <View style={s.pointsRow}>
        <Text style={s.pointsBig}>{points}</Text>
        <Text style={s.pointsUnit}>pts</Text>
      </View>
      <Text style={s.small}>out of 50 points</Text>
      <View style={{ marginTop: 14, width: '62%' }}>
        <Bar value={points / 50} track={colors.cream} />
        <View style={s.ends}>
          <Text style={s.tiny}>0 pts</Text>
          <Text style={s.tiny}>50 pts</Text>
        </View>
      </View>
      <Text style={[s.small, { marginTop: 10, width: '60%' }]}>{left} more points to your next stamp</Text>
      <View style={s.cupCircle}>
        <Icon name="cup" size={64} color={colors.yellow} stroke={1.4} />
      </View>
      {onPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel="See all stamps" onPress={onPress} style={s.arrow}>
          <Icon name="arrow" size={22} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function StampsCard({ stamps }: { stamps: number }) {
  const onCard = stamps % 8 || (stamps > 0 ? 8 : 0);
  return (
    <View style={s.stamps}>
      <View style={s.stampsHead}>
        <Label>Your stamps</Label>
        <Text style={s.stampsCount}>{onCard}/8</Text>
      </View>
      <StampGrid count={stamps} />
    </View>
  );
}

export type DayRow = { icon: IconName; label: string; time: string; points: number };

// "TODAY OUTSIDE 2h 00m" with a row per activity and the points total.
export function DayOverview({ total, rows, toNext }: { total: string; rows: DayRow[]; toNext: number }) {
  const earned = rows.reduce((n, r) => n + r.points, 0);
  return (
    <View style={s.day}>
      <Label>Today outside</Label>
      <Text style={s.dayTotal}>{total}</Text>
      {rows.length === 0 ? <Text style={s.small}>No sessions yet today.</Text> : null}
      {rows.map((r) => (
        <View key={r.label} style={s.dayRow}>
          <IconDisc name={r.icon} size={36} />
          <Text style={[s.dayText, { flex: 1 }]}>{r.label}</Text>
          <Text style={s.dayText}>{r.time}</Text>
          <Text style={[s.dayText, s.dayPts]}>+{r.points} pts</Text>
        </View>
      ))}
      <View style={s.dayFoot}>
        <Text style={s.dayText}>Points earned</Text>
        <Text style={[s.dayText, { fontFamily: fonts.bold }]}>{earned} pts</Text>
      </View>
      <Text style={s.small}>{toNext} pts to your next stamp</Text>
    </View>
  );
}

export type RuleRow = { icon: IconName; title: string; sub: string; points: number };

export function RuleList({ rows, dark }: { rows: RuleRow[]; dark?: boolean }) {
  return (
    <View style={{ gap: 8 }}>
      {rows.map((r) => (
        <View key={r.title} style={[s.rule, dark && { borderColor: colors.cream }]}>
          <IconDisc name={r.icon} />
          <View style={{ flex: 1 }}>
            <Text style={s.ruleTitle}>{r.title}</Text>
            <Text style={s.ruleSub}>{r.sub}</Text>
          </View>
          <View style={s.rulePts}>
            <Text style={s.rulePtsBig}>{r.points}</Text>
            <Text style={s.ruleSub}>pts</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  points: { backgroundColor: colors.sky, borderRadius: 24, padding: 24, overflow: 'hidden', minHeight: 250 },
  pointsLabel: { fontFamily: fonts.medium, fontSize: 18, color: colors.plum },
  pointsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  pointsBig: { fontFamily: fonts.bold, fontSize: 64, letterSpacing: -1.9, color: colors.plum },
  pointsUnit: { fontFamily: fonts.medium, fontSize: 20, color: colors.plum },
  small: { ...type.small, color: colors.plum },
  tiny: { fontFamily: fonts.regular, fontSize: 12, color: colors.plum },
  ends: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  cupCircle: {
    position: 'absolute', right: -30, top: 40, width: 150, height: 150, borderRadius: 75, backgroundColor: colors.plum,
    alignItems: 'center', justifyContent: 'center',
  },
  arrow: {
    position: 'absolute', right: 16, bottom: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.yellow,
    alignItems: 'center', justifyContent: 'center',
  },
  stamps: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.plum, borderRadius: 24, padding: 20, gap: 14 },
  stampsHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stampsCount: { fontFamily: fonts.bold, fontSize: 18, color: colors.plum },
  day: { backgroundColor: colors.cream, borderRadius: 24, padding: 20, gap: 10 },
  dayTotal: { fontFamily: fonts.bold, fontSize: 40, letterSpacing: -1, color: colors.plum },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayText: { fontFamily: fonts.medium, fontSize: 15, color: colors.plum },
  dayPts: { width: 64, textAlign: 'right' },
  dayFoot: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1.5, borderTopColor: colors.plum, paddingTop: 10 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 20, borderWidth: 1.5, borderColor: colors.plum, padding: 12 },
  ruleTitle: { fontFamily: fonts.medium, fontSize: 16, color: colors.plum },
  ruleSub: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.plum, opacity: 0.85 },
  rulePts: { alignItems: 'center', minWidth: 40 },
  rulePtsBig: { fontFamily: fonts.bold, fontSize: 24, color: colors.plum },
});
