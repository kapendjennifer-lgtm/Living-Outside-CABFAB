// Meeting lobby: who has tapped in so far. A meeting needs at least 2 people,
// and everyone taps their own phone. Max 2 counted meetings a day.
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bar, Chip, Label, Note, PersonRow, Title, TopLink } from '../../components/kit';
import { TabBar } from '../../components/TabBar';
import { Screen } from '../../components/ui';
import { MEETINGS_PER_DAY } from '../../lib/rules';
import { useStore } from '../../lib/store';
import { clock, useNow } from '../../lib/time';
import { colors, fonts } from '../../theme';

const JOIN_WINDOW = 5 * 60000;
const ARRIVALS = ['Mara', 'Justin'];

export default function Lobby() {
  const { earned } = useStore();
  const [openedAt] = useState(Date.now());
  const [people, setPeople] = useState(['Lena']);
  const now = useNow();
  const left = Math.max(0, JOIN_WINDOW - (now - openedAt));

  // Colleagues tap in one by one (simulated).
  useEffect(() => {
    const ids = ARRIVALS.map((n, i) => setTimeout(() => setPeople((p) => (p.includes(n) ? p : [...p, n])), 1500 * (i + 1)));
    return () => ids.forEach(clearTimeout);
  }, []);

  const day = new Date().toDateString();
  const meetingsToday = earned.filter((e) => e.activity === 'meeting' && new Date(e.at).toDateString() === day).length;

  return (
    <Screen scroll footer={<TabBar active="people" />} style={{ gap: 12 }}>
      <TopLink onPress={() => router.replace('/meeting')} />
      <Title>Outdoor meeting</Title>
      <View style={s.card}>
        <Label>Join time left</Label>
        <Text style={s.big}>{clock(left)}</Text>
        <Bar value={left / JOIN_WINDOW} />
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Simulate a tap to join" onPress={() => router.replace(`/meeting/waiting?people=${people.join(',')}`)}>
        <Note icon="nfc">Tap the touchpoint to join</Note>
      </Pressable>
      {meetingsToday >= MEETINGS_PER_DAY ? (
        <Note style={{ backgroundColor: colors.sky }}>{`You already had ${MEETINGS_PER_DAY} meetings today. This one will not add points, but enjoy it outside.`}</Note>
      ) : null}
      <Label>Tapped in</Label>
      <View style={{ gap: 8 }}>
        {people.map((p, i) => (
          <PersonRow key={p} name={p} right={i === 0 ? <Chip label="Host" color={colors.yellow} /> : undefined} />
        ))}
      </View>
      {people.length < 2 ? <Text style={s.wait}>Waiting for at least 2 people</Text> : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.sky, borderRadius: 24, padding: 24, gap: 8 },
  big: { fontFamily: fonts.bold, fontSize: 56, letterSpacing: -1.7, color: colors.plum },
  wait: { fontFamily: fonts.medium, fontSize: 14, color: colors.plum, textAlign: 'center' },
});
