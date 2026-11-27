// "How points work" (rewards tab): what each activity earns and the fair play rules.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { RuleList } from '../components/Cards';
import { Kicker, Label } from '../components/kit';
import { TabBar } from '../components/TabBar';
import { Button, Screen } from '../components/ui';
import { FAIR_PLAY, HOW_POINTS_WORK } from '../lib/rulesCopy';
import { useStore } from '../lib/store';
import { colors, fonts, type } from '../theme';

export default function HowPointsWork() {
  const { vouchersReady, vouchersUsed } = useStore();
  return (
    <Screen dark scroll footer={<TabBar active="rewards" />} style={{ gap: 14 }}>
      <Kicker dark>50 points = 1 stamp</Kicker>
      <Text style={s.title}>How points work</Text>
      {vouchersReady > 0 || vouchersUsed.length > 0 ? (
        <Button variant="yellow" label={vouchersReady > 0 ? 'Show my coffee voucher' : 'See my used voucher'} onPress={() => router.push('/voucher')} />
      ) : null}
      <Label dark>How you earn</Label>
      <RuleList rows={HOW_POINTS_WORK} dark />
      <Label dark style={{ marginTop: 8 }}>Fair play</Label>
      <View style={s.fair}>
        {FAIR_PLAY.map((f) => (
          <View key={f} style={s.bullet}>
            <View style={s.dot} />
            <Text style={s.fairText}>{f}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 50, letterSpacing: -1.4, color: colors.cream },
  fair: { backgroundColor: colors.cream, borderRadius: 24, padding: 20, gap: 12 },
  bullet: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: colors.plum },
  fairText: { ...type.body, color: colors.plum, flex: 1 },
});
