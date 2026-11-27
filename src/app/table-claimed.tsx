// "Heads up": someone wants your table. Tap within 2 minutes to keep it,
// otherwise your session ends and the table is freed.
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bar, Kicker, Label, Title } from '../components/kit';
import { TabBar } from '../components/TabBar';
import { TapMini } from '../components/TapTarget';
import { Button, Screen } from '../components/ui';
import { useStore } from '../lib/store';
import { clock, useNow } from '../lib/time';
import { colors, fonts, type } from '../theme';

const WINDOW = 2 * 60000;

export default function TableClaimed() {
  const { active, tapAgain, checkOut } = useStore();
  const [since] = useState(Date.now());
  const now = useNow();
  const left = Math.max(0, WINDOW - (now - since));

  useEffect(() => {
    if (left === 0 && active) {
      const o = checkOut();
      router.replace(o?.counted ? '/stamp' : `/note?reason=${o?.counted === false ? o.reason : 'too_short'}`);
    }
  }, [left, active, checkOut]);

  if (!active) return <Redirect href="/home" />;
  return (
    <Screen scroll footer={<TabBar active="home" />} style={{ gap: 14 }}>
      <Kicker>heads up</Kicker>
      <Title>Someone wants your table.</Title>
      <Text style={s.body}>Tap the touchpoint within 2 minutes to keep it.</Text>
      <View style={s.card}>
        <Label>Time left to tap</Label>
        <Text style={s.big}>{clock(left)}</Text>
        <Bar value={left / WINDOW} />
      </View>
      <TapMini />
      <Button
        label="Simulate tap"
        onPress={() => {
          tapAgain();
          router.replace('/session');
        }}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  body: { ...type.body, color: colors.plum },
  card: { backgroundColor: colors.sky, borderRadius: 24, padding: 24, gap: 8 },
  big: { fontFamily: fonts.bold, fontSize: 56, letterSpacing: -1.7, color: colors.plum },
});
