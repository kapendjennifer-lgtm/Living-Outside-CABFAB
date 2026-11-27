// Active session: live timer, progress to the 30 minute mark, how to check out.
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TabBar } from '../components/TabBar';
import { Button, Card, Heading, Screen, text } from '../components/ui';
import { ACTIVITIES, REMINDER_AFTER_MIN } from '../lib/rules';
import { SPOTS } from '../lib/spots';
import { useStore } from '../lib/store';
import { colors, type } from '../theme';

const pad = (n: number) => String(n).padStart(2, '0');
const clock = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`;
};

export default function Session() {
  const { active, devShiftStart } = useStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!active) return <Redirect href="/home" />;
  const a = ACTIVITIES[active.activity];
  const spot = SPOTS[active.spot];
  const elapsed = now - active.startedAt;
  const mins = elapsed / 60000;
  const progress = Math.min(1, mins / a.minMinutes);
  const counted = mins >= a.minMinutes;

  return (
    <Screen style={{ justifyContent: 'space-between' }}>
      <View>
        <Heading kicker="working outside" title={`${a.label} outside`} />
        <Card>
          <Text style={text.label}>Session time</Text>
          <Text style={s.timer}>{clock(elapsed)}</Text>
          <View style={s.track}>
            <View style={[s.fill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={[text.body, { marginTop: 8 }]}>
            {counted ? `This session counts. +${a.points} points when you check out.` : `${Math.ceil(a.minMinutes - mins)} min until it counts`}
          </Text>
        </Card>
        {mins >= REMINDER_AFTER_MIN ? (
          <Card color={colors.yellow} style={{ marginTop: 12 }}>
            <Text style={text.heading}>Still outside?</Text>
            <Text style={text.body}>Tap the touchpoint to keep your table.</Text>
          </Card>
        ) : null}
        <Text style={[text.body, { marginTop: 16 }]}>
          At {spot?.name ?? 'your spot'}. Done? Tap the same touchpoint to check out.
        </Text>
        <View style={{ height: 12 }} />
        <Button label="Simulate tap out" onPress={() => router.replace(`/tap/${active.spot}`)} />
        <Text style={s.dev} onPress={() => devShiftStart(15)}>Testing: skip ahead 15 min</Text>
      </View>
      <TabBar active="home" />
    </Screen>
  );
}

const s = StyleSheet.create({
  timer: { ...type.display, color: colors.plum, fontVariant: ['tabular-nums'] },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(105,22,65,0.15)', overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.plum },
  dev: { ...type.label, color: colors.plumSoft, textAlign: 'center', marginTop: 14 },
});
