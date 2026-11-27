// Push notification at 2 hours, as it shows on the lock screen.
// (The real push arrives with Supabase + expo-notifications; this is its look.)
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { IconDisc, Label } from '../components/kit';
import { Button, Screen } from '../components/ui';
import { COPY } from '../lib/copy';
import { useStore } from '../lib/store';
import { clock, hhmm, useNow } from '../lib/time';
import { colors, fonts } from '../theme';

export default function Reminder() {
  const { active, tapAgain } = useStore();
  const now = useNow();
  if (!active) return <Redirect href="/home" />;
  const date = new Date(now).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Screen dark style={{ justifyContent: 'space-between' }}>
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Text style={s.date}>{date}</Text>
        <Text style={s.time}>{hhmm(now)}</Text>
      </View>
      <View style={s.card}>
        <View style={s.head}>
          <IconDisc name={COPY[active.activity].icon} />
          <Text style={s.title}>Still working outside?</Text>
        </View>
        <Label>Session time</Label>
        <Text style={s.clock}>{clock(now - active.startedAt)}</Text>
        <View style={s.row}>
          <Button
            variant="sky"
            label="Still here"
            style={{ flex: 1 }}
            onPress={() => {
              tapAgain();
              router.replace('/session');
            }}
          />
          <Button label="End session" style={{ flex: 1 }} onPress={() => router.replace('/checkout')} />
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  date: { fontFamily: fonts.medium, fontSize: 17, color: colors.white },
  time: { fontFamily: fonts.bold, fontSize: 85, letterSpacing: -2, color: colors.white },
  card: { backgroundColor: colors.cream, borderRadius: 28, padding: 20, gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  title: { flex: 1, fontFamily: fonts.bold, fontSize: 25, lineHeight: 28, color: colors.plum },
  clock: { fontFamily: fonts.bold, fontSize: 32, color: colors.plum },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
});
