// After checking out: "1 stamp added", or the friendly "quick note" when it didn't count.
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { StampRow } from '../components/Stamps';
import { Button, Card, Screen, text } from '../components/ui';
import { POINTS_PER_STAMP, STAMPS_PER_VOUCHER } from '../lib/rules';
import { useStore } from '../lib/store';
import { colors, type } from '../theme';

export default function StampAdded() {
  const { lastOutcome, stamps, points } = useStore();
  if (!lastOutcome) return <Redirect href="/home" />;

  if (!lastOutcome.counted) {
    return (
      <Screen style={{ justifyContent: 'space-between' }}>
        <View>
          <Text style={s.kickerPlum}>just so you know</Text>
          <Text style={[type.title, { color: colors.plum, marginBottom: 20 }]}>A quick note</Text>
          <Card>
            <Text style={text.body}>
              {lastOutcome.reason === 'too_short'
                ? `This session was shorter than 30 minutes, so no points this time. No worries, the next one counts.`
                : `You already reached today's limit for this activity, so this one did not add points. It still counts as time outside.`}
            </Text>
          </Card>
        </View>
        <Button label="Got it" onPress={() => router.replace('/home')} />
      </Screen>
    );
  }

  const onCard = stamps % STAMPS_PER_VOUCHER || (stamps > 0 ? STAMPS_PER_VOUCHER : 0);
  const full = lastOutcome.newStamp && onCard === STAMPS_PER_VOUCHER;
  return (
    <Screen dark style={{ justifyContent: 'space-between' }}>
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={s.kicker}>nice work!</Text>
        <Text style={s.title}>{lastOutcome.newStamp ? '1 stamp added' : `+${lastOutcome.points} points`}</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>+{lastOutcome.points}</Text>
        </View>
      </View>
      <Card color={colors.cream}>
        <View style={s.stats}>
          <View>
            <Text style={text.label}>Time outside</Text>
            <Text style={text.heading}>{lastOutcome.minutes} min</Text>
          </View>
          <View>
            <Text style={text.label}>Next stamp</Text>
            <Text style={text.heading}>{points % POINTS_PER_STAMP} of {POINTS_PER_STAMP}</Text>
          </View>
          <View>
            <Text style={text.label}>Stamps</Text>
            <Text style={text.heading}>{onCard} of {STAMPS_PER_VOUCHER}</Text>
          </View>
        </View>
        <StampRow count={stamps} />
        <View style={{ height: 16 }} />
        <Button label={full ? 'Claim my coffee' : 'Done'} onPress={() => router.replace('/home')} />
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { ...type.script, color: colors.yellow },
  kickerPlum: { ...type.script, color: colors.plum },
  title: { ...type.title, color: colors.cream },
  badge: { marginTop: 32, width: 140, height: 140, borderRadius: 70, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  badgeText: { ...type.display, color: colors.plum },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
});
