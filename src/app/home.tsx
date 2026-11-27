// Home: points, stamp progress, and the way into a check-in.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { StampRow } from '../components/Stamps';
import { TabBar } from '../components/TabBar';
import { Button, Card, Heading, Screen, text } from '../components/ui';
import { STAMPS_PER_VOUCHER } from '../lib/rules';
import { useStore } from '../lib/store';
import { colors, type } from '../theme';

export default function Home() {
  const { points, stamps, reset } = useStore();
  const left = STAMPS_PER_VOUCHER - stamps.length;

  return (
    <Screen style={{ justifyContent: 'space-between' }}>
      <View>
        <Heading kicker="hello there!" title={left > 0 ? 'Your next stamp is getting closer!' : 'Your coffee is ready!'} />
        <Card>
          <Text style={text.label}>Today's progress</Text>
          <View style={s.row}>
            <Text style={s.points}>{points}</Text>
            <Text style={[text.body, { marginLeft: 6 }]}>points</Text>
          </View>
          <StampRow count={stamps.length} />
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
  dev: { ...type.label, color: colors.plumSoft, textAlign: 'center', marginBottom: 12 },
});
