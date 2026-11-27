// Home: points, stamp progress, and the way into a check-in.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { StampRow } from '../components/Stamps';
import { TabBar } from '../components/TabBar';
import { Button, Card, Heading, Screen, text } from '../components/ui';
import { POINTS_PER_STAMP, STAMPS_PER_VOUCHER } from '../lib/rules';
import { useStore } from '../lib/store';
import { colors, type } from '../theme';

export default function Home() {
  const { points, stamps, reset } = useStore();
  const onCard = stamps % STAMPS_PER_VOUCHER || (stamps > 0 ? STAMPS_PER_VOUCHER : 0);
  const left = STAMPS_PER_VOUCHER - onCard;

  return (
    <Screen style={{ justifyContent: 'space-between' }}>
      <View>
        <Heading kicker="hello there!" title={left > 0 ? 'Your next stamp is getting closer!' : 'Your coffee is ready!'} />
        <Card>
          <Text style={text.label}>Today's progress</Text>
          <View style={s.row}>
            <Text style={s.points}>{points % POINTS_PER_STAMP}</Text>
            <Text style={[text.body, { marginLeft: 6 }]}>of {POINTS_PER_STAMP} pts to your next stamp</Text>
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: `${((points % POINTS_PER_STAMP) / POINTS_PER_STAMP) * 100}%` }]} />
          </View>
          <StampRow count={stamps} />
          <Text style={[text.body, { marginTop: 10 }]}>
            {left > 0 ? `${left} more ${left === 1 ? 'stamp' : 'stamps'} to a free coffee` : 'Show your voucher at the bar'}
          </Text>
        </Card>
        <View style={{ height: 16 }} />
        <Button label="Tap to check in" onPress={() => router.push('/checkin')} />
      </View>
      <View>
        <Text style={s.dev} onPress={reset}>Reset demo data</Text>
        <TabBar active="home" />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 8 },
  points: { ...type.display, color: colors.plum },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(105,22,65,0.15)', overflow: 'hidden', marginBottom: 14 },
  fill: { height: 8, backgroundColor: colors.plum },
  dev: { ...type.label, color: colors.plumSoft, textAlign: 'center', marginBottom: 12 },
});
